// A controlled search input: the parent owns the value.
export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-transparent border-end-0" aria-hidden="true">
        <i className="bi bi-search" />
      </span>
      <input
        type="search"
        className="form-control border-start-0 ps-0"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
