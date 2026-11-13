/** Curved edge between the olive menu section and the page background. */
export default function Wave({ position = 'bottom' }) {
  return (
    <div className={`wave${position === 'top' ? ' top' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" focusable="false">
        <path d="M0 40C220 95 420 0 720 30s520 60 720 0v60H0z" />
      </svg>
    </div>
  );
}
