/**
 * STEADY ECO — CLIENT PORTAL SERVICE WORKER
 * Network-first for HTML (prevents iOS white-screen).
 * Cache-first for static assets.
 * Relative paths for subdirectory deployment.
 */

const CACHE = 'se-client-v3'

const OFFLINE_HTML = '<html><body style="background:#0a0f0a;color:#e8ede6;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><div><h1 style="font-size:24px;margin-bottom:16px">You\'re offline</h1><p style="color:#7a8f76">This page will load when you\'re back online.</p><p style="margin-top:16px"><button onclick="location.reload()" style="background:#4a9e3f;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:16px;cursor:pointer">Try Again</button></p></div></body></html>'

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([])))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return

  // HTML navigation: NETWORK-FIRST (fixes iOS white screen)
  if (e.request.mode === 'navigate' || e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) { const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl)) }
        return r
      }).catch(() =>
        caches.match(e.request).then(c =>
          c || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } })
        )
      )
    )
    return
  }

  // Static assets: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(c => {
      const fp = fetch(e.request).then(r => {
        if (r.ok) { const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl)) }
        return r
      }).catch(() => c)
      return c || fp
    })
  )
})
