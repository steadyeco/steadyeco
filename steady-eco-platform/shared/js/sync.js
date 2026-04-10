/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — BACKGROUND SYNC ENGINE
 * Queues mutations when offline. Syncs when back online.
 * The user never has to do anything — it just works.
 * ═══════════════════════════════════════════════════════════
 */

import { Audit } from './audit.js'

const QUEUE_KEY = 'se_pending_sync'

export const Sync = {

  /**
   * Queue a mutation for sync when online.
   * Used when the device is offline and a write operation occurs.
   */
  queue(mutation) {
    const pending = this.getPending()
    pending.push({
      id: crypto.randomUUID(),
      queuedAt: new Date().toISOString(),
      retries: 0,
      ...mutation,
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(pending))
    this._updateBadge()
  },

  /**
   * Get all pending mutations.
   */
  getPending() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []
    } catch {
      return []
    }
  },

  /**
   * Get count of pending mutations.
   */
  pendingCount() {
    return this.getPending().length
  },

  /**
   * Process all pending mutations.
   * Called automatically when connectivity is restored.
   */
  async processQueue() {
    if (!navigator.onLine) return { processed: 0, failed: 0 }

    const pending = this.getPending()
    if (!pending.length) return { processed: 0, failed: 0 }

    let processed = 0
    let failed = 0
    const remaining = []

    for (const mutation of pending) {
      try {
        // In PWA/localStorage mode, mutations are already applied locally.
        // This sync step is for future server sync.
        // For now, just mark as processed.
        processed++
        Audit.log('SYNC.MUTATION_PROCESSED', {
          mutationId: mutation.id,
          action: mutation.action,
        })
      } catch (err) {
        mutation.retries++
        if (mutation.retries < 5) {
          remaining.push(mutation)
        } else {
          failed++
          Audit.log('SYNC.MUTATION_FAILED', {
            mutationId: mutation.id,
            action: mutation.action,
            error: err.message,
          })
        }
      }
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
    this._updateBadge()

    if (processed > 0) {
      Audit.log('SYNC.QUEUE_PROCESSED', { processed, failed, remaining: remaining.length })
    }

    return { processed, failed, remaining: remaining.length }
  },

  /**
   * Clear all pending mutations (use with caution).
   */
  clearQueue() {
    localStorage.removeItem(QUEUE_KEY)
    this._updateBadge()
  },

  /**
   * Initialise sync listeners.
   * Call once on app boot.
   */
  init() {
    // Process queue when coming back online
    window.addEventListener('online', () => {
      this.processQueue()
      this._updateConnectivity(true)
    })

    window.addEventListener('offline', () => {
      this._updateConnectivity(false)
    })

    // Initial check
    this._updateConnectivity(navigator.onLine)

    // Process any pending items on boot
    if (navigator.onLine) {
      this.processQueue()
    }
  },

  /* ── INTERNALS ────────────────────────────────────── */

  _updateBadge() {
    const count = this.pendingCount()
    const badge = document.querySelector('[data-sync-badge]')
    if (badge) {
      badge.textContent = count > 0 ? `${count} pending` : ''
      badge.hidden = count === 0
    }
  },

  _updateConnectivity(online) {
    const dot = document.querySelector('.connectivity-dot')
    if (dot) {
      dot.classList.toggle('connectivity-dot--offline', !online)
    }

    const label = document.querySelector('.connectivity-label')
    if (label) {
      label.textContent = online ? 'Online' : 'Offline'
    }
  },
}
