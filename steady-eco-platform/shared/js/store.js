/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — DATA STORE
 * localStorage abstraction with type-safe CRUD operations.
 * Designed to migrate to IndexedDB / cloud DB later
 * with zero changes to calling code.
 * ═══════════════════════════════════════════════════════════
 */

import { Audit } from './audit.js'

/* ── COLLECTION KEYS ─────────────────────────────────── */

const COLLECTIONS = {
  jobs:       'se_jobs',
  clients:    'se_clients',
  employees:  'se_employees',
  quotes:     'se_quotes',
  invoices:   'se_invoices',
  timesheets: 'se_timesheets',
  documents:  'se_documents',
  swms:       'se_swms',
  settings:   'se_settings',
}

/* ── REFERENCE NUMBER GENERATORS ─────────────────────── */

function nextRef(prefix) {
  const year = new Date().getFullYear()
  const counterKey = `se_counter_${prefix}_${year}`
  const count = parseInt(localStorage.getItem(counterKey) || '0', 10) + 1
  localStorage.setItem(counterKey, String(count))
  return `SE-${prefix}-${year}-${String(count).padStart(4, '0')}`
}

/* ── STORE MODULE ────────────────────────────────────── */

export const Store = {

  /**
   * Get all records from a collection.
   */
  getAll(collection) {
    const key = COLLECTIONS[collection]
    if (!key) throw new Error(`Unknown collection: ${collection}`)
    try {
      return JSON.parse(localStorage.getItem(key)) || []
    } catch {
      return []
    }
  },

  /**
   * Get a single record by ID.
   */
  getById(collection, id) {
    return this.getAll(collection).find(r => r.id === id) || null
  },

  /**
   * Query records with a filter function.
   */
  query(collection, filterFn) {
    return this.getAll(collection).filter(filterFn)
  },

  /**
   * Create a new record. Auto-generates id and timestamps.
   */
  create(collection, data) {
    const key = COLLECTIONS[collection]
    if (!key) throw new Error(`Unknown collection: ${collection}`)

    const record = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Auto-generate reference numbers
    if (collection === 'jobs' && !record.reference) {
      record.reference = nextRef('J')
    }
    if (collection === 'quotes' && !record.reference) {
      record.reference = nextRef('Q')
    }
    if (collection === 'invoices' && !record.reference) {
      record.reference = nextRef('INV')
    }

    const records = this.getAll(collection)
    records.push(record)
    localStorage.setItem(key, JSON.stringify(records))

    Audit.log(`${collection.toUpperCase()}.CREATED`, {
      resourceType: collection,
      resourceId: record.id,
      newValue: record,
    })

    return record
  },

  /**
   * Update a record by ID. Merges partial data.
   */
  update(collection, id, updates) {
    const key = COLLECTIONS[collection]
    if (!key) throw new Error(`Unknown collection: ${collection}`)

    const records = this.getAll(collection)
    const index = records.findIndex(r => r.id === id)
    if (index === -1) throw new Error(`Record not found: ${collection}/${id}`)

    const previous = { ...records[index] }
    records[index] = {
      ...records[index],
      ...updates,
      id, // Prevent ID overwrite
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(key, JSON.stringify(records))

    Audit.log(`${collection.toUpperCase()}.UPDATED`, {
      resourceType: collection,
      resourceId: id,
      previousValue: previous,
      newValue: records[index],
    })

    return records[index]
  },

  /**
   * Delete a record by ID.
   */
  delete(collection, id) {
    const key = COLLECTIONS[collection]
    if (!key) throw new Error(`Unknown collection: ${collection}`)

    const records = this.getAll(collection)
    const record = records.find(r => r.id === id)
    if (!record) return false

    const filtered = records.filter(r => r.id !== id)
    localStorage.setItem(key, JSON.stringify(filtered))

    Audit.log(`${collection.toUpperCase()}.DELETED`, {
      resourceType: collection,
      resourceId: id,
      previousValue: record,
    })

    return true
  },

  /**
   * Count records, optionally with filter.
   */
  count(collection, filterFn) {
    const records = this.getAll(collection)
    return filterFn ? records.filter(filterFn).length : records.length
  },

  /**
   * Get/set platform settings.
   */
  getSetting(key, defaultValue = null) {
    const settings = this.getAll('settings')
    // Settings stored as array of { key, value }
    const setting = settings.find(s => s.key === key)
    return setting ? setting.value : defaultValue
  },

  setSetting(key, value) {
    const settingsKey = COLLECTIONS.settings
    let settings = []
    try {
      settings = JSON.parse(localStorage.getItem(settingsKey)) || []
    } catch { settings = [] }

    const index = settings.findIndex(s => s.key === key)
    if (index >= 0) {
      settings[index].value = value
    } else {
      settings.push({ key, value })
    }
    localStorage.setItem(settingsKey, JSON.stringify(settings))
  },

  /**
   * Generate a reference number for a collection.
   */
  nextRef(prefix) {
    return nextRef(prefix)
  },

  /**
   * Export all data (for backup).
   */
  exportAll() {
    const data = {}
    for (const [name, key] of Object.entries(COLLECTIONS)) {
      try {
        data[name] = JSON.parse(localStorage.getItem(key)) || []
      } catch {
        data[name] = []
      }
    }
    data._exportedAt = new Date().toISOString()
    return data
  },

  /**
   * Import data (from backup). Merges, does not overwrite.
   */
  importAll(data) {
    for (const [name, key] of Object.entries(COLLECTIONS)) {
      if (data[name] && Array.isArray(data[name])) {
        const existing = this.getAll(name)
        const existingIds = new Set(existing.map(r => r.id))
        const newRecords = data[name].filter(r => !existingIds.has(r.id))
        const merged = [...existing, ...newRecords]
        localStorage.setItem(key, JSON.stringify(merged))
      }
    }
    Audit.log('ADMIN.DATA_IMPORTED', {
      collections: Object.keys(data).filter(k => !k.startsWith('_')),
    })
  },
}
