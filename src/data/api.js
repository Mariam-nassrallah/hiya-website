// Loads the site data from the static JSON files in public/data/.
const BASE = import.meta.env.BASE_URL;

async function getJson(file, signal) {
  const res = await fetch(`${BASE}data/${file}`, { signal });
  if (!res.ok) throw new Error(`Could not load ${file} (HTTP ${res.status})`);
  return res.json();
}

/** Resolves to the menu categories: [{ name, description, items: [...] }] */
export const fetchMenu = (signal) => getJson('menu.json', signal).then((d) => d.categories);

/** Resolves to the list of events. */
export const fetchEvents = (signal) => getJson('events.json', signal);
