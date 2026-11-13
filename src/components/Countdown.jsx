import { useEffect, useState } from 'react';
import { timeUntil } from '../utils/events';

const TICK_MS = 30000;

/** Days / hours / minutes until `target`, refreshed every 30 seconds. */
export default function Countdown({ target }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const { done, days, hours, minutes } = timeUntil(target, now);
  const units = [
    { value: days, label: days === 1 ? 'DAY' : 'DAYS' },
    { value: hours, label: hours === 1 ? 'HOUR' : 'HOURS' },
    { value: minutes, label: 'MIN' },
  ];

  return (
    <div className="countdown">
      <span className="cd-label">{done ? 'Starting now' : 'Starts in'}</span>
      <div className="cd-units" role="timer" aria-label={`Starts in ${days} days, ${hours} hours and ${minutes} minutes`}>
        {units.map((u) => (
          <div className="cd-unit" key={u.label} aria-hidden="true">
            <b>{String(u.value).padStart(2, '0')}</b>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
