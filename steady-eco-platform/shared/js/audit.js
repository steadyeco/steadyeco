/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — AUDIT TRAIL
 * Every action creates an audit record. Non-negotiable.
 * Legal compliance requirement for government contracts.
 * ═══════════════════════════════════════════════════════════
 */

const STORAGE_KEY = 'se_audit'
const MAX_RECORDS = 10000

export const Audit = {

  /**
   * Log an audit event.
   * @param {string} action - e.g. 'JOB.STATUS_CHANGED'
   * @param {object} details - { resourceType, resourceId, previousValue, newValue, ...metadata }
   */
  log(action, details = {}) {
    const session = this._getSession()

    const record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: session?.userId || 'system',
      userRole: session?.role || 'SYSTEM',
      action,
      resourceType: details.resourceType || action.split('.')[0],
      resourceId: details.resourceId || null,
      previousValue: details.previousValue || null,
      newValue: details.newValue || null,
      metadata: {
        ...details,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
      },
    }

    // Remove fields already captured at top level
    delete record.metadata.resourceType
    delete record.metadata.resourceId
    delete record.metadata.previousValue
    delete record.metadata.newValue

    const records = this._getRecords()
    records.push(record)

    // Trim old records if exceeding max
    if (records.length > MAX_RECORDS) {
      records.splice(0, records.length - MAX_RECORDS)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return record
  },

  /**
   * Query audit records with filters.
   */
  query({ action, userId, resourceType, resourceId, since, limit = 50 } = {}) {
    let records = this._getRecords()

    if (action) records = records.filter(r => r.action === action)
    if (userId) records = records.filter(r => r.userId === userId)
    if (resourceType) records = records.filter(r => r.resourceType === resourceType)
    if (resourceId) records = records.filter(r => r.resourceId === resourceId)
    if (since) {
      const sinceDate = new Date(since).getTime()
      records = records.filter(r => new Date(r.timestamp).getTime() >= sinceDate)
    }

    // Return most recent first, limited
    return records.reverse().slice(0, limit)
  },

  /**
   * Get all audit records for a specific resource.
   */
  getResourceHistory(resourceType, resourceId) {
    return this.query({ resourceType, resourceId, limit: 200 })
  },

  /**
   * Export audit trail as JSON (for compliance).
   */
  export(filters = {}) {
    const records = this.query({ ...filters, limit: MAX_RECORDS })
    return JSON.stringify(records, null, 2)
  },

  /* ── INTERNALS ────────────────────────────────────── */

  _getRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  },

  _getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('se_session'))
    } catch {
      return null
    }
  },
}
