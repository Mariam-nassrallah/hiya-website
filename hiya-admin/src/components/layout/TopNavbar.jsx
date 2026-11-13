import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/format';
import ConfirmModal from '../ConfirmModal';

/** Top bar: menu button (mobile), page title, logged-in user and Logout. */
export default function TopNavbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  function handleConfirm() {
    setConfirmLogout(false);
    logout();
    // Tell the login page to show "You've been logged out"
    navigate('/login', { replace: true, state: { loggedOut: true } });
  }

  return (
    <>
      <header className="top-navbar sticky-top">
        <div className="container-fluid px-3 px-md-4 py-3 d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-icon d-lg-none flex-shrink-0"
            onClick={onMenuClick}
            aria-label="Open menu"
            aria-controls="sidebar"
          >
            <i className="bi bi-list fs-5" aria-hidden="true" />
          </button>

          <h1 className="page-title h3 mb-0 text-truncate">{title}</h1>

          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="avatar" aria-hidden="true">{getInitials(user.name)}</span>
              <div className="d-none d-sm-block lh-sm">
                <div className="fw-semibold">{user.name}</div>
                <small className="text-body-secondary">{user.role}</small>
              </div>
            </div>
            <button type="button" className="btn btn-outline-danger btn-sm px-3" onClick={() => setConfirmLogout(true)}>
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
              <span className="d-none d-md-inline ms-2">Logout</span>
              <span className="visually-hidden d-md-none">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the header: the header's blur effect would otherwise trap the fixed modal inside it */}
      <ConfirmModal
        show={confirmLogout}
        title="Log out?"
        message={`You will be signed out of the HIYA admin dashboard, ${user.name}.`}
        confirmLabel="Log out"
        confirmVariant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
}
