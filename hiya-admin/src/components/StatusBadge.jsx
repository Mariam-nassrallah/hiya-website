// Which brand colour each status uses.
const STATUS_STYLES = {
  // good / done
  Active: 'badge-olive',
  Available: 'badge-olive',
  Completed: 'badge-olive',
  // in progress
  Preparing: 'badge-sage',
  // needs attention
  Pending: 'badge-terra',
  // stopped
  Inactive: 'badge-espresso',
  'Out of stock': 'badge-espresso',
  Cancelled: 'badge-espresso',
};

/** A rounded Bootstrap badge coloured by status. */
export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'badge-sage';
  return <span className={`badge ${style}`}>{status}</span>;
}
