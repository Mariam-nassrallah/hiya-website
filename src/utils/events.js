/**
 * Start of an event as a local Date, from its "YYYY-MM-DD" date and
 * "h:mm AM/PM" time. Without a readable time it falls back to midnight.
 */
export function eventStart(event) {
  const [y, mo, d] = String(event.date).split('-').map(Number);
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(event.time ?? '').trim());
  let hours = 0;
  let minutes = 0;
  if (m) {
    hours = Number(m[1]) % 12;
    if (m[3].toUpperCase() === 'PM') hours += 12;
    minutes = Number(m[2]);
  }
  return new Date(y, mo - 1, d, hours, minutes);
}

/**
 * The upcoming event that starts soonest after `now`, or null when every
 * event has already started (or there are none).
 */
export function getNextEvent(events, now = new Date()) {
  if (!Array.isArray(events)) return null;
  let next = null;
  let nextTime = Infinity;
  for (const event of events) {
    const t = eventStart(event).getTime();
    if (Number.isNaN(t) || t <= now.getTime()) continue;
    if (t < nextTime) {
      next = event;
      nextTime = t;
    }
  }
  return next;
}

/** Whole days / hours / minutes left until `target` (never negative). */
export function timeUntil(target, now = new Date()) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalMinutes = Math.floor(ms / 60000);
  return {
    done: ms === 0,
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}
