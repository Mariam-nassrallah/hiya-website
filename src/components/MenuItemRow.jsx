import { useEffect, useRef, useState } from 'react';
import { money } from '../utils/format';

/**
 * One row of the menu list: name, HIYA PICK tag, dotted leader, price and a
 * round "+" add button.
 */
export default function MenuItemRow({ item, index, leaving, onAdd }) {
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className={`row-i ${leaving ? 'anim-out' : 'anim-in'}`} style={{ animationDelay: leaving ? '0ms' : `${index * 50}ms` }}>
      <span className="name" title={item.description}>
        {item.name}
      </span>
      {item.pick && <span className="pick">HIYA PICK</span>}
      <span className="dots" aria-hidden="true" />
      <span className="price">{money(item.price)}</span>
      <button
        type="button"
        className={`add${added ? ' added' : ''}`}
        onClick={handleAdd}
        aria-label={`Add ${item.name} to cart, ${money(item.price)}`}
      >
        <span aria-hidden="true">{added ? '✓' : '+'}</span>
      </button>
    </div>
  );
}
