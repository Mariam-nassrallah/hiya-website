import { useEffect } from 'react';

/**
 * Shared behaviour for our React-controlled Bootstrap modals:
 * close on Escape and stop the page behind from scrolling while open.
 */
export function useModalBehavior(show, onClose) {
  useEffect(() => {
    if (!show) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open'); // Bootstrap class: hides page scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [show, onClose]);
}
