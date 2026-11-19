import { img } from '../utils/format';
import EventPill from './EventPill';
import HeroCard from './HeroCard';
import { ArrowIcon, PlayIcon } from './Icons';
import '../styles/hero.css';

const CARDS = [
  { title: 'Signature Drinks', image: 'iced-latte.jpg', href: '#menu', variant: 'c1', delay: 0.8 },
  { title: 'Sweet Treats', image: 'hiyamisu.jpg', href: '#menu', variant: 'c2', delay: 0.92 },
  { title: 'Creative Experiences', image: 'matcha-girl.jpg', href: '#events', variant: 'c3', delay: 1.04 },
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div
        className="hero-bg"
        role="img"
        aria-label="Iced Spanish latte and iced matcha latte with milk and matcha splashes"
        style={{ backgroundImage: `url(${img('hero-bg.jpg')})` }}
      />
      <div className="wrap top">
        <div className="copy">
          <EventPill />
          <p className="eyebrow reveal" style={{ animationDelay: '.1s' }}>
            GOOD COFFEE. GOOD ENERGY. HIYA VIBES.
          </p>
          <div className="rule reveal" style={{ animationDelay: '.2s' }} aria-hidden="true" />
          <h1 className="hero-title">
            <span className="line"><span>A little sip</span></span>
            <span className="line">
              <span>
                of happiness<span className="dot">.</span>
              </span>
            </span>
          </h1>
          <p className="desc reveal" style={{ animationDelay: '.5s' }}>
            Your favorite coffee, matcha and sweet moments — all in one place.
          </p>
          <div className="cta-row reveal" style={{ animationDelay: '.65s' }}>
            <a href="#menu" className="hy-btn btn-terra">
              EXPLORE OUR MENU <ArrowIcon />
            </a>
            <a href="#story" className="hy-btn btn-ghost">
              DISCOVER HIYA{' '}
              <i aria-hidden="true">
                <PlayIcon />
              </i>
            </a>
          </div>
        </div>
      </div>
      <div className="wrap h-cards">
        {CARDS.map((c) => (
          <HeroCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}
