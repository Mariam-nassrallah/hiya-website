import { useEffect, useState } from 'react';
import { useModalBehavior } from '../hooks/useModalBehavior';

/** Returns an error message for one field, or '' when the value is fine. */
function validateField(field, value) {
  const text = String(value ?? '').trim();
  if (field.required !== false && text === '') return `${field.label} is required.`;
  if (field.type === 'email' && text && !/^\S+@\S+\.\S+$/.test(text)) return 'Enter a valid email.';
  if (field.type === 'number' && text !== '') {
    if (Number.isNaN(Number(text))) return `${field.label} must be a number.`;
    if (field.min !== undefined && Number(text) < field.min) return `${field.label} must be at least ${field.min}.`;
  }
  return '';
}

/**
 * A modal with a form built from a list of fields.
 * fields: [{ name, label, type: 'text' | 'email' | 'number' | 'select', options, min, step }]
 * item:   the row being edited (used to pre-fill the form)
 */
export default function EditModal({ show, title, fields, item, onSave, onClose }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useModalBehavior(show, onClose);

  // Each time a new row is opened, copy its values into the form.
  useEffect(() => {
    if (item) {
      setValues({ ...item });
      setErrors({});
    }
  }, [item]);

  if (!show || !item) return null;

  function handleChange(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' })); // hide the old error while typing
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validate every field
    const newErrors = {};
    fields.forEach((field) => {
      const message = validateField(field, values[field.name]);
      if (message) newErrors[field.name] = message;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Number fields go back as numbers, text is trimmed
    const cleaned = { ...values };
    fields.forEach((field) => {
      const value = values[field.name];
      cleaned[field.name] = field.type === 'number' ? Number(value) : String(value).trim();
    });
    onSave(cleaned);
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <form className="modal-content" onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="edit-title">{title}</h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {fields.map((field, index) => {
                  const id = `edit-${field.name}`;
                  const error = errors[field.name];
                  const common = {
                    id,
                    className: `${field.type === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`,
                    value: values[field.name] ?? '',
                    onChange: (event) => handleChange(field.name, event.target.value),
                    autoFocus: index === 0,
                    'aria-invalid': Boolean(error),
                    'aria-describedby': error ? `${id}-error` : undefined,
                  };

                  return (
                    <div key={field.name} className={field.half ? 'col-12 col-sm-6' : 'col-12'}>
                      <label htmlFor={id} className="form-label">{field.label}</label>
                      {field.type === 'select' ? (
                        <select {...common}>
                          {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input {...common} type={field.type || 'text'} min={field.min} step={field.step} />
                      )}
                      {error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check2 me-1" aria-hidden="true" />
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
