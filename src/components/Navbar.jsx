import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { img } from '../utils/format';
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
// Order the sections appear on the page (used to highlight the active link).
const PAGE_ORDER = ['hero', 'story', 'menu', 'events', 'contact'];

// The admin dashboard is served by the same site at /admin
// (locally through the dev proxy, on Render as a sub-folder).
const ADMIN_LOGIN = '/admin/login';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const { count, openCart } = useCart();

  // Background after 40px + active link
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = 'hero';
      for (const id of PAGE_ORDER) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock page scroll, close on Esc or when widening past 992px
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 992px)');
    const onMq = (e) => e.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`hy-nav is-fixed${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="wrap">
        <a href="#hero" className="brand" aria-label="HIYA Coffee Shop, back to top" onClick={close}>
          <img src={img('logo.png')} alt="HIYA Coffee Shop" />
        </a>
        <span className="divider" aria-hidden="true" />
        <nav aria-label="Main">
          <ul className="links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={active === l.id ? 'active' : undefined} aria-current={active === l.id ? 'true' : undefined}>
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
