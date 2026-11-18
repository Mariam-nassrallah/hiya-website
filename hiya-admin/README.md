# HIYA Admin Dashboard

A responsive admin dashboard for **HIYA Coffee Shop**, built with **React
(Vite)**, **Bootstrap 5**, **React Router** and **Chart.js**. It manages users,
products and orders using static JSON data. There is no backend and no Redux:
all changes live in React state and reset when the page is reloaded.

## Features

- **Login (demo):** a `/login` page with show/hide password and "Remember me".
  Every dashboard page is protected and sends you to the login first, then back
  to the page you wanted. Logout asks for confirmation.
- **Dashboard**
  - stat cards (users, products, orders, revenue) with trends
  - an orders and revenue chart for the last 6 months
  - an orders-by-status doughnut
  - recent orders and top products
- **Users, Products and Orders pages**, all built on one reusable table:
  - search across all columns
  - a filter (role, category or status)
  - pagination (8 rows per page)
  - an edit modal with validation, a delete confirmation and toast messages
- **Shared data:** an edit on any page updates the Dashboard straight away.
- **Responsive:**
  - fixed sidebar on desktop; offcanvas menu on tablet and phone
  - stat cards 4, 2 or 1 per row
  - tables scroll sideways inside their card
  - charts resize with the window
- **HIYA branding:** olive, terracotta, cream, espresso and sage, with Playfair
  Display titles and DM Sans text.
- **Accessible:** keyboard-friendly modals (Escape closes them), labelled buttons
  and form fields, and reduced-motion support.

## Screenshots

_Add screenshots here._

| Dashboard | Orders (phone) |
| --- | --- |
| `docs/dashboard.png` | `docs/orders-mobile.png` |

## Getting started

Requirements: Node.js 18 or newer.

This dashboard is served at **`/admin`** on the same site as the HIYA website
(the parent folder), so run both from the **parent folder**:

```bash
cd ..                  # the hiya-website folder
npm run install:all    # installs the website and this dashboard
npm run dev            # starts both
```

Open **http://localhost:5173/admin/login** and log in with the demo account:

| Email | Password |
| --- | --- |
| `admin@hiya.com` | `hiya123` |

## About the login

> **This login is a demo for the training. It is not secure.**
>
> The account is stored in `src/data/admins.json`, which ships with the app, so
> anyone can read the email and password in the browser. The check happens in
> the browser, and "logged in" only means a user object was saved in
> `localStorage` or `sessionStorage`, which anyone can edit.
>
> A real login needs a **backend**:
> - Passwords are stored only as **hashes** (for example bcrypt or Argon2), never
>   as plain text, and are checked on the server.
> - After a successful login the server issues a **token or session**, such as a
>   short-lived JWT or an httpOnly secure cookie, and checks it on every API
>   request.
> - The server enforces roles and permissions, uses HTTPS, and limits repeated
>   login attempts.
>
> Hiding pages in React (`ProtectedRoute`) only improves the experience. Real
> protection has to happen on the server.

How `/admin` works:
- `vite.config.js` sets `base: '/admin/'`, so every built file expects to live
  under `/admin`.
- The dev server runs on the fixed port **5174**. The website's dev server on
  5173 forwards `/admin` to it, so you open 5173.
- `src/main.jsx` uses `<BrowserRouter basename="/admin">`, so the routes below
  become `/admin/login`, `/admin/orders` and so on.
- Images in `public/` (the logo and the login photo) are referenced with
  `import.meta.env.BASE_URL`, which is `/admin/`.
- On Render, the parent folder's `npm run build` builds this app and copies
  `dist/` into the website's `dist/admin`. See the parent `README.md`.

Scripts in this folder (normally run from the parent instead):

```bash
npm run dev       # this dashboard only, http://localhost:5174/admin/
npm run build     # production build in dist/ (expects to be served at /admin)
```

## Project structure

```
src/
  main.jsx            Bootstrap + icons + theme, BrowserRouter
  App.jsx             routes
  data/               users.json, products.json, orders.json
  styles/theme.css    brand colours (Bootstrap variable overrides)
  utils/              formatting, dashboard calculations, chart setup
  context/            AuthContext (demo login)
  hooks/              useModalBehavior
  components/         StatCard, ChartCard, DataTable, SearchBar, Pagination,
                      StatusBadge, EditModal, ConfirmModal, ToastMessage, Loader
  components/layout/  Layout, Sidebar, TopNavbar
  components/         ProtectedRoute (sends logged-out users to /login)
  pages/              LoginPage, Dashboard, UsersPage, ProductsPage, OrdersPage, NotFound
```

See [COMPONENTS.md](COMPONENTS.md) for every component's props, state and the
React concepts used.

## Routes

All routes sit under `/admin` (the router's `basename`).

| URL | Page |
| --- | --- |
| `/admin/login` | Login (public) |
| `/admin/` | Dashboard |
| `/admin/users` | Users |
| `/admin/products` | Products |
| `/admin/orders` | Orders |
| anything else under `/admin` | 404 page |
