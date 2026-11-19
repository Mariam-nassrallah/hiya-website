import { useEffect, useRef, useState } from 'react';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import Toast from 'bootstrap/js/dist/toast';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import { ArrowIcon, CheckIcon, TrashIcon } from './Icons';
import '../styles/cart.css';

/**
 * Slide-in cart (Bootstrap offcanvas) driven by CartContext.isOpen,
 * plus the thank-you toast shown after checkout.
 */
export default function CartDrawer() {
  const { items, count, total, inc, dec, remove, clear, isOpen, closeCart } = useCart();
  const panelRef = useRef(null);
  const toastRef = useRef(null);
  const offcanvas = useRef(null);
  const [thanks, setThanks] = useState('');

  // Create the Bootstrap instance once; sync "closed" back into React state.
  // While open, the page behind is locked (see utils/scrollLock.js).
  useEffect(() => {
    const el = panelRef.current;
    let locked = false;
    offcanvas.current = Offcanvas.getOrCreateInstance(el, { scroll: true }); // we lock scrolling ourselves
    const onShow = () => {
      if (!locked) lockScroll();
      locked = true;
    };
    const onHidden = () => {
      if (locked) unlockScroll();
      locked = false;
      closeCart();
    };
    el.addEventListener('show.bs.offcanvas', onShow);
    el.addEventListener('hidden.bs.offcanvas', onHidden);
    return () => {
      el.removeEventListener('show.bs.offcanvas', onShow);
      el.removeEventListener('hidden.bs.offcanvas', onHidden);
      if (locked) unlockScroll();
      offcanvas.current?.dispose();
      offcanvas.current = null;
    };
  }, [closeCart]);

  useEffect(() => {
    const oc = offcanvas.current;
    if (!oc) return;
    if (isOpen) oc.show();
    else oc.hide();
  }, [isOpen]);

  useEffect(() => {
    const el = toastRef.current;
    return () => Toast.getInstance(el)?.dispose();
  }, []);

  const checkout = () => {
    if (!items.length) return;
    setThanks(`Thank you! Your order of ${count} ${count === 1 ? 'item' : 'items'} (${money(total)}) is being prepared.`);
    clear();
    closeCart();
    Toast.getOrCreateInstance(toastRef.current, { delay: 4500 }).show();
  };

  return (
    <>
      <div className="offcanvas offcanvas-end cart-drawer" tabIndex="-1" id="cartDrawer" aria-labelledby="cartTitle" ref={panelRef}>
        <div className="cart-head">
          <div>
            <small className="label on-dark">YOUR ORDER</small>
            <h3 id="cartTitle">Cart {count > 0 && <span>({count})</span>}</h3>
          </div>
          <button type="button" className="x" aria-label="Close cart" onClick={closeCart}>
            ×
          </button>
        </div>

        <div className="offcanvas-body cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <a href="#menu" className="hy-btn btn-terra" onClick={closeCart}>
                BROWSE THE MENU <ArrowIcon />
              </a>
            </div>
          ) : (
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.id} className="cart-item">
                  <div className="ci-main">
                    <div className="ci-top">
                      <span className="ci-name">{i.name}</span>
                      <span className="ci-price">{money(i.price * i.qty)}</span>
                    </div>
                    <div className="ci-bottom">
                      <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
                        <button type="button" onClick={() => dec(i.id)} disabled={i.qty <= 1} aria-label={`Remove one ${i.name}`}>
                          −
                        </button>
                        <span aria-live="polite">{i.qty}</span>
                        <button type="button" onClick={() => inc(i.id)} aria-label={`Add one more ${i.name}`}>
                          +
                        </button>
                      </div>
                      <button type="button" className="ci-remove" onClick={() => remove(i.id)} aria-label={`Remove ${i.name} from cart`}>
                        <TrashIcon /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-foot">
            <div className="total">
              <span>Total</span>
              <b>{money(total)}</b>
            </div>
            <button type="button" className="hy-btn btn-terra" onClick={checkout}>
              Checkout <ArrowIcon />
            </button>
          </div>
        )}
      </div>

      <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3 hiya-toasts">
        <div ref={toastRef} className="toast hiya-toast" role="status" aria-live="polite" aria-atomic="true">
          <div className="toast-body">
            <span className="tick-sm" aria-hidden="true">
              <CheckIcon size={16} />
            </span>
            <span>{thanks}</span>
            <button type="button" className="x small" aria-label="Close message" onClick={() => Toast.getInstance(toastRef.current)?.hide()}>
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
