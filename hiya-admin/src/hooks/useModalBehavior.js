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

    // Measure the scrollbar before it is hidden: its width is kept as padding
    // (--scrollbar-w in theme.css), so the page and the fixed top bar don't jump.
    const root = document.documentElement;
    root.style.setProperty('--scrollbar-w', `${window.innerWidth - root.clientWidth}px`);

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open'); // theme.css locks the page while this class is set

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      root.style.removeProperty('--scrollbar-w');
    };
  }, [show, onClose]);
}
