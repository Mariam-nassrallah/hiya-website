import { useId, useState } from 'react';
import { ArrowIcon, CheckIcon } from './Icons';
import Reveal from './Reveal';
import '../styles/sections.css';

const INFO = [
  { label: 'Address', value: 'Your street, your city' },
  { label: 'Hours', value: 'Every day · 8am – 12am' },
  { label: 'Phone', value: '+961 00 000 000' },
];
const EMPTY = { name: '', email: '', message: '' };

function validate(v) {
  return {
    name: v.name.trim().length >= 2 ? '' : 'Please enter your name.',
    email: /^\S+@\S+\.\S+$/.test(v.email.trim()) ? '' : 'Enter a valid email.',
    message: v.message.trim().length >= 5 ? '' : 'Write a short message (5+ characters).',
  };
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [tried, setTried] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const uid = useId();
  const errors = validate(values);
  const err = (f) => (tried ? errors[f] : '');

  const set = (f) => (e) => setValues((v) => ({ ...v, [f]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (errors.name || errors.email || errors.message) return;
    setSentTo(values.name.trim().split(' ')[0]);
    setValues(EMPTY);
    setTried(false);
  };

  const input = (f, placeholder, props = {}) => {
    const Tag = f === 'message' ? 'textarea' : 'input';
    return (
      <div className={`c-field${err(f) ? ' err' : ''}`}>
        <label htmlFor={`${uid}-${f}`} className="visually-hidden">
          {placeholder}
        </label>
        <Tag
          id={`${uid}-${f}`}
          placeholder={placeholder}
          value={values[f]}
          onChange={set(f)}
          aria-invalid={Boolean(err(f))}
          aria-describedby={err(f) ? `${uid}-${f}-msg` : undefined}
          {...props}
        />
        {err(f) && (
          <div className="msg" id={`${uid}-${f}-msg`}>
            {err(f)}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap c-grid">
        <Reveal>
          <small className="label">VISIT US</small>
          <h2 className="hy-h2" id="contact-title">
            Come for a sip, <em>stay</em> for the vibes.
          </h2>
          <ul className="info">
            {INFO.map((i) => (
              <li key={i.label}>
                <b>{i.label}</b>
                <span>{i.value}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="c-card">
          {sentTo ? (
            <div className="c-thanks" role="status">
              <div className="tick">
                <CheckIcon color="var(--cream)" />
              </div>
              <h3>Thank you, {sentTo}!</h3>
              <p>Your note reached the HIYA team. We&apos;ll get back to you soon.</p>
              <button type="button" className="hy-btn btn-terra" onClick={() => setSentTo('')}>
                SEND ANOTHER NOTE
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h3>Send us a note</h3>
              <div className="two">
                {input('name', 'Your name', { autoComplete: 'name' })}
                {input('email', 'Email', { type: 'email', autoComplete: 'email' })}
              </div>
              {input('message', 'Message', { rows: 4 })}
              <button type="submit" className="hy-btn btn-terra">
                SEND MESSAGE <ArrowIcon />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
