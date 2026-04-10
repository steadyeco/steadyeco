/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — API CLIENT
 * HTTP client with retry, offline queueing, and auth headers.
 * Currently wraps localStorage operations.
 * When a backend exists, this becomes the real API client
 * with zero changes to calling code.
 * ═══════════════════════════════════════════════════════════
 */

import { Auth } from './auth.js'
import { Sync } from './sync.js'

const DEFAULT_TIMEOUT = 10000 // 10 seconds

export const Api = {

  /**
   * Make an API request.
   * In PWA mode, this is a no-op passthrough.
   * When backend exists, this makes real HTTP calls.
   */
  async request(method, endpoint, data = null, options = {}) {
    const session = Auth.getSession()

    // Check if we're in offline/PWA mode (no backend yet)
    if (!this._hasBackend()) {
      return { ok: true, data, _local: true }
    }

    // Online mode with real backend
    const headers = {
      'Content-Type': 'application/json',
    }

    if (session) {
      headers['Authorization'] = `Bearer ${session.id}`
    }

    const config = {
      method,
      headers,
      signal: AbortSignal.timeout(options.timeout || DEFAULT_TIMEOUT),
    }

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(endpoint, config)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json = await response.json()
      return { ok: true, data: json }
    } catch (err) {
      // If offline, queue the mutation
      if (!navigator.onLine && method !== 'GET') {
        Sync.queue({ method, endpoint, data })
        return { ok: true, queued: true }
      }

      return { ok: false, error: err.message }
    }
  },

  get(endpoint, options)        { return this.request('GET', endpoint, null, options) },
  post(endpoint, data, options) { return this.request('POST', endpoint, data, options) },
  put(endpoint, data, options)  { return this.request('PUT', endpoint, data, options) },
  del(endpoint, options)        { return this.request('DELETE', endpoint, null, options) },

  /**
   * Call the Claude API (Cassowary AI).
   */
  async askCassowary(messages, systemPrompt) {
    const apiKey = this._getAiKey()
    if (!apiKey) {
      return { ok: false, error: 'No API key configured. Set it in Settings.' }
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message || `HTTP ${response.status}`)
      }

      const json = await response.json()
      return {
        ok: true,
        text: json.content[0]?.text || '',
        usage: json.usage,
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },

  /* ── INTERNALS ────────────────────────────────────── */

  _hasBackend() {
    // Check if a backend API URL is configured
    try {
      const settings = JSON.parse(localStorage.getItem('se_settings')) || []
      return settings.some(s => s.key === 'api_url' && s.value)
    } catch {
      return false
    }
  },

  _getAiKey() {
    try {
      return localStorage.getItem('se_ai_key') || ''
    } catch {
      return ''
    }
  },
}
