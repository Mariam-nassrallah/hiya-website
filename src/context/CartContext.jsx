import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readStore, writeStore } from '../utils/format';

const CartContext = createContext(null);
const KEY = 'hiyaCart';

function loadCart() {
  const saved = readStore(KEY, []);
  return Array.isArray(saved) ? saved.filter((i) => i && i.id && i.qty > 0) : [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => writeStore(KEY, items), [items]);

  const add = useCallback((product) => {
    setItems((list) => {
      if (list.some((i) => i.id === product.id)) {
        return list.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      const { id, name, price } = product;
      return [...list, { id, name, price, qty: 1 }];
    });
  }, []);

  const inc = useCallback(
    (id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))),
    [],
  );
  const dec = useCallback(
    (id) => setItems((list) => list.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))),
    [],
  );
  const remove = useCallback((id) => setItems((list) => list.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { items, count, total, add, inc, dec, remove, clear, isOpen, openCart, closeCart };
  }, [items, isOpen, add, inc, dec, remove, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
