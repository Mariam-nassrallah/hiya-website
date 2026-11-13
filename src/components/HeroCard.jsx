import { img } from '../utils/format';
import { ArrowIcon } from './Icons';

/**
 * One of the three cards at the bottom of the hero.
 * variant: "c1" (deep olive), "c2" (terracotta) or "c3" (cream).
 */
export default function HeroCard({ title, image, href, variant, delay }) {
  return (
    <a href={href} className={`h-card ${variant}`} style={{ animationDelay: `${delay}s` }}>
      <img src={img(image)} alt="" loading="eager" />
      <h3>{title}</h3>
      <span className="bar" aria-hidden="true" />
      <span className="go" aria-hidden="true">
        <ArrowIcon size={16} />
      </span>
    </a>
  );
}
