import { useEvents } from '../context/EventsContext';
import EventCard from './EventCard';
import Reveal from './Reveal';

export default function EventsSection() {
  const { nextEvent, loading, error, regs, takenOf, openRegistration } = useEvents();

  return (
    <section className="events" id="events" aria-labelledby="events-title">
      <div className="wrap">
        <Reveal className="m-head">
          <div>
            <small className="label">HIYA EXPERIENCES</small>
            <h2 className="hy-h2" id="events-title">
              Next at <em>HIYA</em>.
            </h2>
          </div>
          <p className="ev-intro">Our next art night is open for registration. Seats are limited, so save yours.</p>
        </Reveal>

        {loading && <p className="ev-status">Loading events…</p>}
        {error && (
          <p className="ev-status" role="alert">
            Sorry, events could not be loaded. Please refresh the page.
          </p>
        )}

        {!loading && !error && (
          <Reveal>
            {nextEvent ? (
              <EventCard
                event={nextEvent}
                taken={takenOf(nextEvent)}
                registration={regs[nextEvent.id]}
                onRegister={openRegistration}
              />
            ) : (
              <div className="ev-empty">
                <h3>No upcoming events right now.</h3>
                <p>
                  Follow us on <a href="#">Instagram</a> to hear about the next one.
                </p>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
