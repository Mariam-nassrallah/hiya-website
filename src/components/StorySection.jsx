import { img } from '../utils/format';
import { ArrowIcon } from './Icons';
import Reveal from './Reveal';
import '../styles/story.css';

const STATS = [
  { value: '30+', label: 'drinks on the menu' },
  { value: 'Daily', label: 'fresh sweets' },
  { value: '100%', label: 'HIYA vibes' },
];

export default function StorySection() {
  return (
    <section className="story" id="story">
      <div className="wrap story-grid">
        <Reveal className="story-img">
          <img src={img('hiyamisu-frappe.jpg')} alt="HIYA Hiyamisu frappe with autumn leaves" loading="lazy" />
          <div className="badge-round" aria-hidden="true">
            <svg viewBox="0 0 120 120" focusable="false">
              <defs>
                <path id="story-badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
              </defs>
              <text>
                <textPath href="#story-badge-circle">GOOD COFFEE · GOOD ENERGY · HIYA · </textPath>
              </text>
            </svg>
            <img src={img('logo.png')} alt="" />
          </div>
        </Reveal>
        <Reveal>
          <small className="label">OUR STORY</small>
          <h2 className="hy-h2">
            A little café with a <em>big</em> heart.
          </h2>
          <p className="hy-lead">
            HIYA started as a small corner for good coffee and good company. Today we pour Spanish lattes, whisk
            matcha to order and bake sweet treats every morning, all with the same warm HIYA vibe.
          </p>
          <div className="stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <a href="#gallery" className="hy-btn btn-dark">
            Discover HIYA{' '}
            <i aria-hidden="true">
              <ArrowIcon size={16} />
            </i>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
