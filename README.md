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

The **admin dashboard** is a separate React app in [`hiya-admin/`](hiya-admin/).
Both apps are served from **one site**:

| URL | App |
| --- | --- |
| `/` | Customer website (this folder) |
| `/admin/...` | Admin dashboard (`hiya-admin/`), e.g. `/admin/login` |

The person icon in the navbar ("Admin login") links to `/admin/login`. It works
the same locally and on Render, with no environment variables to set.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm run install:all   # installs packages for the website AND hiya-admin
npm run dev           # starts both apps together
```

Then open **http://localhost:5173**. Click the person icon, or go straight to
**http://localhost:5173/admin/login**. The demo admin account is
`admin@hiya.com` / `hiya123`.

How it works locally:
- `npm run dev` uses `concurrently` to start two Vite servers in one terminal:
  - **site** on port 5173
  - **admin** on port 5174
- The website's Vite server has a **proxy** in `vite.config.js` that forwards
  every `/admin` request to port 5174, including the live-reload connection. So
  you only ever open port 5173.
- Both ports are fixed (`strictPort`). If one is already in use, for example by
  an old dev server that's still running, Vite stops with an error. Close the
  other terminal and run `npm run dev` again.
- To stop both, press **Ctrl + C**.

| Script | What it does |
| --- | --- |
| `npm run install:all` | `npm install` in the root and in `hiya-admin/` |
| `npm run dev` | Website + admin dev servers together (open :5173) |
| `npm run dev:site` / `npm run dev:admin` | Start only one of them |
| `npm run build` | Build the website, build the admin, copy `hiya-admin/dist` into `dist/admin` |
| `npm run preview` | Preview the website build |

## Deploy on Render

The repository includes a [`render.yaml`](render.yaml) Blueprint that publishes
both apps as **one Static Site**:

```yaml
buildCommand: npm run install:all && npm run build
staticPublishPath: dist
routes:                      # rewrites, checked in order
  /admin/*  -> /admin/index.html
  /*        -> /index.html
```

What happens on each deploy:
1. `npm run install:all` installs the packages of both apps.
2. `npm run build` does three things:
   - builds the website into `dist/`
   - builds the admin into `hiya-admin/dist/` (its Vite `base` is `/admin/`, so
     all its files expect to live under `/admin`)
   - runs `scripts/copy-admin.mjs`, which copies the admin into `dist/admin/`
3. Render publishes `dist/`. Real files (JS, CSS, images, JSON) are served
   directly.
4. Any other address is rewritten:
   - `/admin/...` pages load the admin app, whose React Router
     (`basename="/admin"`) shows the right page
   - everything else loads the website

So a refresh on a deep link such as `/admin/orders` still works.

**First deploy:**
1. Push this folder to GitHub (including `render.yaml`, `hiya-admin/` and
   `scripts/`; `node_modules` and `dist` are git-ignored).
2. On Render, choose **New → Blueprint** and pick the repository. Render reads
   `render.yaml` and creates the static site `hiya-coffee`.
3. Every push to the main branch redeploys automatically.

The original static design in `design/` is not part of the build: only `src/`,
`public/` and the admin build end up in `dist/`.

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
hiya-admin/      admin dashboard (separate Vite app, served at /admin)
scripts/         copy-admin.mjs (puts the admin build into dist/admin)
render.yaml      Render static site settings
design/          original static design (reference, not deployed)
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
