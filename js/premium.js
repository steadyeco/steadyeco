/* ══════════════════════════════════════════════════════════
   STEADY ECO — Premium Shared JS
   Drop-in premium features for all pages.
   Requires: GSAP + ScrollTrigger loaded before this file.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. PRELOADER (skip if already seen this session) ── */
  (function initPreloader() {
    var preloader = document.getElementById('preloader');
    var preFill = document.getElementById('preFill');
    var alreadySeen = sessionStorage.getItem('se_preloader_seen');

    function revealHero() {
      var hero = document.getElementById('hero');
      if (hero) hero.classList.add('hero-revealed');
    }

    function exitPreloader() {
      if (!preloader) { revealHero(); return; }
      preloader.classList.add('exit');
      setTimeout(function () {
        preloader.remove();
        revealHero();
      }, 720);
    }

    // Skip preloader for returning visitors in same session
    if (REDUCED_MOTION || !preloader || alreadySeen) {
      revealHero();
      if (preloader) preloader.remove();
      return;
    }

    sessionStorage.setItem('se_preloader_seen', '1');

    requestAnimationFrame(function () {
      if (preFill) preFill.style.width = '100%';
    });

    var exited = false;
    function tryExit() {
      if (exited) return;
      exited = true;
      exitPreloader();
    }

    window.addEventListener('load', tryExit, { once: true });
    setTimeout(tryExit, 1800);
  })();

  /* ── 2. SCROLL PROGRESS BAR ── */
  (function initScrollProgress() {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  })();

  /* ── 3. NAV — SCROLLED STATE + HIDE ON SCROLL DOWN ── */
  (function initNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let lastScrollY = 0;
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 40);
      if (y > 120) {
        navbar.classList.toggle('nav-hidden', y > lastScrollY);
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastScrollY = y;
    }, { passive: true });
  })();

  /* ── 4. MOBILE MENU ── */
  window.toggleMenu = function () {
    var menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
  };
  // Close on outside click
  document.addEventListener('click', function (e) {
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.querySelector('.hamburger');
    if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  /* ── 5. GSAP SCROLL REVEALS ── */
  (function initScrollReveals() {
    if (REDUCED_MOTION || typeof gsap === 'undefined') {
      document.body.classList.add('js-ready');
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      document.querySelectorAll('.section-title').forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Set initial hidden state
    gsap.set('.fade-in:not(.section-title)', { opacity: 0, y: 30 });
    gsap.set('.section-title', { opacity: 0 });

    // Batch stagger reveal
    function reveal(selector, stagger, start) {
      var elements = document.querySelectorAll(selector);
      if (!elements.length) return;
      ScrollTrigger.batch(selector, {
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: stagger || 0.1,
            overwrite: true
          });
        },
        start: start || 'top 88%',
        once: true
      });
    }

    // Section titles — fade in + trigger CSS reveal
    ScrollTrigger.batch('.section-title', {
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.08 });
        batch.forEach(function (el) { el.classList.add('revealed'); });
      },
      start: 'top 85%',
      once: true
    });

    // Reveal all common elements
    reveal('.section-tag', 0.08);
    reveal('.se-stats__item', 0.14, 'top 85%');
    reveal('.service-card', 0.12);
    reveal('.process-step', 0.13);
    reveal('.process-cta', 0.08);
    reveal('.fade-in', 0.09);
    reveal('.faq-item', 0.07);

  })();

  /* ── 6. FAQ ACCORDION ── */
  window.toggleFaq = function (btn) {
    var answer = btn.nextElementSibling;
    var isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-q.open').forEach(function (q) {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('visible');
    });
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('visible');
    }
  };

  /* ── 7. STATS COUNTER ANIMATION ── */
  (function initCounters() {
    var statsSection = document.querySelector('.se-stats');
    if (!statsSection) return;

    function animateCounters() {
      document.querySelectorAll('.se-stats__number').forEach(function (counter) {
        var target = parseInt(counter.dataset.target);
        if (isNaN(target)) return;
        var duration = 1800;
        var start = performance.now();
        function update(time) {
          var elapsed = time - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.textContent = target;
        }
        requestAnimationFrame(update);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  })();

  /* ── 8. CUSTOM CURSOR + MAGNETIC HOVER ── */
  (function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var ringX = mouseX, ringY = mouseY;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate(calc(-50% + ' + mouseX + 'px), calc(-50% + ' + mouseY + 'px))';
      updateCursorState(e.target);
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = 'translate(calc(-50% + ' + ringX + 'px), calc(-50% + ' + ringY + 'px))';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mousedown', function () {
      ring.classList.add('pulse');
      ring.addEventListener('animationend', function () { ring.classList.remove('pulse'); }, { once: true });
    });

    function updateCursorState(target) {
      var isCta = target.closest('.btn');
      var isCard = target.closest('[data-cursor="view"]');
      var isLink = target.closest('a, button') && !isCta;
      document.body.classList.toggle('cursor-cta', !!isCta);
      document.body.classList.toggle('cursor-card', !isCta && !!isCard);
      document.body.classList.toggle('cursor-link', !isCta && !isCard && !!isLink);
    }

    // Magnetic hover
    var MAGNETIC_RANGE = 60;
    var MAGNETIC_PULL = 0.38;
    var magnetTargets = document.querySelectorAll('.btn, .nav-links a');

    magnetTargets.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAGNETIC_RANGE) {
          el.style.transform = 'translate(' + (dx * MAGNETIC_PULL) + 'px, ' + (dy * MAGNETIC_PULL) + 'px)';
          el.style.transition = 'transform 0.2s cubic-bezier(0.16,1,0.3,1)';
        }
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, color 0.3s ease, border-color 0.3s ease';
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  })();

  /* ── 9. FORMSPREE CONTACT FORM ── */
  (function initContactForm() {
    var form = document.querySelector('form[action*="formspree"]');
    if (!form) return;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        var res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = '<div class="form-success"><div class="form-success-icon">&#10003;</div><div class="form-success-title">Enquiry Sent</div><p>We\'ll get back to you within 1 business day.</p></div>';
        } else {
          btn.textContent = origText;
          btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = origText;
        btn.disabled = false;
      }
    });
  })();

  /* ── 10. FOOTER YEAR ── */
  (function initFooterYear() {
    var el = document.getElementById('footer-year') || document.getElementById('fy');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
