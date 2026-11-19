import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import usersData from '../../data/users.json';
import productsData from '../../data/products.json';
import ordersData from '../../data/orders.json';
import Loader from '../Loader';
import ToastMessage from '../ToastMessage';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const LOADING_DELAY = 700; // ms, pretends we are waiting for a server

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/products': 'Products',
  '/orders': 'Orders',
};

/**
 * The app shell: sidebar + top navbar + the current page (<Outlet />).
 * The data lives here (lifted state) so every page shares it: an edit on the
 * Orders page also changes the numbers on the Dashboard.
 */
export default function Layout() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Page not found';

  // Load the JSON data once, after a short fake delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setLoading(false);
    }, LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Close the mobile sidebar and update the tab title when the page changes
  useEffect(() => {
    setSidebarOpen(false);
    document.title = `${pageTitle} · HIYA Admin`;
  }, [location.pathname, pageTitle]);

  // Phones and tablets use the "app shell" layout on dashboard pages (theme.css):
  // only the content area scrolls, below the top bar. The class is set only
  // while this Layout is shown, so the login page keeps normal scrolling.
  useEffect(() => {
    document.documentElement.classList.add('admin-shell');
    return () => document.documentElement.classList.remove('admin-shell');
  }, []);

  // useCallback keeps these functions the same between renders,
  // so the toast timer is not restarted on every render.
  const showToast = useCallback((message, variant = 'success') => {
    setToast({ id: Date.now(), message, variant });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  // Everything a page needs, shared through <Outlet context>
  const pageContext = { users, setUsers, products, setProducts, orders, setOrders, showToast };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`admin-main d-flex flex-column${sidebarOpen ? ' sidebar-open' : ''}`}>
        <TopNavbar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="container-fluid px-3 px-md-4 py-4 flex-grow-1">
          {loading ? <Loader text="Loading HIYA data…" /> : <Outlet context={pageContext} />}
        </main>
      </div>

      <ToastMessage toast={toast} onClose={hideToast} />
    </>
  );
}
