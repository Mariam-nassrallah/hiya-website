# Components

Reference for every component, context and hook in `src/`. The page is a single
scroll in this order: Navbar → Hero → StorySection → MenuSection → EventsSection
→ WhyUs → Gallery → Contact → Footer, with CartDrawer mounted at the end.

**Layout rules:**
- **The navbar is `position: static`,** in the normal document flow. The hero
  starts right at its bottom edge, and both scroll away with the page, so
  nothing can pass behind the navbar. Anchor links like `#menu` need no
  `scroll-margin-top`.
- **No sideways scrolling.** `html, body { overflow-x: clip }` is set as a safety
  net, but nothing on the page is wider than the screen even without it (checked
  at 375, 390, 768, 1024 and 1440 px).

---

## App structure

### `main.jsx`
Entry point. Imports Bootstrap CSS once, then `styles/variables.css` and
`styles/global.css`, and renders `<App />` inside `ThemeProvider`, `CartProvider`
and `EventsProvider`.

### `App.jsx`
Lays out the page: a "Skip to content" link (to `#main`), the `Navbar`, then
`<main>` with all the sections, the footer and the cart drawer.
- **Props:** none · **State:** none
- **Used in:** `main.jsx`

---

## Context

### `ThemeContext` (`context/ThemeContext.jsx`)
Light/dark theme for the whole site.
- **Provides:** `theme` (`'light' | 'dark'`), `toggle()`
- **State:** `theme`. Saved to `localStorage` (`hiyaTheme`) and applied as
  `data-bs-theme` on `<html>`. A small script in `index.html` applies the saved
  theme before the first paint to avoid a flash.
- **Smooth switch:** `toggle()` adds `theme-switching` to `<html>` for 650 ms,
  which turns on colour transitions everywhere. The timer is cleared on unmount.
- **Hook:** `useTheme()`
- **Used in:** `ThemeToggle`

### `CartContext` (`context/CartContext.jsx`)
Cart items and the open/closed state of the cart drawer.
- **Provides:** `items`, `count`, `total`, `add(product)`, `inc(id)`, `dec(id)`
  (stops at 1), `remove(id)`, `clear()`, `isOpen`, `openCart()`, `closeCart()`
- **State:** `items` (`[{ id, name, price, qty }]`), saved to
  `localStorage` (`hiyaCart`); `isOpen`
- **Hook:** `useCart()`
- **Used in:** `Navbar`, `MenuSection`, `CartDrawer`

### `EventsContext` (`context/EventsContext.jsx`)
Shared events state, so the hero pill and the events section always use the
same event and the same registrations.
- **Provides:** `events`, `loading`, `error`, `nextEvent` (from `getNextEvent`, or
  `null`), `regs`, `takenOf(event)` (seats booked from the JSON plus registered
  guests), `openRegistration(event, opener)`
- **State:** registrations
  (`{ [eventId]: { name, phone, email, guests, notes, code, eventDate } }`, saved
  to `localStorage` as `hiyaRegs`). A registration only counts when both the id
  and `eventDate` match an event in `events.json`, so a saved booking never
  carries over to a new event that reuses the same id. `now`, refreshed every 60 s so
  `nextEvent` moves on once an event has started (the interval is cleared on
  unmount); `modal` (`{ open, eventId }`).
- **Renders:** the single shared `RegisterModal` after its children. When the
  modal closes, focus goes back to the element that opened it (the hero pill or
  the card button).
- **Data:** `events.json` via `useJsonData(fetchEvents)`
- **Hook:** `useEvents()`
- **Used in:** `main.jsx` (provider), `EventsSection`, `EventPill`

---

## Hooks and data

### `useReveal(threshold = 0.15)` (`hooks/useReveal.js`)
Fade-up when an element scrolls into view, once only. Returns `[ref, shown]`.
It uses an `IntersectionObserver` that disconnects after the first hit and on
unmount. Shows the element at once if `IntersectionObserver` is missing.
- **Used in:** `Reveal`

### `useJsonData(loader)` (`data/useJsonData.js`)
Runs a data loader and returns `{ data, error, loading }`. The fetch is aborted
on unmount. `loader` must be a stable module-level function.
- **Used in:** `MenuSection` (`fetchMenu`), `EventsSection` (`fetchEvents`)

### `data/api.js`
`fetchMenu(signal)` loads `public/data/menu.json` and returns its `categories`.
`fetchEvents(signal)` loads `public/data/events.json`.

### Event data (`public/data/events.json`)
An array of events. Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | number | Unique id |
| `title` | string | Text before a `:` is used as the short title in the hero pill |
| `type` | string | e.g. `"Art"`; shown in the label "UPCOMING ART EVENT" and on the photo tag |
| `date` | `"YYYY-MM-DD"` | The weekday is calculated from this |
| `time` | `"h:mm AM/PM"` | Start time, used for the countdown and `getNextEvent` |
| `end` | `"h:mm AM/PM"`, optional | When set, the time shows as "6:30 PM – 8:30 PM" |
| `duration` | string | e.g. `"2 hrs"` |
| `price` | number | `0` shows "Free" |
| `priceLabel` | string, optional | Text after the price, e.g. `"/ painter"`; defaults to `"/ person"` |
| `seats`, `taken` | number | Capacity and seats already booked |
| `image` | string | File in `public/images/` |
| `poster` | boolean, optional | `true` shows `image` as a full 4:5 poster with no badge or tag on top |
| `includes` | string[], optional | Shown as sage pills with a ✓ |
| `description` | string | |

### `utils/events.js`
- **`getNextEvent(events, now = new Date())`** returns the event that starts
  soonest after `now`, skipping events that have already started, or `null` if
  there are none. The start time comes from `date` (`YYYY-MM-DD`) plus `time`
  (`h:mm AM/PM`) in local time. Used by `EventsContext`, so the Hero pill and
  `EventsSection` always show the same event.
- **`eventStart(event)`** returns the event's start as a `Date`.
- **`timeUntil(target, now)`** returns `{ done, days, hours, minutes }` (never
  negative). Used by `Countdown`.

### `utils/format.js`
Helpers: `img(file)` (path to `public/images`), `money(n)`, `shortMoney(n)`,
`formatDate(iso)` → `{ day, mon, wd }`, `readStore` / `writeStore` (localStorage
that never throws).

### `utils/scrollLock.js`
`lockScroll()` / `unlockScroll()` stop the page from scrolling behind a
full-screen overlay by adding the `scroll-locked` class to `<html>`.
- **Why `<html>`:** it has `overflow-x: clip`, so `overflow: hidden` on `<body>`
  alone would **not** stop the page from scrolling.
- **Nesting:** a counter means nested overlays unlock correctly.
- **Used by:** `Navbar` (mobile menu), `RegisterModal` and `CartDrawer`. Each
  unlocks when it closes or unmounts.

---

## Shared building blocks

### `Reveal`
Wrapper that applies `useReveal`: renders `.fx`, which becomes `.fx.in` when
visible.
- **Props:** `as` (tag, default `div`), `className`, `children`, plus any other
  props passed through
- **State:** via `useReveal`
- **Used in:** StorySection, MenuSection, EventsSection, WhyUs, Gallery, Contact

### `Wave`
Curved SVG edge filled with the page background colour, so it follows the theme.
- **Props:** `position` (`'top' | 'bottom'`)
- **Used in:** `MenuSection`

### `Icons`
Inline SVG icons from the design: `ArrowIcon`, `BagIcon`, `PlayIcon`,
`SearchIcon`, `SunIcon`, `MoonIcon`, `CheckIcon`, `TrashIcon`. All are
`aria-hidden`. Some take `size` / `strokeWidth` / `color`.
- **Used in:** most components

---

## Sections

### `Navbar`
A **static** header (`position: static`, normal document flow) with a solid olive
background (`var(--olive)`) and cream text. There is no fixed or sticky
positioning, no z-index and no blur, so it scrolls away with the page and the
hero starts right below it.

It holds the logo, a divider, the links (Home, Menu, Our Story, Experiences,
Contact), the theme toggle, the cart button with count, an **Admin login** icon
button (`bi-person-circle`, title "Admin login") and ORDER NOW.
- **iPhones:** `padding-top: env(safe-area-inset-top)` is added for the notch.
- "Home" keeps the underline from the design. There is no scroll listener and no
  "scrolled" state.
- **Under 992 px:** the links become a hamburger that opens a full-screen olive
  panel with a circle `clip-path` animation.
  - Only while open, the panel is a `position: fixed` overlay, and the bar's row
    (logo, theme, cart, close button) is kept above it.
  - The page behind is locked with `lockScroll()` and unlocked on close.
  - The panel closes on the X, a link click, Esc, or when the window widens past
    992 px.
- **Admin login link:** goes to `/admin/login`, the admin dashboard on the same
  site. Locally, Vite's dev proxy serves it; on Render it's the `dist/admin`
  folder.
  - On desktop it's the round icon before ORDER NOW.
  - Under 992 px the icon is hidden, and "Admin login" appears at the bottom of
    the full-screen menu instead.

- **Props:** none
- **State:** `open` (mobile menu)
- **Listeners:** only while the menu is open: `keydown` (Esc) and a `matchMedia`
  listener. Both are removed on cleanup, which also unlocks scrolling.
- **Used in:** `App`

### `ThemeToggle`
Round sun/moon button that cross-fades between the two icons.
- **Props:** none · **State:** from `useTheme()`
- **Used in:** `Navbar`

### `Hero`
Contains, in order:
- `EventPill` (next event), the eyebrow, and the heading "A little sip of
  happiness." (terracotta dot)
- the description and the EXPLORE OUR MENU and DISCOVER HIYA buttons
- the drinks image, on the right with soft masked edges, which slides in on load
- three `HeroCard`s at the end

The hero starts directly **under** the static navbar: its background begins at
the navbar's bottom edge, with no negative margin and no extra padding for the
navbar.
- **Content:** starts `56px` from the hero's top (`40px` on phones).
- **Height:** `max(100vh − 106px, 654px)`, so the navbar plus the hero fill the
  first screen.
- **Drinks image:** `position: absolute; top: 0` inside the hero, which is
  `position: relative; overflow: hidden`, so it never reaches the navbar.

**Phones:** the buttons are full width, the drinks image moves under the buttons,
and the cards stack.
- **Props:** none · **State:** none (CSS animations only; the pill reads
  `EventsContext`)
- **Used in:** `App`

### `EventPill`
Pill above the hero eyebrow: a pulsing terracotta dot, then
"Next event: *short title* · *day MON*", then a terracotta action part. The short
title is the part of the title before a colon, so "Coffee & Canvas: Paint + Sip
Night" becomes "Coffee & Canvas". The date is hidden under 520 px, and long
titles are cut off with "…".
- **REGISTER →** opens `RegisterModal` for that event.
- **MY TICKET →** when you're already registered; it opens the ticket.
- **FULL** when no seats are left; it scrolls to `#events` (instantly with
  reduced motion).
- Renders nothing when there's no upcoming event.
- **Props:** none
- **State:** none (reads `nextEvent`, `regs`, `takenOf` and `openRegistration`
  from `useEvents()`)
- **Used in:** `Hero`

### `HeroCard`
A card linking to a section, with a photo faded in from the right.
- **Props:** `title`, `image` (file in `public/images`), `href`, `variant`
  (`'c1'` olive, `'c2'` terracotta, `'c3'` cream), `delay` (entrance delay in seconds)
- **Used in:** `Hero` (Signature Drinks → `#menu`, Sweet Treats → `#menu`,
  Creative Experiences → `#events`)

### `StorySection` (`#story`)
Arch-shaped photo with a spinning terracotta logo badge, text, 3 stats and a
button.
- **Props:** none · **State:** none
- **Used in:** `App`

### `MenuSection` (`#menu`), "Pick your pour."
Olive section with waves at the top and bottom.
- Search bar: filters items by name across all categories and shows a result count.
- Cart pill with the item count: opens the drawer.
- Category pills with item counts. The active pill is terracotta. On phones the
  pills form a 2-column grid.
- Left side: italic category title and description. Right side: a 2-column list
  of `MenuItemRow`s.
- Category switch: the current content fades and blurs out over 250 ms, then the
  new content fades and blurs in with a 50 ms stagger per row.
- **Props:** none
- **State:** `active` (highlighted pill), `shown` (category on screen),
  `leaving`, `cycle` (replays the enter animation), `query`.
  The 250 ms timer is cleared on unmount.
- **Data:** `menu.json` via `useJsonData(fetchMenu)`
- **Used in:** `App`

### `MenuItemRow`
One menu row: name, HIYA PICK tag, dotted leader, price, and a round "+" button.
There is no thumbnail. The button shows ✓ for 0.9 s after an add.
- **Props:** `item` (`{ id, name, price, image?, description, pick }`), `index`
  (for the stagger delay), `leaving` (plays the out animation), `onAdd(item)`
- **State:** `added`. Its timer is cleared on unmount.
- **Used in:** `MenuSection`

### `CartDrawer`
Bootstrap Offcanvas on the right, controlled by `CartContext.isOpen`.
- Lists items (name, no thumbnail) with quantity −/+, remove, line totals and the total.
- **Checkout** clears the cart, closes the drawer and shows a Bootstrap Toast
  with a thank-you message.
- Closes with ×, Esc or a backdrop click (Bootstrap fires `hidden.bs.offcanvas`,
  which updates React state).
- **Page scroll:** locked with `lockScroll()` on `show.bs.offcanvas` and unlocked
  on `hidden.bs.offcanvas`. The offcanvas uses `scroll: true`, so Bootstrap's own
  body lock doesn't interfere.
- **Phones:** full width (`min(420px, 100vw)`).
- **Props:** none
- **State:** `thanks` (toast text). Bootstrap instances are disposed on unmount.
- **Used in:** `App`

### `EventsSection` (`#events`), "Next at HIYA."
Shows only the next upcoming event (`nextEvent` from `EventsContext`) as one
large `EventCard`. There is no type filter or grid. Without an upcoming event it
shows: "No upcoming events right now. Follow us on Instagram to hear about the
next one."
- **Props:** none
- **State:** none (reads `nextEvent`, `loading`, `error`, `regs`, `takenOf` and
  `openRegistration` from `useEvents()`)
- **Used in:** `App`

### `EventCard`
Large card for the next event. The left side depends on `event.poster`:
- **`poster: true`:** the full poster at 4:5 with nothing on top of it. The
  poster image's alt text gives the title, date and time.
- **otherwise:** a photo with a date badge and type tag.

The right side has:
- the "UPCOMING *TYPE* EVENT" label (for example "UPCOMING ART EVENT"), the title,
  and the day/date, time and duration. The time is shown as "6:30 PM – 8:30 PM"
  when `end` is set.
- the description, then `includes` as small sage pills with a terracotta ✓, then
  a `Countdown`
- the seats bar: "X seats left", "Only X left!" when 3 or fewer seats remain, or
  "Fully booked"
- the price with `priceLabel` (for example "$50 / painter"), or "Free", and a
  button: **Register now**, **✓ View my ticket** (opens the ticket) or **Full**
  (disabled)

It stacks to one column under 860 px.
- **Props:** `event`, `taken` (seats booked, including your registration),
  `registration` (or `undefined`), `onRegister(event, button)`
- **State:** none
- **Used in:** `EventsSection`

### `Countdown`
Days / hours / minutes until the event starts, in three tiles. It updates every
30 s and shows "Starting now" once the time is reached.
- **Props:** `target` (`Date`)
- **State:** `now`. The 30 s interval is cleared on unmount.
- **Used in:** `EventCard`

### `RegisterModal`
Registration dialog (`role="dialog"`, `aria-modal`).
- Fields: name, WhatsApp phone, optional email, a guests stepper from 1 to 6
  (never more than the seats left), and notes. Shows a live total.
- Validation messages appear after the first submit attempt.
- On success it shows a ticket with a booking code such as `HY-6JV93`. Events
  you already registered for reopen straight to the ticket.
- Closes with ×, Done, Esc or a click outside. Keeps Tab focus inside, locks page
  scroll with `lockScroll()`, and becomes a full-width bottom sheet under 640 px.
- **Props:** `open`, `event`, `registration`, `seatsLeft`, `onClose()`,
  `onRegister(eventId, record)`
- **State:** `values` (`name`, `phone`, `email`, `notes`), `guests`, `tried`.
  The `keydown` listener and focus timer are cleaned up.
- **Used in:** `EventsContext`, which renders one instance shared by the hero
  pill and the events card

### `WhyUs`
Three reason cards. The middle one is terracotta. Cards lift on hover.
- **Props:** none · **State:** none
- **Used in:** `App`

### `Gallery` (`#gallery`)
Photo grid (one tall photo and six small ones). Photos zoom slowly on hover.
- **Columns:** 4 on desktop, 2 on tablets. On phones (≤ 520 px) it's a single
  column, with the first photo a little taller.
- **Props:** none · **State:** none
- **Used in:** `App`

### `Contact` (`#contact`)
Sage section with a rounded top: address, hours and phone, plus a form card. The
form checks name, email and message, then shows a thank-you message. Nothing is
sent to a server.
- **Props:** none
- **State:** `values`, `tried`, `sentTo`
- **Used in:** `App`

### `Footer`
Espresso footer: logo, Visit / Follow links and the copyright.
- **Columns:** 3 on desktop and 2 on tablets; stacked in one column on phones
  (≤ 520 px).
- **Props:** none · **State:** none
- **Used in:** `App`

---

## Styles

| File | Covers |
| --- | --- |
| `styles/variables.css` | The five brand colours, the tones mixed from them, light/dark tokens |
| `styles/global.css` | Base styles; the no-sideways-scroll safety net (`overflow-x: clip`, media `max-width: 100%`); the `scroll-locked` class; Bootstrap Reboot overrides; buttons, labels, reveal and enter/exit animations; waves; theme transition; reduced motion |
| `styles/navbar.css` | Static navbar and the full-screen mobile menu |
| `styles/hero.css` | Hero, hero cards and the next-event pill |
| `styles/story.css` | Our Story |
| `styles/menu.css` | Menu section |
| `styles/cart.css` | Cart drawer, toast, shared `.x` close button and `.total` row |
| `styles/events.css` | Next-event card, countdown, empty state, registration modal, shared form fields |
| `styles/sections.css` | Why Us, Gallery, Contact, Footer |

Design classes that Bootstrap also defines are prefixed so Bootstrap can't change
the look: `.hy-btn`, `.hy-nav`, `.hy-modal`, `.hy-card`, `.hy-h2`, `.hy-lead`.
