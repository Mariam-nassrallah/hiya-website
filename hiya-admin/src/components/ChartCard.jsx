// A card with a title that holds a chart. The chart fills a box of the
// given height and resizes with the card (Chart.js responsive mode).
export default function ChartCard({ title, subtitle, height = 300, children }) {
  return (
    <div className="card h-100">
      <div className="card-body p-4">
        <h2 className="h6 card-title mb-1">{title}</h2>
        {subtitle && <p className="text-body-secondary small mb-3">{subtitle}</p>}
        <div className="chart-box" style={{ height }}>
          {children}
        </div>
      </div>
    </div>
  );
}
