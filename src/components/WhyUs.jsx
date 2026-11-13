import Reveal from './Reveal';
import '../styles/sections.css';

const REASONS = [
  { num: '01', title: 'Fresh every day', text: 'Espresso pulled to order and sweets baked each morning.' },
  { num: '02', title: 'Real matcha', text: 'Ceremonial-grade matcha, whisked by hand for every cup.' },
  { num: '03', title: 'A place to stay', text: 'Cozy corners, good music and space to slow down.' },
];

export default function WhyUs() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="wrap">
        <Reveal className="center">
          <small className="label">WHY HIYA</small>
          <h2 className="hy-h2" id="why-title">
            Made with <em>good</em> energy.
          </h2>
        </Reveal>
        <div className="cards">
          {REASONS.map((r) => (
            <Reveal key={r.num} className="hy-card">
              <span className="num">{r.num}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
