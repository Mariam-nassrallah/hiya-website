/** Public URL of a file in public/images/. */
export const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

/** 4.5 -> "$4.50" */
export const money = (n) => `$${Number(n).toFixed(2)}`;

/** Whole-dollar amounts stay short ("$15"); others keep cents. */
export const shortMoney = (n) => (Number.isInteger(n) ? `$${n}` : money(n));

/** "2026-11-20" -> { day: 20, mon: "NOV", wd: "Friday" } (noon avoids timezone shifts). */
export function formatDate(iso) {
  const d = new Date(`${iso}T12:00`);
  return {
    day: d.getDate(),
    mon: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    wd: d.toLocaleString('en', { weekday: 'long' }),
  };
}

/** Safe localStorage helpers: storage can be blocked (private mode, settings). */
export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}
