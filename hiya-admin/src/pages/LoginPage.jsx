import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const DEMO = { email: 'admin@hiya.com', password: 'hiya123' };

// "/admin/" — public files (logo, photo) live under the app's base path
const BASE = import.meta.env.BASE_URL;

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Log in · HIYA Admin';
  }, []);

  if (!ready) return <Loader text="Checking your login…" />;

  // Already logged in (or just logged in): go to the page they wanted, or the dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from === '/login' ? '/' : from} replace />;
  }

  const loggedOut = location.state?.loggedOut;

  function handleSubmit(event) {
    event.preventDefault();
    if (email.trim() === '' || password === '') {
      setError('Please enter your email and password.');
      return;
    }
    const success = login(email, password, remember);
    if (!success) setError('Email or password is incorrect. Please try again.');
    // On success, `user` changes and the <Navigate> above sends them on.
  }

  function fillDemo() {
    setEmail(DEMO.email);
    setPassword(DEMO.password);
    setError('');
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Photo panel: desktop only */}
        <div className="col-lg-6 d-none d-lg-block p-3">
          <div
            className="login-photo h-100 rounded-5 d-flex flex-column justify-content-end p-5"
            style={{ '--login-photo': `url(${BASE}login-photo.jpg)` }}
          >
            <p className="login-quote mb-2">A little sip of happiness.</p>
            <p className="mb-0 small text-uppercase fw-semibold login-quote-sub">HIYA Coffee Shop · Admin</p>
          </div>
        </div>

        {/* Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
          <main className="w-100 login-box">
            <div className="text-center mb-4">
              <img src={`${BASE}logo.png`} alt="HIYA Coffee Shop" className="login-logo mb-3" />
              <h1 className="page-title h2 mb-1">Welcome back</h1>
              <p className="text-body-secondary mb-0">Log in to the HIYA admin dashboard.</p>
            </div>

            <div className="card">
              <div className="card-body p-4 p-sm-5">
                {loggedOut && !error && (
                  <div className="alert login-info py-2 small" role="status">
                    <i className="bi bi-check-circle me-2" aria-hidden="true" />
                    You&apos;ve been logged out.
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="login-email" className="form-label">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      placeholder="you@hiya.com"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      aria-describedby={error ? 'login-error' : undefined}
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="login-password" className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder="Your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-describedby={error ? 'login-error' : undefined}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary password-toggle"
                        onClick={() => setShowPassword((shown) => !shown)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      id="login-remember"
                      type="checkbox"
                      className="form-check-input"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />
                    <label htmlFor="login-remember" className="form-check-label">Remember me</label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2">
                    Log in
                  </button>

                  {error && (
                    <p id="login-error" className="text-terra small fw-semibold mt-3 mb-0" role="alert">
                      <i className="bi bi-exclamation-circle me-2" aria-hidden="true" />
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Demo details for the training */}
            <div className="demo-note rounded-4 p-3 mt-3 small d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <span className="fw-semibold">Demo account</span>
                <br />
                {DEMO.email} · {DEMO.password}
              </div>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={fillDemo}>
                Fill in
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
