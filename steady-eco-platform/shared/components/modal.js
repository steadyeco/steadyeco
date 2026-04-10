/**
 * STEADY ECO — MODAL COMPONENT
 * Accessible dialog with backdrop, focus trap, and ESC to close.
 * Spring animation on open. Smooth fade on close.
 */

let activeModal = null

export const Modal = {

  /**
   * Open a modal.
   * @param {object} options - { title, body (HTML string), actions (array), onClose }
   */
  open({ title = '', body = '', actions = [], onClose = null } = {}) {
    // Close existing modal first
    if (activeModal) this.close()

    // Create backdrop
    const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop'
    backdrop.addEventListener('click', () => this.close())

    // Create modal
    const modal = document.createElement('div')
    modal.className = 'modal'
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.setAttribute('aria-label', title)

    // Close icon
    const closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'

    modal.innerHTML = `
      <div class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button class="modal__close" aria-label="Close dialog">${closeIcon}</button>
      </div>
      <div class="modal__body">${body}</div>
      ${actions.length ? '<div class="modal__footer" data-modal-actions></div>' : ''}
    `

    // Add action buttons
    if (actions.length) {
      const footer = modal.querySelector('[data-modal-actions]')
      actions.forEach(({ label, variant = 'secondary', onClick }) => {
        const btn = document.createElement('button')
        btn.className = `btn btn-${variant}`
        btn.textContent = label
        btn.addEventListener('click', () => {
          if (onClick) onClick()
          this.close()
        })
        footer.appendChild(btn)
      })
    }

    // Close button handler
    modal.querySelector('.modal__close').addEventListener('click', () => this.close())

    // ESC key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') this.close()
    }
    document.addEventListener('keydown', escHandler)

    // Mount
    document.body.appendChild(backdrop)
    document.body.appendChild(modal)
    document.body.style.overflow = 'hidden'

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.classList.add('is-visible')
        modal.classList.add('is-visible')
      })
    })

    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (firstFocusable) firstFocusable.focus()

    activeModal = { backdrop, modal, onClose, escHandler }
    return modal
  },

  /**
   * Close the active modal.
   */
  close() {
    if (!activeModal) return

    const { backdrop, modal, onClose, escHandler } = activeModal

    document.removeEventListener('keydown', escHandler)
    backdrop.classList.remove('is-visible')
    modal.classList.remove('is-visible')

    modal.addEventListener('transitionend', () => {
      backdrop.remove()
      modal.remove()
      document.body.style.overflow = ''
    }, { once: true })

    // Fallback
    setTimeout(() => {
      if (backdrop.parentNode) backdrop.remove()
      if (modal.parentNode) modal.remove()
      document.body.style.overflow = ''
    }, 500)

    if (onClose) onClose()
    activeModal = null
  },

  /**
   * Confirm dialog shorthand.
   * Returns a Promise that resolves true/false.
   */
  confirm({ title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Confirm', danger = false } = {}) {
    return new Promise(resolve => {
      this.open({
        title,
        body: `<p class="text-sm text-secondary">${message}</p>`,
        actions: [
          { label: 'Cancel', variant: 'ghost', onClick: () => resolve(false) },
          { label: confirmLabel, variant: danger ? 'danger' : 'primary', onClick: () => resolve(true) },
        ],
        onClose: () => resolve(false),
      })
    })
  },
}
