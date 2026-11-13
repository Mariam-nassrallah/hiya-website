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

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173) and log in
with the demo account:

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

Other scripts:

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build
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

| URL | Page |
| --- | --- |
| `/login` | Login (public) |
| `/` | Dashboard |
| `/users` | Users |
| `/products` | Products |
| `/orders` | Orders |
| anything else | 404 page |
