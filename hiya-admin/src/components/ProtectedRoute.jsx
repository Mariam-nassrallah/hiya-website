import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * Wraps the pages that need a login.
 * - still checking the saved login -> show a spinner
 * - not logged in -> go to /login and remember the page they wanted
 * - logged in -> show the page (<Outlet />)
 */
export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <Loader text="Checking your login…" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
