import { useEvents } from '../context/EventsContext';
import { formatDate } from '../utils/format';

/**
 * Hero pill for the next event. Opens the registration (or the ticket when
 * already registered). When the event is full it scrolls to #events instead.
 * Renders nothing when there is no upcoming event.
 */
export default function EventPill() {
  const { nextEvent, regs, takenOf, openRegistration } = useEvents();
  if (!nextEvent) return null;

  const { day, mon } = formatDate(nextEvent.date);
  // Short name for the pill: the part of the title before a colon, if any.
  const shortTitle = nextEvent.title.split(':')[0].trim() || nextEvent.title;
  const registered = Boolean(regs[nextEvent.id]);
  const full = !registered && takenOf(nextEvent) >= nextEvent.seats;

  let action = 'REGISTER';
  let aria = `Next event: ${nextEvent.title}, ${day} ${mon}. Register`;
  if (registered) {
    action = 'MY TICKET';
    aria = `Next event: ${nextEvent.title}, ${day} ${mon}. View my ticket`;
  } else if (full) {
    action = 'FULL';
    aria = `Next event: ${nextEvent.title}, ${day} ${mon}. Fully booked, see details`;
  }

  const handleClick = (e) => {
    if (full) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('events')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    openRegistration(nextEvent, e.currentTarget);
  };

  return (
    <button
      type="button"
      className={`event-pill reveal${full ? ' is-full' : ''}`}
      style={{ animationDelay: '0s' }}
      onClick={handleClick}
      aria-label={aria}
    >
      <span className="ep-dot" aria-hidden="true" />
      <span className="ep-text" aria-hidden="true">
        Next event: <b>{shortTitle}</b>
        <span className="ep-date">
          {' '}
          · {day} {mon}
        </span>
      </span>
      <span className="ep-cta" aria-hidden="true">
        {action}
        {!full && ' →'}
      </span>
    </button>
  );
}
