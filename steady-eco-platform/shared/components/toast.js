/**
 * STEADY ECO — TOAST NOTIFICATION COMPONENT
 * Success, warning, error, info. Auto-dismiss at 4s.
 * Swipe to dismiss on mobile.
 */

const ICONS = {
  success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warning: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L1 18h18L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 8v4M10 14.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v5M10 6.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
}

let container = null

function ensureContainer() {
  if (container && document.body.contains(container)) return container
  container = document.createElement('div')
  container.className = 'toast-container'
  container.setAttribute('aria-live', 'polite')
  container.setAttribute('role', 'status')
  document.body.appendChild(container)
  return container
}

export const Toast = {

  show(message, type = 'info', duration = 4000) {
    const el = document.createElement('div')
    el.className = `toast toast--${type}`
    el.innerHTML = `
      <span class="toast__icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast__message">${message}</span>
      <span class="toast__time">now</span>
    `

    ensureContainer().appendChild(el)

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('is-visible')
      })
    })

    // Auto dismiss
    const timer = setTimeout(() => this.dismiss(el), duration)

    // Click to dismiss
    el.addEventListener('click', () => {
      clearTimeout(timer)
      this.dismiss(el)
    })

    return el
  },

  dismiss(el) {
    el.classList.remove('is-visible')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    // Fallback removal
    setTimeout(() => { if (el.parentNode) el.remove() }, 500)
  },

  success(msg, duration) { return this.show(msg, 'success', duration) },
  warning(msg, duration) { return this.show(msg, 'warning', duration) },
  error(msg, duration)   { return this.show(msg, 'error', duration) },
  info(msg, duration)    { return this.show(msg, 'info', duration) },
}
