// A centred Bootstrap spinner with a short message.
export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5 gap-3" role="status">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} aria-hidden="true" />
      <span className="text-body-secondary">{text}</span>
    </div>
  );
}
