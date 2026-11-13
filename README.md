# HIYA Coffee Shop

The website for HIYA Coffee Shop: *"A little sip of happiness."* It is a single
page built with **React (Vite)** and **Bootstrap 5**, in HIYA's olive, terracotta,
cream, espresso and sage colours.

## Features

- **Hero:** animated heading, drinks image that slides in, and three cards
  linking into the page.
- **Menu, "Pick your pour":** category pills, search across the whole menu, and
  fade/blur transitions between categories. The menu comes from
  `public/data/menu.json`.
- **Cart:** add items from the menu, change quantities, remove items and check
  out (shows a thank-you toast). The cart is saved in the browser.
- **Next event:** the closest upcoming event from `public/data/events.json` is
  shown in the "Next at HIYA." section with a live countdown and seat count, and
  in a pill at the top of the hero. Registration has validation, a guest count
  and a ticket with a booking code. Registrations are saved in the browser. Past
  events are skipped automatically, and if none are left the site says so.
- **Light and dark theme:** toggle in the navbar, remembered between visits.
- **Responsive** layout for desktop, tablet and phone, including a full-screen
  mobile menu and a bottom-sheet registration form on phones.
- **Accessible:** keyboard-friendly controls, alt text, focus handling in dialogs,
  and support for `prefers-reduced-motion`.

There is no backend. The contact form, checkout and registrations are
demonstrations that run entirely in the browser.

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

### Admin login link

The person icon in the navbar ("Admin login") opens the admin dashboard, which
is a separate app in [`hiya-admin/`](hiya-admin/). Its address comes from an
environment variable in `.env`:

```bash
VITE_ADMIN_URL=http://localhost:5174/login
```

To run both apps locally, use two terminals:

```bash
npm run dev                    # website  → http://localhost:5173
cd hiya-admin && npm run dev   # admin    → http://localhost:5174 (fixed port)
```

After deploying the admin dashboard, change `VITE_ADMIN_URL` to its real
address, for example `https://admin.hiya.com/login`. You can change it in `.env`,
or set it in your hosting provider's environment settings. Vite reads the value
when the site is **built**, so rebuild or redeploy after changing it. See
`.env.example`.

Other scripts:

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
public/
  images/        logo, hero image and photos
  data/          menu.json, events.json
src/
  components/    page sections and UI pieces
  context/       ThemeContext, CartContext
  hooks/         useReveal
  data/          JSON loaders
  utils/         formatting and storage helpers
  styles/        brand variables, global styles, one file per section
design/          original static design (reference)
```

See [COMPONENTS.md](COMPONENTS.md) for details on each component.

## Editing content

- **Menu:** edit `public/data/menu.json`. Each item has `id`, `name`, `price`,
  optional `image` (a file in `public/images/`), `description` and `pick`
  (`true` shows the HIYA PICK tag).
- **Events:** edit `public/data/events.json` (`id`, `title`, `type`, `date`,
  `time`, optional `end`, `duration`, `price` (0 = Free), optional `priceLabel`,
  `seats`, `taken`, `image`, optional `poster` and `includes`, `description`).
  The site always shows the closest upcoming event. See COMPONENTS.md for every
  field.
- **Address, hours, phone:** `src/components/Contact.jsx`.
