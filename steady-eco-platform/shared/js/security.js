/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — SECURITY MODULE
 * Input sanitisation, CSP enforcement, encryption helpers.
 * Every piece of user input passes through here.
 * ═══════════════════════════════════════════════════════════
 */

export const Security = {

  /* ── INPUT SANITISATION ────────────────────────────── */

  /**
   * Strip HTML tags from a string. Prevents XSS.
   */
  sanitizeText(input) {
    if (typeof input !== 'string') return ''
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  },

  /**
   * Validate and sanitize an email address.
   */
  sanitizeEmail(input) {
    if (typeof input !== 'string') return ''
    const trimmed = input.trim().toLowerCase()
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(trimmed) ? trimmed : ''
  },

  /**
   * Validate and format an Australian phone number.
   * Accepts: 0456190202, 04 5619 0202, +61456190202
   * Returns: 0456 190 202 (display) or '' if invalid
   */
  sanitizePhone(input) {
    if (typeof input !== 'string') return ''
    const digits = input.replace(/\D/g, '')

    // Handle +61 prefix
    let normalised = digits
    if (normalised.startsWith('61') && normalised.length === 11) {
      normalised = '0' + normalised.slice(2)
    }

    // Must be 10 digits starting with 0
    if (normalised.length !== 10 || !normalised.startsWith('0')) return ''

    return `${normalised.slice(0, 4)} ${normalised.slice(4, 7)} ${normalised.slice(7)}`
  },

  /**
   * Sanitize a number within a range.
   */
  sanitizeNumber(input, min = 0, max = Infinity) {
    const num = parseFloat(input)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  },

  /**
   * Sanitize a date string to ISO 8601.
   */
  sanitizeDate(input) {
    if (!input) return ''
    const date = new Date(input)
    if (isNaN(date.getTime())) return ''
    return date.toISOString()
  },

  /**
   * Prevent path traversal in file names.
   */
  sanitizeFileName(input) {
    if (typeof input !== 'string') return ''
    return input.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255)
  },


  /* ── ENCRYPTION (AES-256-GCM) ──────────────────────── */

  /**
   * Derive an encryption key from a passphrase.
   */
  async deriveKey(passphrase) {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    )

    const salt = encoder.encode('steady-eco-salt-v1')
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  },

  /**
   * Encrypt a string with AES-256-GCM.
   * Returns base64-encoded { iv, ciphertext }.
   */
  async encrypt(plaintext, key) {
    const encoder = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    )

    return JSON.stringify({
      iv: btoa(String.fromCharCode(...iv)),
      ct: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    })
  },

  /**
   * Decrypt an AES-256-GCM encrypted string.
   */
  async decrypt(encryptedJson, key) {
    const { iv: ivB64, ct: ctB64 } = JSON.parse(encryptedJson)
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0))
    const ciphertext = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0))

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )

    return new TextDecoder().decode(decrypted)
  },


  /* ── RATE LIMITING (client-side) ───────────────────── */

  /**
   * Check if an action is rate limited.
   * Returns { allowed, remaining, resetAt }.
   */
  checkRateLimit(action, maxRequests, windowMs) {
    const key = `se_ratelimit_${action}`
    const now = Date.now()

    let data
    try {
      data = JSON.parse(localStorage.getItem(key)) || { timestamps: [] }
    } catch {
      data = { timestamps: [] }
    }

    // Remove expired timestamps
    data.timestamps = data.timestamps.filter(t => now - t < windowMs)

    if (data.timestamps.length >= maxRequests) {
      const resetAt = data.timestamps[0] + windowMs
      return { allowed: false, remaining: 0, resetAt }
    }

    data.timestamps.push(now)
    localStorage.setItem(key, JSON.stringify(data))
    return {
      allowed: true,
      remaining: maxRequests - data.timestamps.length,
      resetAt: null,
    }
  },
}
