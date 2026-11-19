import { useEffect, useId, useRef, useState } from 'react';
import { formatDate, shortMoney } from '../utils/format';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import { ArrowIcon, CheckIcon } from './Icons';

const MAX_GUESTS = 6;
const EMPTY = { name: '', phone: '', email: '', notes: '' };
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function bookingCode() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return `HY-${Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('')}`;
}

function validate(v) {
  return {
    name: v.name.trim().length >= 2 ? '' : 'Please enter your name.',
    phone: /^\+?[\d\s-]{7,}$/.test(v.phone.trim()) ? '' : 'Enter a valid phone number.',
    email: !v.email.trim() || /^\S+@\S+\.\S+$/.test(v.email.trim()) ? '' : 'Enter a valid email.',
  };
}

/**
 * Registration dialog for one event. Shows the form, or the ticket when the
 * event already has a registration. Bottom sheet on phones.
 */
export default function RegisterModal({ open, event, registration, seatsLeft, onClose, onRegister }) {
  const [values, setValues] = useState(EMPTY);
  const [guests, setGuests] = useState(1);
  const [tried, setTried] = useState(false);
  const sheetRef = useRef(null);
  const nameRef = useRef(null);
  const doneRef = useRef(null);
  const uid = useId();

  const maxGuests = Math.max(1, Math.min(MAX_GUESTS, seatsLeft));
  const errors = validate(values);
  const showTicket = Boolean(registration);

  // Reset the form each time the dialog opens
  useEffect(() => {
    if (!open) return;
    setValues(EMPTY);
    setGuests(1);
    setTried(false);
  }, [open, event?.id]);

  // Esc to close, Tab focus trap, scroll lock, initial focus
  useEffect(() => {
    if (!open) return undefined;
    lockScroll();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const focusables = sheetRef.current.querySelectorAll(
        'button:not([disabled]), input, textarea, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Move focus into the dialog once it has animated in
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => (showTicket ? doneRef.current : nameRef.current)?.focus(), 300);
    return () => clearTimeout(t);
  }, [open, showTicket]);

  if (!event) return null;

  const { day, mon, wd } = formatDate(event.date);
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const err = (field) => (tried ? errors[field] : '');
  const g = Math.min(guests, maxGuests);

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (errors.name || errors.phone || errors.email || seatsLeft < 1) return;
    onRegister(event.id, {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      notes: values.notes.trim(),
      guests: g,
      code: bookingCode(),
    });
  };

  const field = (name, label, props) => (
    <div className={`field${err(name) ? ' err' : ''}`}>
      <label htmlFor={`${uid}-${name}`}>{label}</label>
      <input
        id={`${uid}-${name}`}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={Boolean(err(name))}
        aria-describedby={err(name) ? `${uid}-${name}-msg` : undefined}
        {...props}
      />
      {err(name) && (
        <div className="msg" id={`${uid}-${name}-msg`}>
          {err(name)}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`hy-modal${open ? ' open' : ''}`}
      aria-hidden={!open}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`sheet${showTicket ? ' ok' : ''}`} ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`}>
        <div className="sheet-head">
          <small>{showTicket ? 'YOUR TICKET' : 'REGISTRATION'}</small>
          <h3 id={`${uid}-title`}>{event.title}</h3>
          <p>
            {wd}, {day} {mon} · {event.time} · {event.duration}
          </p>
          <button type="button" className="x" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        {showTicket ? (
          <div className="success">
            <div className="tick">
              <CheckIcon color="var(--cream)" />
            </div>
            <h4>You&apos;re in!</h4>
            <p>We saved your seat. We&apos;ll send a reminder on WhatsApp the day before.</p>
            <dl className="ticket">
              <div><dt>Name</dt><dd>{registration.name}</dd></div>
              <div><dt>Guests</dt><dd>{registration.guests}</dd></div>
              <div><dt>When</dt><dd>{day} {mon} · {event.time}</dd></div>
              <div><dt>Booking code</dt><dd>{registration.code}</dd></div>
            </dl>
            <button type="button" className="hy-btn btn-dark" ref={doneRef} onClick={onClose}>
              Done{' '}
              <i aria-hidden="true">
                <ArrowIcon size={16} />
              </i>
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            {field('name', 'Full name', { ref: nameRef, placeholder: 'Your name', autoComplete: 'name' })}
            <div className="row2">
              {field('phone', 'Phone (WhatsApp)', { type: 'tel', placeholder: '+961 70 000 000', autoComplete: 'tel', inputMode: 'tel' })}
              {field('email', 'Email (optional)', { type: 'email', placeholder: 'you@email.com', autoComplete: 'email' })}
            </div>
            <div className="field">
              <span className="field-label" id={`${uid}-guests`}>Number of guests</span>
              <div className="stepper" role="group" aria-labelledby={`${uid}-guests`}>
                <button type="button" onClick={() => setGuests(Math.max(1, g - 1))} disabled={g <= 1} aria-label="One guest fewer">
                  −
                </button>
                <span aria-live="polite">{g}</span>
                <button type="button" onClick={() => setGuests(Math.min(maxGuests, g + 1))} disabled={g >= maxGuests} aria-label="One guest more">
                  +
                </button>
              </div>
              {g >= maxGuests && (
                <div className="hint">
                  {seatsLeft < MAX_GUESTS
                    ? `Only ${seatsLeft} ${seatsLeft === 1 ? 'seat' : 'seats'} left for this event.`
                    : `Up to ${MAX_GUESTS} guests per booking.`}
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-notes`}>Notes (optional)</label>
              <textarea id={`${uid}-notes`} rows={2} placeholder="Allergies, special requests…" value={values.notes} onChange={set('notes')} />
            </div>
            <div className="total">
              <span>Total to pay at HIYA</span>
              <b>{event.price ? shortMoney(event.price * g) : 'Free'}</b>
            </div>
            {tried && seatsLeft < 1 && <div className="form-err" role="alert">Sorry, this event just filled up.</div>}
            <button className="hy-btn btn-terra" type="submit">
              CONFIRM MY SEAT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
