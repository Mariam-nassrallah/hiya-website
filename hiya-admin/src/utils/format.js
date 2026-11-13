// Small helpers for showing values in the UI.

/** 12.5 -> "$12.50" */
export function formatMoney(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/** "2026-11-03" or "2026-11-03T14:30" -> "3 Nov 2026" */
export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "2026-11-03T14:30" -> "3 Nov 2026, 14:30" */
export function formatDateTime(value) {
  const date = new Date(value);
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${formatDate(value)}, ${time}`;
}

/** "Maya Haddad" -> "MH", "Admin" -> "A" */
export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
