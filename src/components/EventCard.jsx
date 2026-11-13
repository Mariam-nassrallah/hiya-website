import { eventStart } from '../utils/events';
import { formatDate, img, shortMoney } from '../utils/format';
import Countdown from './Countdown';

/**
 * Large card for the next event. The left side is either the full event
 * poster (event.poster) or a photo with a date badge and type tag. The right
 * side holds the details, what's included, a countdown, the seats bar, the
 * price and the action button.
 */
export default function EventCard({ event, taken, registration, onRegister }) {
  const { day, mon, wd } = formatDate(event.date);
  const left = Math.max(0, event.seats - taken);
  const full = left <= 0;
  const pct = Math.min(100, (taken / event.seats) * 100);
  const leftText = full ? 'Fully booked' : left <= 3 ? `Only ${left} left!` : `${left} seats left`;
  const time = event.end ? `${event.time} – ${event.end}` : event.time;
  const includes = Array.isArray(event.includes) ? event.includes : [];

  let label = 'Register now';
  let aria = `Register for ${event.title}`;
  if (registration) {
    label = '✓ View my ticket';
    aria = `View your ticket for ${event.title}`;
  } else if (full) {
    label = 'Full';
    aria = `${event.title} is fully booked`;
  }

  return (
    <article className={`ev-next${event.poster ? ' has-poster' : ''}`} aria-labelledby="next-event-title">
      {event.poster ? (
        <div className="ev-poster">
          <img src={img(event.image)} alt={`Event poster: ${event.title}, ${wd} ${day} ${mon}, ${time}`} loading="lazy" />
        </div>
      ) : (
        <div className="ev-img">
          <img src={img(event.image)} alt="" loading="lazy" />
          <div className="ev-date">
            <b>{day}</b>
            <span>{mon}</span>
          </div>
          <span className="ev-tag">{event.type.toUpperCase()}</span>
        </div>
      )}

      <div className="ev-info">
        <small className="label">UPCOMING {event.type.toUpperCase()} EVENT</small>
        <h3 id="next-event-title">{event.title}</h3>
        <div className="ev-meta">
          <span>
            {wd}, {day} {mon}
          </span>
          <span>{time}</span>
          <span>{event.duration}</span>
        </div>
        <p className="ev-desc">{event.description}</p>

        {includes.length > 0 && (
          <ul className="ev-includes" aria-label="Included">
            {includes.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <Countdown target={eventStart(event)} />

        <div className="seats">
          <div className="seats-top">
            <span>
              {taken}/{event.seats} booked
            </span>
            <span className="left">{leftText}</span>
          </div>
          <div
            className="bar-bg"
            role="progressbar"
            aria-label={`Seats booked for ${event.title}`}
            aria-valuemin={0}
            aria-valuemax={event.seats}
            aria-valuenow={taken}
          >
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="ev-foot">
          <span className="ev-price">
            {event.price ? (
              <>
                {shortMoney(event.price)}
                <small> {event.priceLabel ?? '/ person'}</small>
              </>
            ) : (
              'Free'
            )}
          </span>
          <button
            type="button"
            className={`hy-btn btn-reg${registration ? ' done' : ''}`}
            disabled={full && !registration}
            aria-label={aria}
            onClick={(e) => onRegister(event, e.currentTarget)}
          >
            {label}
          </button>
        </div>
      </div>
    </article>
  );
}
