// Bootstrap pagination: Prev, page numbers, Next.
// Below 576px only the current page number is shown, so it fits on one line.
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // [1, 2, 3, ...] for every page
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Table pages">
      <ul className="pagination pagination-sm mb-0 flex-wrap">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
        </li>

        {/* On small phones only the current page number is shown (Prev 3 Next) */}
        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : 'd-none d-sm-block'}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
