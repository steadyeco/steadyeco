/**
 * STEADY ECO — EMPTY STATE COMPONENT
 * Every empty state is designed. Never blank space.
 * Small cassowary icon, headline, description, optional CTA.
 */

const CASSOWARY_ICON = '<svg class="empty-state__icon" viewBox="0 0 48 48" fill="none"><path d="M24 6c-2 0-4 3-4 7 0 3 1 5 2 6l-3 4-5 12c-1 2 0 4 2 4h16c2 0 3-2 2-4l-5-12-3-4c1-1 2-3 2-6 0-4-2-7-4-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22.5" cy="11" r="1" fill="currentColor"/></svg>'

export const EmptyState = {

  /**
   * Render an empty state.
   * Returns HTML string.
   */
  render({ title = 'Nothing here yet', description = '', actionLabel = '', actionOnClick = '' } = {}) {
    return `
      <div class="empty-state">
        ${CASSOWARY_ICON}
        <h3 class="empty-state__title">${title}</h3>
        ${description ? `<p class="empty-state__description">${description}</p>` : ''}
        ${actionLabel ? `<div class="empty-state__action"><button class="btn btn-primary btn-sm" ${actionOnClick ? `onclick="${actionOnClick}"` : ''}>${actionLabel}</button></div>` : ''}
      </div>
    `
  },

  /**
   * Pre-built empty states for common screens.
   */
  jobs() {
    return this.render({
      title: 'No jobs yet',
      description: 'Create your first job to start tracking work across FNQ.',
      actionLabel: 'New Job',
      actionOnClick: "App.navigate('new-job')",
    })
  },

  quotes() {
    return this.render({
      title: 'No quotes yet',
      description: 'Build a quote to send to your next client.',
      actionLabel: 'New Quote',
      actionOnClick: "App.navigate('new-quote')",
    })
  },

  clients() {
    return this.render({
      title: 'No clients yet',
      description: 'Add your first client to start building your network.',
      actionLabel: 'Add Client',
      actionOnClick: "App.navigate('new-client')",
    })
  },

  invoices() {
    return this.render({
      title: 'No invoices yet',
      description: 'Complete a job and create an invoice to get paid.',
    })
  },

  employees() {
    return this.render({
      title: 'No employees yet',
      description: 'Add your crew so they can clock in and manage jobs from their phones.',
      actionLabel: 'Add Employee',
      actionOnClick: "App.navigate('new-employee')",
    })
  },

  activity() {
    return this.render({
      title: 'No activity yet',
      description: 'Actions will appear here as you use the platform.',
    })
  },

  search(query) {
    return this.render({
      title: 'No results',
      description: query ? `Nothing matched "${query}". Try a different search.` : 'Try searching for something.',
    })
  },

  offline() {
    return this.render({
      title: 'You\'re offline',
      description: 'This content will load when you\'re back online. Changes you make will sync automatically.',
    })
  },
}
