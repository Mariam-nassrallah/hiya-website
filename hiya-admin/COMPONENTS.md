# Components and pages

This file explains every component, page, hook and helper in the HIYA admin
dashboard: what it does, its props, its state and where it is used.

```
main.jsx ─ BrowserRouter ─ AuthProvider (logged-in user, login, logout)
└─ App ─ Routes
   ├─ /login → LoginPage
   └─ ProtectedRoute (no user → redirect to /login)
      └─ Layout  (holds all data + toast; passes them to pages with <Outlet context>)
         ├─ Sidebar
         ├─ TopNavbar ─ ConfirmModal (logout)
         ├─ <Outlet />  → Dashboard | UsersPage | ProductsPage | OrdersPage | NotFound
         │                 Dashboard: StatCard ×4, ChartCard ×2, StatusBadge
         │                 List pages: DataTable ─ SearchBar, Pagination, StatusBadge,
         │                                          EditModal, ConfirmModal
         └─ ToastMessage
```

---

## Entry and routing

### `main.jsx`
Imports Bootstrap CSS, Bootstrap Icons and `styles/theme.css` once. It renders
`<App />` inside `<BrowserRouter>` (so routing works everywhere) and
`<AuthProvider>` (so every component can read the logged-in user).

### `App.jsx`
Declares the routes. `/login` is public. Every other route is nested inside
`ProtectedRoute`, which lets you in only when logged in, and then inside the
`Layout`, so those pages share the sidebar and navbar.

| Path | Page | Login needed |
| --- | --- | --- |
| `/login` | `LoginPage` | no |
| `/` | `Dashboard` | yes |
| `/users` | `UsersPage` | yes |
| `/products` | `ProductsPage` | yes |
| `/orders` | `OrdersPage` | yes |
| `*` (anything else) | `NotFound` | yes |

- **Props:** none · **State:** none

---

## Login (demo, frontend only)

### `AuthContext` (`src/context/AuthContext.jsx`)
Shares the logged-in user with the whole app through React Context, so any
component can call `useAuth()` instead of passing the user through many props.

- **Provides:**

| Value | Type | Purpose |
| --- | --- | --- |
| `user` | `{ id, name, email, role }` \| null | The logged-in admin, or `null` |
| `ready` | boolean | `false` until the saved login has been checked |
| `login(email, password, remember)` | function → boolean | Returns `true` and logs in when the details match an admin in `src/data/admins.json`. The email ignores case and spaces. |
| `logout()` | function | Clears the user and the saved login |

- **State**

| State | Why |
| --- | --- |
| `user` | Who is logged in. The password is never stored here or in storage. |
| `ready` | Stops `ProtectedRoute` from sending you to `/login` before the saved login has been read |

- **useEffect (on page load):** reads the saved user from `localStorage` or
  `sessionStorage`, puts it in `user`, then sets `ready` to `true`.
- **Where the login is saved:**
  - "Remember me" checked → `localStorage` (survives closing the browser)
  - unchecked → `sessionStorage` (cleared when the browser session ends)
  - The key is `hiyaAdminUser`. `logout()` removes it from both.
- **Hook:** `useAuth()`
- **Used in:** `main.jsx` (`<AuthProvider>`), `ProtectedRoute`, `LoginPage`,
  `TopNavbar`

### `ProtectedRoute` (`src/components/ProtectedRoute.jsx`)
A layout route that guards the dashboard pages:
1. While `ready` is `false`, it shows the `Loader` ("Checking your login…").
2. When there is no `user`, it renders
   `<Navigate to="/login" replace state={{ from: location }} />`. `replace` keeps
   the protected page out of the back-button history, and `state.from`
   remembers the page the user wanted.
3. Otherwise it renders `<Outlet />`, which shows the `Layout` and the page.

- **Props:** none · **State:** none (reads `useAuth()` and `useLocation()`)
- **Used in:** `App.jsx`, as the parent of the `Layout` route

### `LoginPage` (`src/pages/LoginPage.jsx`, route `/login`)
The HIYA login screen:
- **Layout:** a centred card on the cream background with the logo and
  "Welcome back". On desktop (≥992 px) there's also a photo panel on the left;
  it's hidden on smaller screens.
- **Form:** email and password inputs. The eye button shows or hides the
  password. There's a "Remember me" checkbox and an olive "Log in" button.
- **Errors:** an error message appears under the form. Empty fields give
  "Please enter your email and password." Wrong details give "Email or password
  is incorrect."
- **Demo note:** a small note with the demo account details and a "Fill in"
  button.
- **After logout:** shows "You've been logged out." when `TopNavbar` sends
  `state.loggedOut`.
- **Redirects:** if a user is already logged in, or just logged in, it renders
  `<Navigate>` to `state.from` (the page they wanted) or to `/`. So:
  - opening `/login` while logged in goes to the Dashboard
  - logging in after being sent away from `/orders` goes back to `/orders`

- **Props:** none

| State | Why |
| --- | --- |
| `email`, `password`, `remember` | The form inputs (controlled inputs) |
| `showPassword` | Switches the password input between `type="password"` and `type="text"` |
| `error` | The message under the form (`''` = no error) |

- **useEffect:** sets the browser tab title once.
- **Used in:** `App.jsx`, route `/login`

### Demo account (`src/data/admins.json`)
`admin@hiya.com` / `hiya123`, name "Admin", role "Manager". This is training
data only. See the note in `README.md` about what a real login needs.

---

## Layout (`src/components/layout/`)

### `Layout`
The app shell: `Sidebar`, `TopNavbar`, then the current page through
`<Outlet />`, plus the global `ToastMessage`.

- **Props:** none
- **State**

| State | Why |
| --- | --- |
| `users`, `products`, `orders` | The data, shared by all pages. It lives here (lifted state) so an edit on one page also changes the Dashboard. |
| `loading` | `true` until the data is loaded; shows `Loader` instead of the page. |
| `toast` | The message shown in `ToastMessage` (`{ id, message, variant }` or `null`). |
| `sidebarOpen` | Whether the mobile offcanvas sidebar is open. |

- **useEffect**
  - **On mount:** a `setTimeout` (700 ms) copies the imported JSON into state and
    sets `loading` to `false`, to simulate waiting for a server. The timer is
    cleared on unmount.
  - **On route change** (`location.pathname`): closes the mobile sidebar and
    updates the browser tab title.
- **Shares with pages:** `<Outlet context={{ users, setUsers, products,
  setProducts, orders, setOrders, showToast }} />`. Pages read it with
  `useOutletContext()`.
- `showToast` and `hideToast` use `useCallback`, so the toast's timer is not
  restarted on every render.
- **Used in:** `App.jsx`, as the parent route

### `Sidebar`
Logo, "HIYA ADMIN", and `NavLink`s with icons (Dashboard, Users, Products,
Orders). The active link is highlighted in olive.

It uses Bootstrap's responsive `offcanvas-lg` class:
- **992 px and wider:** a normal sidebar, fixed on the left
- **below 992 px:** an offcanvas panel that slides in when `open` is `true`, with
  a backdrop. It closes with ×, a backdrop click, Escape, or choosing a link.

| Prop | Type | Purpose |
| --- | --- | --- |
| `open` | boolean | Show the mobile panel |
| `onClose` | function | Called to close the mobile panel |

- **State:** none (the parent `Layout` owns `sidebarOpen`)
- **useEffect:** while open, listens for the Escape key; the listener is removed
  on cleanup
- **Used in:** `Layout`

### `TopNavbar`
Sticky top bar with:
- a hamburger button (below 992 px)
- the page title (Playfair Display)
- the logged-in user's avatar (initials), name and role, read from `useAuth()`
- a Logout button, which opens a `ConfirmModal`. On confirm it calls `logout()`
  and goes to `/login` with `state: { loggedOut: true }`, so the login page shows
  "You've been logged out."

| Prop | Type | Purpose |
| --- | --- | --- |
| `title` | string | Current page title |
| `onMenuClick` | function | Opens the mobile sidebar |

- **State:** `confirmLogout` (boolean), which decides whether the confirm modal is
  shown
- **Hooks:** `useAuth()` for `user` and `logout`; `useNavigate()` for going to
  `/login`
- **Used in:** `Layout`

---

## Reusable components (`src/components/`)

### `StatCard`
One summary number with an icon, a label and a trend line. The trend is olive
with ↗ (up), terracotta with ↘ (down), or muted (neutral).

| Prop | Type | Purpose |
| --- | --- | --- |
| `icon` | string | Bootstrap Icons class, e.g. `"bi-people"` |
| `label` | string | e.g. "Total Users" |
| `value` | string \| number | The big number |
| `trend` | string | Small text under the number |
| `tone` | `'up' \| 'down' \| 'neutral'` | Trend colour and arrow |
| `color` | `'olive' \| 'terra' \| 'sage' \| 'espresso'` | Icon background |

- **State:** none · **Used in:** `Dashboard` (4 cards)

### `ChartCard`
A card with a title and subtitle around a chart. The chart sits in a box of fixed
height; Chart.js's `responsive` + `maintainAspectRatio: false` make it fill that
box and resize with the window.

| Prop | Type | Purpose |
| --- | --- | --- |
| `title` | string | Card title |
| `subtitle` | string (optional) | Small text under the title |
| `height` | number | Chart height in px (default 300) |
| `children` | node | The chart |

- **State:** none · **Used in:** `Dashboard` (bar/line chart and doughnut)

### `DataTable`
The one table used by the Users, Products and Orders pages.
- A search box that looks in every column and goes back to page 1.
- An optional filter dropdown.
- A Bootstrap `table-hover` inside `table-responsive`, so it scrolls sideways on
  small screens.
- 8 rows per page, with `Pagination` and a "Showing 1–8 of 40" line.
- Edit and Delete buttons on each row, and an empty-state message when nothing
  matches.

The **page** owns the data and decides how to save or delete. The **table** owns
only UI state.

| Prop | Type | Purpose |
| --- | --- | --- |
| `columns` | `{ key, label, render? }[]` | Columns to show. `render(row)` can return custom JSX (badges, money, dates) |
| `rows` | object[] | The data (each row needs a unique `id`) |
| `filter` | `{ key, label, allLabel, options }` (optional) | Filter dropdown, e.g. role |
| `editFields` | array | Field config passed to `EditModal` |
| `itemName` | string | e.g. `"user"`, used in titles and the empty message |
| `getRowLabel` | `row => string` | Name used in delete messages and button labels |
| `onSave` | `row => void` | Called with the edited row |
| `onDelete` | `row => void` | Called after the user confirms delete |
| `searchPlaceholder` | string | Placeholder for the search box |

| State | Why |
| --- | --- |
| `search` | Text in the search box (controlled input) |
| `filterValue` | Selected filter option (`'All'` by default) |
| `page` | Current page number |
| `editingRow` | Row open in `EditModal` (`null` = closed) |
| `deletingRow` | Row waiting for delete confirmation (`null` = closed) |

- **Derived data, recalculated on every render:**
  1. `rows.filter(...)` keeps rows that match both the filter and the search.
  2. `totalPages = Math.ceil(count / 8)`.
  3. `slice(first, first + 8)` gives the rows for the current page.

  `currentPage` is clamped, so deleting the last row on a page never shows an
  empty page.
- **Used in:** `UsersPage`, `ProductsPage`, `OrdersPage`

### `SearchBar`
A controlled text input with a search icon.

| Prop | Type | Purpose |
| --- | --- | --- |
| `value` | string | Current text (owned by the parent) |
| `onChange` | `text => void` | Called on every keystroke |
| `placeholder` | string | Placeholder and accessible label |

- **State:** none · **Used in:** `DataTable`

### `Pagination`
Bootstrap pagination with Prev, the page numbers and Next. Prev is disabled on
the first page and Next on the last. It renders nothing when there's only one
page.

| Prop | Type | Purpose |
| --- | --- | --- |
| `currentPage` | number | Highlighted page |
| `totalPages` | number | How many page buttons to show |
| `onPageChange` | `page => void` | Called with the new page number |

- **State:** none · **Used in:** `DataTable`

### `StatusBadge`
A rounded badge coloured by status (brand colours only):

| Colour | Statuses |
| --- | --- |
| Olive | Active, Available, Completed |
| Sage | Preparing |
| Terracotta | Pending |
| Espresso | Inactive, Out of stock, Cancelled |

| Prop | Type | Purpose |
| --- | --- | --- |
| `status` | string | The status text |

- **State:** none · **Used in:** the three list pages (via `columns.render`) and
  the Dashboard's recent orders

### `EditModal`
A Bootstrap modal with a form built from a `fields` list. It is pre-filled from
the row and validates on Save:
- required fields can't be empty
- emails must be valid
- numbers must be numbers, at or above their `min`

Number fields are saved as numbers. Typing in a field hides its old error.

| Prop | Type | Purpose |
| --- | --- | --- |
| `show` | boolean | Show or hide the modal |
| `title` | string | e.g. "Edit user" |
| `fields` | `{ name, label, type?, options?, min?, step?, half? }[]` | Form fields. `type` is `text`, `email`, `number` or `select`; `half: true` puts two fields side by side |
| `item` | object | The row being edited |
| `onSave` | `values => void` | Called with the cleaned values |
| `onClose` | function | Cancel, ×, Escape or a click outside |

| State | Why |
| --- | --- |
| `values` | The form inputs (controlled inputs) |
| `errors` | One message per invalid field |

- **useEffect:** when `item` changes, copies it into `values` and clears errors.
  Also uses `useModalBehavior` (Escape to close, no page scroll).
- **Used in:** `DataTable`

### `ConfirmModal`
An "Are you sure?" Bootstrap modal with Cancel and a confirm button.

| Prop | Type | Purpose |
| --- | --- | --- |
| `show` | boolean | Show or hide |
| `title` | string | Heading |
| `message` | string | Body text |
| `confirmLabel` | string | Confirm button text (default "Confirm") |
| `confirmVariant` | string | Bootstrap button variant, e.g. `"danger"` |
| `onConfirm` | function | Confirm clicked |
| `onCancel` | function | Cancel, ×, Escape or a click outside |

- **State:** none · **useEffect:** via `useModalBehavior`
- **Used in:** `DataTable` (delete) and `TopNavbar` (logout)

### `ToastMessage`
A Bootstrap toast in the bottom-right corner: olive for success, terracotta for
deletes, espresso for info. It hides itself after 3 seconds and can be closed
with ×.

| Prop | Type | Purpose |
| --- | --- | --- |
| `toast` | `{ id, message, variant }` \| null | What to show; `null` hides it |
| `onClose` | function | Hides the toast |

- **State:** none (the `Layout` owns `toast`)
- **useEffect:** starts a 3-second timer whenever `toast` changes; the cleanup
  clears it, so a new toast restarts the timer
- **Used in:** `Layout`

### `Loader`
A centred Bootstrap spinner with text, shown while data loads.

| Prop | Type | Purpose |
| --- | --- | --- |
| `text` | string | Message under the spinner |

- **State:** none · **Used in:** `Layout`

---

## Pages (`src/pages/`)

All pages read shared data with `useOutletContext()`. None of them has its own
`useState`: the data lives in `Layout`, and the UI state for tables lives in
`DataTable`.

### `Dashboard`
- **4 `StatCard`s** in a responsive row: `col-12` (phone), `col-md-6` (tablet),
  `col-xl-3` (desktop).
  - **Total Users:** shows how many joined in the last 60 days.
  - **Total Products:** shows how many are out of stock.
  - **Total Orders** and **Total Revenue** (completed orders only): show the change
    from last month to this month so far.
- **Orders & revenue** chart (react-chartjs-2 `Bar`): bars for orders and a line
  for revenue, for the last 6 months, calculated from `orders.json`.
- **Orders by status** chart (`Doughnut`), in the same colours as the badges.
- **Recent orders:** the 5 newest orders.
- **Top products:** the 5 best sellers by `sold`, each with a progress bar.

Because the data is static, "now" is the date of the newest order
(`getReferenceDate`), so the charts stay correct whenever the app is opened.
- **Props:** none · **State:** none (everything is derived from the data)
- **Used in:** route `/`

### `UsersPage`
Users table with the columns name (with initials), email, phone, role, status
and joined date, a role filter, and an edit form for name, email, phone, role
and status.
- **Props:** none · **State:** none
- **Save / Delete:** `setUsers` with `map` (replace the row) or `filter` (remove
  the row), then `showToast`
- **Used in:** route `/users`

### `ProductsPage`
Products table with the columns name, category, price, stock (marked "low" under
10), sold and status, a category filter, and an edit form for name, category,
price and stock.

**Status is not edited directly:** on save it is set from the stock (0 means
"Out of stock"), so the two can never disagree.
- **Props:** none · **State:** none · **Used in:** route `/products`

### `OrdersPage`
Orders table (newest first, a sorted copy) with the columns id, customer, items,
total, payment (with icon), status and date, a status filter, and an edit form
for customer, items, total, payment and status.
- **Props:** none · **State:** none · **Used in:** route `/orders`

### `NotFound`
A simple 404 card with a "Back to dashboard" link. The navbar title shows
"Page not found".
- **Props:** none · **State:** none · **Used in:** route `*`

---

## Hooks and helpers

### `useModalBehavior(show, onClose)` (`src/hooks/`)
Shared by both modals. While `show` is `true`, it:
- closes the modal on Escape
- adds Bootstrap's `modal-open` class to `<body>` so the page behind can't scroll

Both are removed in the effect's cleanup.

### `utils/stats.js`
Pure functions used by the Dashboard:

| Function | Returns |
| --- | --- |
| `getReferenceDate(orders)` | Date of the newest order |
| `getLastMonths(date, 6)` | `[{ key: '2026-06', label: 'Jun' }, …]` |
| `getMonthlyTotals(orders, months)` | Order count and revenue per month |
| `getRevenue(orders)` | Sum of completed orders |
| `getStatusCounts(orders)` | `{ Pending, Preparing, Completed, Cancelled }` |
| `getPercentChange(now, before)` | Percentage change |
| `trendText(change, label)` | e.g. "+12% vs Oct" |

### `utils/format.js`
`formatMoney`, `formatDate`, `formatDateTime`, `getInitials`.

### `utils/brand.js` and `utils/chartSetup.js`
- **`brand.js`:** the five brand colours as JavaScript values. Charts draw on a
  canvas, so they can't read CSS variables.
- **`chartSetup.js`:** registers only the Chart.js parts we use, and sets the
  font and tooltip colours.

### Data (`src/data/`)
| File | Contents |
| --- | --- |
| `users.json` | 40 users: `id, name, email, phone, role, status, joined` |
| `products.json` | 30 products: `id, name, category, price, stock, status, sold` (`sold` is used by "Top products") |
| `orders.json` | 60 orders, June to November 2026: `id, customer, items, total, payment, status, date` |
| `admins.json` | The demo login account: `id, email, password, name, role` |

---

## React concepts used

- **Components and props.** Each piece of UI is a function that receives props.
  For example, `StatCard` gets `label`, `value` and `trend`, and the same
  `DataTable` works for users, products and orders because the columns are passed
  in as props.
- **`useState`.** Components remember values between renders: the search text,
  the current page, which row is being edited, whether a modal is open, and the
  data itself.
- **`useEffect`.** Side effects that run after rendering:
  - `Layout` loads the data with a `setTimeout`
  - `ToastMessage` hides itself after 3 s
  - the modals listen for the Escape key

  Each effect returns a cleanup function that clears its timer or removes its
  listener.
- **Lifting state up.** The data lives in `Layout`, the closest common parent of
  all pages. Pages change it through setters passed down (`setUsers` and so on),
  so the Dashboard always shows the latest edits. In the same way,
  `sidebarOpen` lives in `Layout` because both `TopNavbar` (opens it) and
  `Sidebar` (closes it) need it.
- **Controlled inputs.** The search box, filter select and edit form get their
  value from state and update it in `onChange`. React state is the single source
  of truth.
- **Conditional rendering.** `loading ? <Loader /> : <Outlet />`; modals return
  `null` when `show` is `false`; empty-state messages appear when nothing
  matches.
- **Lists and keys.** Rows, links, page buttons and form fields are rendered with
  `.map()`, each with a stable `key` (usually the row's `id`).
- **React Router.**
  - `<Routes>` and `<Route>` map URLs to pages.
  - A layout route renders `<Outlet />` where the child page appears.
  - `<NavLink>` adds the `active` class to the current link.
  - `useLocation` reads the current path, and `useOutletContext` shares data
    from the layout with the pages.
  - `<Navigate>` redirects while rendering. `ProtectedRoute` uses it to send
    logged-out users to `/login`, passing `state.from` so `LoginPage` can send
    them back afterwards.
  - `useNavigate()` redirects from an event handler (the logout button).
- **Context (`createContext` + `useContext`).** `AuthContext` shares the
  logged-in user with any component (`TopNavbar`, `LoginPage`, `ProtectedRoute`)
  without passing props through every level. A custom hook, `useAuth()`, wraps
  `useContext`.
- **Browser storage.** The login is saved in `localStorage` ("Remember me") or
  `sessionStorage`, and restored in a `useEffect` when the page loads.
- **Derived data.** Values that can be calculated are not stored in state. Search
  results (`filter`), the current page (`slice`), totals (`reduce`) and chart
  data are worked out from the data on every render.
