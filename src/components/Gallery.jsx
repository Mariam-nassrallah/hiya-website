import { img } from '../utils/format';
import Reveal from './Reveal';
import '../styles/sections.css';

const PHOTOS = [
  { file: 'matcha-girl.jpg', alt: 'A guest enjoying an iced matcha at HIYA', big: true },
  { file: 'iced-latte.jpg', alt: 'Iced Spanish latte' },
  { file: 'red-velvet.jpg', alt: 'Red velvet frappe' },
  { file: 'ube.jpg', alt: 'Ube latte' },
  { file: 'americano-brownie.jpg', alt: 'Americano with a chocolate brownie' },
  { file: 'frappe.jpg', alt: 'Caramel frappe topped with cream' },
  { file: 'manakish.jpg', alt: 'Freshly baked manakish' },
];

export default function Gallery() {
  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <Reveal className="m-head">
          <div>
            <small className="label">GALLERY</small>
            <h2 className="hy-h2" id="gallery-title">
              Moments at <em>HIYA</em>.
            </h2>
          </div>
          <a href="#" className="link-arrow">
            @hiya.coffee →
          </a>
        </Reveal>
        <div className="g-grid">
          {PHOTOS.map((p) => (
            <Reveal key={p.file} as="figure" className={`g${p.big ? ' g1' : ''}`}>
              <img src={img(p.file)} alt={p.alt} loading="lazy" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
