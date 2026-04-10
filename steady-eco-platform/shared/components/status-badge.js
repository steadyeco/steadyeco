/**
 * STEADY ECO — STATUS BADGE COMPONENT
 * Colour-coded badges for job/quote/invoice status.
 */

const STATUS_MAP = {
  // Jobs
  new:        { label: 'New',        class: 'badge-new' },
  quoted:     { label: 'Quoted',     class: 'badge-quoted' },
  booked:     { label: 'Booked',     class: 'badge-booked' },
  active:     { label: 'Active',     class: 'badge-active' },
  complete:   { label: 'Complete',   class: 'badge-complete' },
  invoiced:   { label: 'Invoiced',   class: 'badge-invoiced' },
  paid:       { label: 'Paid',       class: 'badge-paid' },
  cancelled:  { label: 'Cancelled',  class: 'badge-cancelled' },
  // Quotes
  draft:      { label: 'Draft',      class: 'badge-new' },
  sent:       { label: 'Sent',       class: 'badge-quoted' },
  viewed:     { label: 'Viewed',     class: 'badge-booked' },
  accepted:   { label: 'Accepted',   class: 'badge-complete' },
  rejected:   { label: 'Rejected',   class: 'badge-cancelled' },
  expired:    { label: 'Expired',    class: 'badge-cancelled' },
  // Invoices
  overdue:    { label: 'Overdue',    class: 'badge-cancelled' },
  void:       { label: 'Void',       class: 'badge-cancelled' },
  // Timesheets
  pending:    { label: 'Pending',    class: 'badge-quoted' },
  approved:   { label: 'Approved',   class: 'badge-complete' },
}

export const StatusBadge = {

  /**
   * Render a status badge.
   * Returns HTML string.
   */
  render(status) {
    const config = STATUS_MAP[status] || { label: status, class: 'badge-new' }
    return `<span class="badge ${config.class}">${config.label}</span>`
  },

  /**
   * Get the label for a status.
   */
  label(status) {
    return (STATUS_MAP[status] || { label: status }).label
  },

  /**
   * Get all valid statuses for a type.
   */
  statuses(type = 'job') {
    const sets = {
      job:       ['new', 'quoted', 'booked', 'active', 'complete', 'invoiced', 'paid', 'cancelled'],
      quote:     ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
      invoice:   ['draft', 'sent', 'viewed', 'overdue', 'paid', 'void'],
      timesheet: ['pending', 'approved', 'rejected'],
    }
    return sets[type] || sets.job
  },
}
