import { useEffect } from 'react';

const ICONS = { success: 'bi-check-circle-fill', danger: 'bi-trash3-fill', info: 'bi-info-circle-fill' };

/**
 * A Bootstrap toast in the bottom-right corner.
 * toast = { id, message, variant } or null. It hides itself after 3 seconds.
 */
export default function ToastMessage({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer); // a new toast restarts the timer
  }, [toast, onClose]);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite" aria-atomic="true">
      {toast && (
        <div key={toast.id} className={`toast show toast-${toast.variant}`} role="status">
          <div className="d-flex align-items-center">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className={`bi ${ICONS[toast.variant] || ICONS.info}`} aria-hidden="true" />
              {toast.message}
            </div>
            <button type="button" className="btn btn-sm text-reset me-2 ms-auto" onClick={onClose} aria-label="Close">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
