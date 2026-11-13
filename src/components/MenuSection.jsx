import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchMenu } from '../data/api';
import { useJsonData } from '../data/useJsonData';
import { useCart } from '../context/CartContext';
import { SearchIcon } from './Icons';
import MenuItemRow from './MenuItemRow';
import Reveal from './Reveal';
import Wave from './Wave';
import '../styles/menu.css';

const START_CATEGORY = 'Iced coffee';
const OUT_MS = 250; // fade/blur-out time before the new category renders

export default function MenuSection() {
  const { data: categories, error, loading } = useJsonData(fetchMenu);
  const { add, count, openCart } = useCart();

  const [active, setActive] = useState(START_CATEGORY); // highlighted pill
  const [shown, setShown] = useState(START_CATEGORY); // category on screen
  const [leaving, setLeaving] = useState(false);
  const [cycle, setCycle] = useState(0); // bumps to replay the enter animation
  const [query, setQuery] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const selectCategory = (name) => {
    const searching = query.trim() !== '';
    if (name === active && !searching) return;
    setActive(name);
    setLeaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setQuery('');
      setShown(name);
      setLeaving(false);
      setCycle((c) => c + 1);
    }, OUT_MS);
  };

  const q = query.trim().toLowerCase();
  const current = categories?.find((c) => c.name === shown) ?? categories?.[0];

  const results = useMemo(() => {
    if (!categories || !q) return null;
    return categories.flatMap((c) => c.items.filter((i) => i.name.toLowerCase().includes(q)));
  }, [categories, q]);

  const items = results ?? current?.items ?? [];

  return (
    <section className="menu-sec" id="menu" aria-labelledby="menu-title">
      <Wave position="top" />
      <div className="wrap">
        <Reveal className="m-head">
          <div>
            <small className="label on-dark">OUR MENU</small>
            <h2 className="m-title" id="menu-title">
              Pick your <em>pour</em>
              <span className="dot">.</span>
            </h2>
          </div>
          <p>From your first espresso to your last bite, it&apos;s all here.</p>
        </Reveal>

        <Reveal className="m-tools">
          <label className="search">
            <SearchIcon />
            <span className="visually-hidden">Search the menu</span>
            <input
              type="search"
              placeholder="Search the menu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="button" className="cart-pill" onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            Cart <span aria-hidden="true">{count}</span>
          </button>
        </Reveal>

        {loading && <p className="menu-status">Loading the menu…</p>}
        {error && <p className="menu-status" role="alert">Sorry, the menu could not be loaded. Please refresh the page.</p>}

        {categories && (
          <>
            <Reveal className="pills" role="group" aria-label="Menu categories">
              {categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`pill${c.name === active && !q ? ' on' : ''}`}
                  aria-pressed={c.name === active && !q}
                  onClick={() => selectCategory(c.name)}
                >
                  {c.name}
                  <sup>{c.items.length}</sup>
                </button>
              ))}
            </Reveal>

            <div className="content">
              <div key={results ? 'left-search' : `left-${cycle}`} className={leaving ? 'anim-out' : 'anim-in'} aria-live="polite">
                {results ? (
                  <>
                    <h3 className="cat-title">Search</h3>
                    <p className="cat-desc">
                      {results.length} {results.length === 1 ? 'item matches' : 'items match'} “{query.trim()}” across
                      the whole menu.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="cat-title">{current.name}</h3>
                    <p className="cat-desc">{current.description}</p>
                  </>
                )}
              </div>

              <div className="items" key={results ? 'items-search' : `items-${cycle}`}>
                {items.map((item, i) => (
                  <MenuItemRow key={item.id} item={item} index={i} leaving={leaving} onAdd={add} />
                ))}
                {results && results.length === 0 && (
                  <p className="menu-empty">Nothing matches that. Try “latte”, “matcha” or “brownie”.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Wave position="bottom" />
    </section>
  );
}
