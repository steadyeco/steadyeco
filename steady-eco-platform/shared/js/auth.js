/**
 * ═══════════════════════════════════════════════════════════
 * STEADY ECO — AUTHENTICATION SYSTEM
 * PIN-based auth with brute force protection, session
 * management, RBAC, and full audit trail integration.
 *
 * For the localStorage PWA phase, all hashing is SHA-256.
 * When we migrate to server-side, this swaps to Argon2id
 * with no changes to the calling code.
 * ═══════════════════════════════════════════════════════════
 */

import { Audit } from './audit.js'
import { Store } from './store.js'

/* ── ROLES & PERMISSIONS ─────────────────────────────── */

const ROLES = {
  OWNER: {
    name: 'Owner',
    permissions: ['*'],
    portal: 'command-centre',
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  },
  EMPLOYEE: {
    name: 'Employee',
    permissions: [
      'jobs.view.assigned',
      'jobs.update.assigned',
      'timesheets.own.read',
      'timesheets.own.write',
      'swms.view',
      'swms.sign',
      'profile.own.read',
      'profile.own.write',
    ],
    portal: 'crew',
    sessionTimeout: 8 * 60 * 60 * 1000,
  },
  SUBCONTRACTOR: {
    name: 'Subcontractor',
    permissions: [
      'jobs.view.assigned',
      'swms.view',
      'swms.sign',
      'timesheets.own.write',
    ],
    portal: 'crew',
    sessionTimeout: 8 * 60 * 60 * 1000,
  },
  CLIENT: {
    name: 'Client',
    permissions: [
      'jobs.view.own',
      'invoices.view.own',
      'documents.view.own',
      'quotes.view.own',
      'quotes.approve.own',
    ],
    portal: 'client',
    sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours
  },
  GOVERNMENT: {
    name: 'Government',
    permissions: [
      'contracts.view.own',
      'swms.view.all',
      'documents.view.compliance',
      'jobs.view.contracted',
      'impact.view',
      'audit.view.own_contracts',
    ],
    portal: 'government',
    sessionTimeout: 1 * 60 * 60 * 1000, // 1 hour
  },
}

/* ── BRUTE FORCE CONFIG ──────────────────────────────── */

const BRUTE_FORCE = {
  softLock:      { attempts: 5,  duration: 15 * 60 * 1000 },    // 15 min
  hardLock:      { attempts: 10, duration: 24 * 60 * 60 * 1000 }, // 24 hr
  permanentLock: { attempts: 20 },
}

/* ── HASHING ─────────────────────────────────────────── */

async function hashPin(pin, salt) {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateSalt() {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

function generateSessionId() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

/* ── AUTH MODULE ─────────────────────────────────────── */

export const Auth = {

  /**
   * Register a new PIN for a user.
   * Returns { salt, hash } to store — never stores the PIN.
   */
  async registerPin(pin) {
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      throw new Error('PIN must be exactly 6 digits')
    }
    const salt = generateSalt()
    const hash = await hashPin(pin, salt)
    return { salt, hash }
  },

  /**
   * Verify a PIN against stored salt + hash.
   * Returns true/false. Handles brute force counting.
   */
  async verifyPin(pin, storedSalt, storedHash, userId) {
    // Check lockout first
    const lockout = this._checkLockout(userId)
    if (lockout.locked) {
      Audit.log('AUTH.ACCOUNT_LOCKED', { userId, lockoutUntil: lockout.until })
      return { success: false, locked: true, lockoutRemaining: lockout.remaining }
    }

    const hash = await hashPin(pin, storedSalt)
    const match = hash === storedHash

    if (match) {
      this._clearAttempts(userId)
      return { success: true }
    }

    // Failed attempt
    const attempts = this._recordFailedAttempt(userId)
    Audit.log('AUTH.FAILED_LOGIN', { userId, attempts })

    const newLockout = this._checkLockout(userId)
    return {
      success: false,
      locked: newLockout.locked,
      lockoutRemaining: newLockout.remaining,
      attempts,
    }
  },

  /**
   * Create a session after successful authentication.
   * Session is stored in sessionStorage — never localStorage.
   */
  createSession(userId, role) {
    const roleConfig = ROLES[role]
    if (!roleConfig) throw new Error(`Invalid role: ${role}`)

    const session = {
      id: generateSessionId(),
      userId,
      role,
      permissions: roleConfig.permissions,
      portal: roleConfig.portal,
      createdAt: new Date().toISOString(),
      lastActivity: Date.now(),
      timeout: roleConfig.sessionTimeout,
    }

    sessionStorage.setItem('se_session', JSON.stringify(session))
    Audit.log('AUTH.LOGIN', { userId, role })
    return session
  },

  /**
   * Get current session. Returns null if no valid session.
   * Auto-checks timeout.
   */
  getSession() {
    const raw = sessionStorage.getItem('se_session')
    if (!raw) return null

    try {
      const session = JSON.parse(raw)

      // Check session timeout
      const elapsed = Date.now() - session.lastActivity
      if (elapsed > session.timeout) {
        this.logout('timeout')
        return null
      }

      // Update last activity
      session.lastActivity = Date.now()
      sessionStorage.setItem('se_session', JSON.stringify(session))
      return session
    } catch {
      this.logout('corrupt')
      return null
    }
  },

  /**
   * Check if current user has a specific permission.
   */
  checkPermission(permission) {
    const session = this.getSession()
    if (!session) return false

    // Owner has wildcard
    if (session.permissions.includes('*')) return true

    return session.permissions.includes(permission)
  },

  /**
   * Require a permission — throws if not authorised.
   */
  requirePermission(permission) {
    if (!this.checkPermission(permission)) {
      Audit.log('AUTH.PERMISSION_DENIED', {
        permission,
        userId: this.getSession()?.userId,
      })
      throw new Error(`Permission denied: ${permission}`)
    }
  },

  /**
   * Logout — destroy session, log audit event.
   */
  logout(reason = 'manual') {
    const session = this.getSession()
    if (session) {
      Audit.log('AUTH.LOGOUT', {
        userId: session.userId,
        reason,
        sessionDuration: Date.now() - new Date(session.createdAt).getTime(),
      })
    }
    sessionStorage.removeItem('se_session')
  },

  /**
   * Change PIN for a user.
   * Requires current PIN verification first.
   */
  async changePin(currentPin, newPin, storedSalt, storedHash, userId) {
    const verify = await this.verifyPin(currentPin, storedSalt, storedHash, userId)
    if (!verify.success) {
      return { success: false, reason: 'current_pin_incorrect' }
    }

    const newCreds = await this.registerPin(newPin)
    Audit.log('AUTH.PASSWORD_CHANGED', { userId })
    return { success: true, ...newCreds }
  },

  /* ── BRUTE FORCE INTERNALS ───────────────────────── */

  _getAttempts(userId) {
    const key = `se_auth_attempts_${userId}`
    try {
      return JSON.parse(localStorage.getItem(key)) || { count: 0, timestamps: [] }
    } catch {
      return { count: 0, timestamps: [] }
    }
  },

  _recordFailedAttempt(userId) {
    const key = `se_auth_attempts_${userId}`
    const data = this._getAttempts(userId)
    data.count++
    data.timestamps.push(Date.now())
    // Keep only last 20 timestamps
    data.timestamps = data.timestamps.slice(-20)
    localStorage.setItem(key, JSON.stringify(data))
    return data.count
  },

  _clearAttempts(userId) {
    localStorage.removeItem(`se_auth_attempts_${userId}`)
  },

  _checkLockout(userId) {
    const data = this._getAttempts(userId)
    const now = Date.now()

    // Permanent lock
    if (data.count >= BRUTE_FORCE.permanentLock.attempts) {
      return { locked: true, remaining: Infinity, until: 'manual_unlock' }
    }

    // Hard lock (24hr)
    if (data.count >= BRUTE_FORCE.hardLock.attempts) {
      const lastAttempt = data.timestamps[data.timestamps.length - 1]
      const elapsed = now - lastAttempt
      if (elapsed < BRUTE_FORCE.hardLock.duration) {
        return {
          locked: true,
          remaining: BRUTE_FORCE.hardLock.duration - elapsed,
          until: new Date(lastAttempt + BRUTE_FORCE.hardLock.duration).toISOString(),
        }
      }
      // Lockout expired — clear
      this._clearAttempts(userId)
      return { locked: false }
    }

    // Soft lock (15min)
    if (data.count >= BRUTE_FORCE.softLock.attempts) {
      const lastAttempt = data.timestamps[data.timestamps.length - 1]
      const elapsed = now - lastAttempt
      if (elapsed < BRUTE_FORCE.softLock.duration) {
        return {
          locked: true,
          remaining: BRUTE_FORCE.softLock.duration - elapsed,
          until: new Date(lastAttempt + BRUTE_FORCE.softLock.duration).toISOString(),
        }
      }
      // Lockout expired — clear
      this._clearAttempts(userId)
      return { locked: false }
    }

    return { locked: false }
  },
}
