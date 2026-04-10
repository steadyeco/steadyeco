/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — SHARED UTILITIES
 * Date formatting, currency, time helpers, and other
 * common operations used across all portals.
 * ═══════════════════════════════════════════════════════════
 */

export const Utils = {

  /* ── CURRENCY ──────────────────────────────────────── */

  /**
   * Format a number as AUD currency.
   * formatCurrency(3200) → "$3,200.00"
   * formatCurrency(3200, false) → "$3,200"
   */
  formatCurrency(amount, showCents = true) {
    const num = parseFloat(amount) || 0
    return num.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    })
  },

  /**
   * Calculate GST (Australian 10%).
   * Returns { subtotal, gst, total }.
   */
  calcGst(total) {
    const t = parseFloat(total) || 0
    const gst = t / 11
    return {
      subtotal: +(t - gst).toFixed(2),
      gst: +gst.toFixed(2),
      total: +t.toFixed(2),
    }
  },


  /* ── DATE / TIME ───────────────────────────────────── */

  /**
   * Format a date for display.
   * formatDate('2026-04-10') → "10 Apr 2026"
   */
  formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  },

  /**
   * Format a date with time.
   * formatDateTime('2026-04-10T07:30:00') → "10 Apr 2026, 7:30 AM"
   */
  formatDateTime(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  },

  /**
   * Relative time: "2 mins ago", "3 hours ago", "Yesterday".
   */
  timeAgo(dateStr) {
    if (!dateStr) return ''
    const now = Date.now()
    const then = new Date(dateStr).getTime()
    const diff = now - then

    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`

    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`

    return this.formatDate(dateStr)
  },

  /**
   * Get today's date as YYYY-MM-DD.
   */
  today() {
    return new Date().toISOString().split('T')[0]
  },

  /**
   * Get greeting based on time of day.
   */
  greeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  },

  /**
   * Format duration in minutes to "Xh Ym".
   */
  formatDuration(minutes) {
    if (!minutes || minutes < 0) return '0m'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  },


  /* ── STRING HELPERS ────────────────────────────────── */

  /**
   * Generate initials from a name.
   * initials("Sam Kerr") → "SK"
   */
  initials(name) {
    if (!name) return ''
    return name
      .split(' ')
      .filter(Boolean)
      .map(w => w[0].toUpperCase())
      .slice(0, 2)
      .join('')
  },

  /**
   * Truncate a string with ellipsis.
   */
  truncate(str, maxLen = 50) {
    if (!str || str.length <= maxLen) return str || ''
    return str.slice(0, maxLen - 1).trimEnd() + '\u2026'
  },

  /**
   * Slugify a string: "Cairns City" → "cairns-city".
   */
  slugify(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  },


  /* ── DOM HELPERS ───────────────────────────────────── */

  /**
   * Shorthand for querySelector.
   */
  $(selector, parent = document) {
    return parent.querySelector(selector)
  },

  /**
   * Shorthand for querySelectorAll.
   */
  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
  },

  /**
   * Debounce a function.
   */
  debounce(fn, delay = 300) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  },

  /**
   * Wait for a number of milliseconds.
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
}
