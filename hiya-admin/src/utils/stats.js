// Calculations for the dashboard. All of them are plain functions that take
// the data arrays and return new values (derived data), so they are easy to test.

export const ORDER_STATUSES = ['Pending', 'Preparing', 'Completed', 'Cancelled'];

/** "2026-11-03T14:30" -> "2026-11" */
function monthKey(dateString) {
  return dateString.slice(0, 7);
}

/**
 * The data is static, so "now" is the date of the newest order.
 * This keeps the dashboard correct no matter when the app is opened.
 */
export function getReferenceDate(orders) {
  if (orders.length === 0) return new Date();
  const newest = orders.reduce((latest, order) => (order.date > latest ? order.date : latest), orders[0].date);
  return new Date(newest);
}

/** The last `count` months ending with the reference month, oldest first. */
export function getLastMonths(referenceDate, count = 6) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-GB', { month: 'short' });
    months.push({ key, label });
  }
  return months;
}

/** Revenue only counts completed orders. */
export function getRevenue(orders) {
  return orders.filter((o) => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
}

/** For each month: number of orders and completed revenue. */
export function getMonthlyTotals(orders, months) {
  return months.map((month) => {
    const inMonth = orders.filter((o) => monthKey(o.date) === month.key);
    return { ...month, orders: inMonth.length, revenue: getRevenue(inMonth) };
  });
}

/** { Pending: 2, Preparing: 3, Completed: 49, Cancelled: 6 } */
export function getStatusCounts(orders) {
  const counts = {};
  ORDER_STATUSES.forEach((status) => {
    counts[status] = orders.filter((o) => o.status === status).length;
  });
  return counts;
}

/** Percentage change from previous to current, e.g. 12 or -8. Null when there is nothing to compare. */
export function getPercentChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Text like "+12% vs Oct" or "-8% vs Oct". */
export function trendText(change, previousLabel) {
  if (change === null) return 'No data for last month';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}% vs ${previousLabel}`;
}
