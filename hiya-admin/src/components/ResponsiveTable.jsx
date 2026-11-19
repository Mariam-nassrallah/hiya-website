// Bootstrap class that hides a column below a breakpoint.
// The sidebar takes 260px from 992px up, so between 992 and 1199px a table has
// LESS room than on a 768px tablet: that is why columns hide below xl/xxl, not lg.
const HIDE_BELOW = {
  xl: 'd-none d-xl-table-cell', // hidden below 1200px
  xxl: 'd-none d-xxl-table-cell', // hidden below 1400px
};

/**
 * A table that never scrolls sideways:
 * - 768px and wider: a normal Bootstrap table; less important columns hide on
 *   smaller screens (column.hideBelow).
 * - below 768px: every row becomes a stacked card with its title, a status
 *   badge, "Label: value" lines and full-width action buttons.
 *
 * columns: [{ key, label, render?(row), hideBelow?: 'xl' | 'xxl',
 *             nowrap?: boolean, className?: string, card?: 'title' | 'badge' }]
 * actions: optional row => [{ label, icon, variant, onClick }]
 */
export default function ResponsiveTable({ columns, rows, actions, getRowLabel = () => '', caption }) {
  const titleColumn = columns.find((column) => column.card === 'title') || columns[0];
  const badgeColumn = columns.find((column) => column.card === 'badge');
  const fieldColumns = columns.filter((column) => column !== titleColumn && column !== badgeColumn);

  const cellValue = (column, row) => (column.render ? column.render(row) : row[column.key]);

  return (
    <>
      {/* Tablet and desktop: table */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover align-middle mb-0">
          {caption && <caption className="visually-hidden">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={HIDE_BELOW[column.hideBelow] || undefined}>
                  {column.label}
                </th>
              ))}
              {actions && <th scope="col" className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[HIDE_BELOW[column.hideBelow], column.nowrap && 'text-nowrap', column.className].filter(Boolean).join(' ') || undefined}
                  >
                    {cellValue(column, row)}
                  </td>
                ))}
                {actions && (
                  <td className="text-end text-nowrap">
                    <div className="d-inline-flex gap-2">
                      {actions(row).map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          className={`btn btn-outline-${action.variant} btn-icon`}
                          onClick={action.onClick}
                          aria-label={`${action.label} ${getRowLabel(row)}`}
                          title={action.label}
                        >
                          <i className={`bi ${action.icon}`} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: one card per row */}
      <ul className="rt-cards list-unstyled mb-0 d-md-none" aria-label={caption}>
        {rows.map((row) => (
          <li key={row.id} className="rt-card">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div className="rt-title text-break">{cellValue(titleColumn, row)}</div>
              {badgeColumn && <div className="flex-shrink-0">{cellValue(badgeColumn, row)}</div>}
            </div>

            <dl className="rt-fields">
              {fieldColumns.map((column) => (
                <div key={column.key} className="rt-field">
                  <dt>{column.label}</dt>
                  <dd className="text-break">{cellValue(column, row)}</dd>
                </div>
              ))}
            </dl>

            {actions && (
              <div className="d-flex gap-2 mt-3">
                {actions(row).map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={`btn btn-outline-${action.variant} btn-sm flex-fill`}
                    onClick={action.onClick}
                    aria-label={`${action.label} ${getRowLabel(row)}`}
                  >
                    <i className={`bi ${action.icon} me-2`} aria-hidden="true" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
