import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { to: '/users', label: 'Users', icon: 'bi-people' },
  { to: '/products', label: 'Products', icon: 'bi-cup-hot' },
  { to: '/orders', label: 'Orders', icon: 'bi-receipt' },
];

/**
 * Navigation. Uses Bootstrap's responsive "offcanvas-lg":
 * - 992px and wider: a normal fixed sidebar
 * - smaller screens: an offcanvas panel, shown when `open` is true
 */
export default function Sidebar({ open, onClose }) {
  // Close the panel with the Escape key
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div className="sidebar-shell">
        <aside
          id="sidebar"
          className={`offcanvas-lg offcanvas-start sidebar ${open ? 'show' : ''}`}
          tabIndex="-1"
          aria-label="Main navigation"
        >
          <div className="offcanvas-body d-flex flex-column p-4">
            {/* Brand */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
              <NavLink to="/" className="sidebar-brand d-flex align-items-center gap-3 text-reset text-decoration-none">
                <img src="/logo.png" alt="" />
                <div className="d-flex flex-column lh-sm">
                  <span>HIYA</span>
                  <small>ADMIN</small>
                </div>
              </NavLink>
              <button type="button" className="btn sidebar-close d-lg-none p-1" onClick={onClose} aria-label="Close menu">
                <i className="bi bi-x-lg fs-5" aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <nav className="nav flex-column gap-1">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className={`bi ${link.icon}`} aria-hidden="true" />
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-note mt-auto rounded-4 p-3 small">
              <i className="bi bi-info-circle me-2" aria-hidden="true" />
              Demo data · changes are not saved
            </div>
          </div>
        </aside>
      </div>

      {/* Dark backdrop behind the mobile panel */}
      {open && <div className="offcanvas-backdrop fade show d-lg-none" onClick={onClose} />}
    </>
  );
}
