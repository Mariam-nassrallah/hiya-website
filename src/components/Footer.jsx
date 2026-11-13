import { img } from '../utils/format';
import '../styles/sections.css';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap f-grid">
        <div>
          <div className="f-brand">
            <img src={img('logo.png')} alt="" />
            HIYA Coffee
          </div>
          <p>GOOD COFFEE. GOOD ENERGY. HIYA VIBES.</p>
        </div>
        <nav aria-label="Visit">
          <b>Visit</b>
          <a href="#menu">Menu</a>
          <a href="#story">Our Story</a>
          <a href="#events">Experiences</a>
        </nav>
        <nav aria-label="Follow">
          <b>Follow</b>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">WhatsApp</a>
        </nav>
      </div>
      <div className="wrap f-bottom">© {new Date().getFullYear()} HIYA Coffee Shop</div>
    </footer>
  );
}
