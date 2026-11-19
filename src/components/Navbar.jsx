import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { img } from '../utils/format';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import { BagIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'story', label: 'Our Story' },
  { id: 'events', label: 'Experiences' },
  { id: 'contact', label: 'Contact' },
];

// The admin dashboard is served by the same site at /admin
// (locally through the dev proxy, on Render as a sub-folder).
const ADMIN_LOGIN = '/admin/login';

/**
 * A normal (not fixed) navbar that scrolls away with the page.
 * onHero: true when it sits at the top of the hero (transparent, positioned
 * absolutely inside the hero). Without a hero it is a solid olive bar.
 */
export default function Navbar({ onHero = false }) {
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();

  // Mobile menu: lock page scroll, close on Esc or when widening past 992px
  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 992px)');
    const onMq = (e) => e.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`hy-nav${onHero ? ' on-hero' : ''}${open ? ' open' : ''}`}>
      <div className="wrap">
        <a href="#hero" className="brand" aria-label="HIYA Coffee Shop, back to top" onClick={close}>
          <img src={img('logo.png')} alt="HIYA Coffee Shop" />
        </a>
        <span className="divider" aria-hidden="true" />
        <nav aria-label="Main">
          <ul className="links">
            {LINKS.map((l) => (
              <li key={l.id}>
                {/* "Home" keeps the underline from the design: the navbar is only seen at the top of the page */}
                <a href={`#${l.id}`} className={l.id === 'hero' ? 'active' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <button type="button" className="nav-icon nav-cart" onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <BagIcon />
            {count > 0 && <span className="nav-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
          </button>
          <a href={ADMIN_LOGIN} className="nav-icon nav-admin" title="Admin login" aria-label="Admin login">
            <i className="bi bi-person-circle" aria-hidden="true" />
          </a>
          <a href="#menu" className="hy-btn btn-order">
            ORDER NOW <BagIcon />
          </a>
          <button
            type="button"
            className="burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav className="menu-panel" id="mobile-menu" aria-label="Mobile" aria-hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={close} tabIndex={open ? 0 : -1}>
            {l.label}
          </a>
        ))}
        <a href="#menu" className="hy-btn btn-terra" onClick={close} tabIndex={open ? 0 : -1}>
          ORDER NOW
        </a>
        <a href={ADMIN_LOGIN} className="menu-admin" tabIndex={open ? 0 : -1}>
          <i className="bi bi-person-circle" aria-hidden="true" />
          Admin login
        </a>
      </nav>
    </header>
  );
}
