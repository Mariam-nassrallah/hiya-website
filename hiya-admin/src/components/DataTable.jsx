import { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import EditModal from './EditModal';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

const ROWS_PER_PAGE = 8;

/**
 * One reusable table for Users, Products and Orders.
 *
 * The page owns the data (rows) and says how to save or delete a row.
 * The table owns the UI state: search text, filter, current page and
 * which row is being edited or deleted.
 */
export default function DataTable({
  columns, // [{ key, label, render?(row) }]
  rows, // the data to show
  filter, // optional { key, label, allLabel, options: [...] }
  editFields, // fields for the EditModal
  itemName, // e.g. "user", used in titles and messages
  getRowLabel, // row => text used in the delete message
  onSave, // updatedRow => void
  onDelete, // row => void
  searchPlaceholder = 'Search…',
}) {
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [page, setPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);

  // ---- derived data: search -> filter -> paginate ----
  const searchText = search.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const matchesFilter = !filter || filterValue === 'All' || row[filter.key] === filterValue;
    const matchesSearch =
      searchText === '' || columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(searchText));
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages); // stay valid after deleting rows
  const firstIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const pageRows = filteredRows.slice(firstIndex, firstIndex + ROWS_PER_PAGE);
  const showingFrom = filteredRows.length === 0 ? 0 : firstIndex + 1;
  const showingTo = firstIndex + pageRows.length;

  // ---- handlers ----
  function handleSearchChange(value) {
    setSearch(value);
    setPage(1); // a new search starts on page 1
  }

  function handleFilterChange(value) {
    setFilterValue(value);
    setPage(1);
  }

  function handleSave(updatedRow) {
    onSave(updatedRow);
    setEditingRow(null);
  }

  function handleConfirmDelete() {
    onDelete(deletingRow);
    setDeletingRow(null);
  }

  return (
    <div className="card">
      <div className="card-body p-3 p-md-4">
        {/* Toolbar: search + optional filter */}
        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-md-6 col-lg-5">
            <SearchBar value={search} onChange={handleSearchChange} placeholder={searchPlaceholder} />
          </div>
          {filter && (
            <div className="col-12 col-md-4 col-lg-3">
              <select
                className="form-select"
                value={filterValue}
                onChange={(event) => handleFilterChange(event.target.value)}
                aria-label={`Filter by ${filter.label}`}
              >
                <option value="All">{filter.allLabel}</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table or empty state */}
        {pageRows.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="bi bi-search d-block mb-2" aria-hidden="true" />
            <p className="fw-semibold mb-1">No {itemName}s found</p>
            <p className="text-body-secondary small mb-0">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col">{column.label}</th>
                  ))}
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                      <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                    ))}
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-icon"
                          onClick={() => setEditingRow(row)}
                          aria-label={`Edit ${getRowLabel(row)}`}
                          title="Edit"
                        >
                          <i className="bi bi-pencil" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-icon"
                          onClick={() => setDeletingRow(row)}
                          aria-label={`Delete ${getRowLabel(row)}`}
                          title="Delete"
                        >
                          <i className="bi bi-trash3" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer: count + pagination */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mt-3">
          <p className="text-body-secondary small mb-0">
            Showing {showingFrom}–{showingTo} of {filteredRows.length}
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <EditModal
        show={editingRow !== null}
        title={`Edit ${itemName}`}
        fields={editFields}
        item={editingRow}
        onSave={handleSave}
        onClose={() => setEditingRow(null)}
      />

      <ConfirmModal
        show={deletingRow !== null}
        title={`Delete ${itemName}?`}
        message={deletingRow ? `"${getRowLabel(deletingRow)}" will be removed. This can't be undone.` : ''}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingRow(null)}
      />
    </div>
  );
}
