/**
 * STEADY ECO — SKELETON LOADER COMPONENT
 * Generates skeleton screens for every content type.
 * Never spinners. Never blank. Always skeleton.
 */

export const Skeleton = {

  /**
   * Generate skeleton HTML for a content type.
   * Returns an HTML string ready to inject.
   */
  render(type, count = 1) {
    const templates = {
      card: `
        <div class="skeleton skeleton-card"></div>
      `,
      stat: `
        <div class="card-stat" style="gap:var(--se-space-3)">
          <div class="skeleton skeleton-text" style="width:60%;height:11px"></div>
          <div class="skeleton" style="width:50%;height:40px;border-radius:var(--se-radius-sm)"></div>
          <div class="skeleton skeleton-text" style="width:40%;height:10px"></div>
        </div>
      `,
      job: `
        <div class="card-job" style="pointer-events:none">
          <div style="display:flex;flex-direction:column;gap:var(--se-space-2)">
            <div class="skeleton skeleton-text" style="width:140px;height:16px"></div>
            <div class="skeleton skeleton-text" style="width:100px;height:13px"></div>
            <div class="skeleton skeleton-text" style="width:180px;height:11px"></div>
          </div>
          <div class="skeleton" style="width:64px;height:22px;border-radius:var(--se-radius-full)"></div>
        </div>
      `,
      client: `
        <div class="card-client" style="pointer-events:none">
          <div class="skeleton skeleton-avatar"></div>
          <div style="display:flex;flex-direction:column;gap:var(--se-space-2);flex:1">
            <div class="skeleton skeleton-text" style="width:120px;height:16px"></div>
            <div class="skeleton skeleton-text" style="width:80px;height:12px"></div>
          </div>
        </div>
      `,
      table: `
        <div style="display:flex;flex-direction:column;gap:var(--se-space-3)">
          <div class="skeleton skeleton-text" style="height:14px"></div>
          <div class="skeleton skeleton-text" style="height:14px"></div>
          <div class="skeleton skeleton-text" style="height:14px;width:80%"></div>
        </div>
      `,
      text: `
        <div style="display:flex;flex-direction:column;gap:var(--se-space-2)">
          <div class="skeleton skeleton-heading"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width:60%"></div>
        </div>
      `,
    }

    const template = templates[type] || templates.card
    return Array(count).fill(template).join('')
  },

  /**
   * Inject skeleton into a container element.
   */
  inject(container, type, count = 1) {
    if (typeof container === 'string') {
      container = document.querySelector(container)
    }
    if (container) {
      container.innerHTML = this.render(type, count)
    }
  },

  /**
   * Replace skeleton content with real content.
   * Smooth fade transition.
   */
  replace(container, html) {
    if (typeof container === 'string') {
      container = document.querySelector(container)
    }
    if (!container) return

    container.style.opacity = '0'
    container.style.transition = 'opacity 200ms ease'

    setTimeout(() => {
      container.innerHTML = html
      requestAnimationFrame(() => {
        container.style.opacity = '1'
      })
    }, 150)
  },
}
