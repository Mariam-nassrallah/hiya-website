// One summary number on the dashboard, e.g. "Total Users: 40".
// tone decides the trend colour: 'up' (olive), 'down' (terracotta) or 'neutral'.
export default function StatCard({ icon, label, value, trend, tone = 'neutral', color = 'olive' }) {
  const trendClass = tone === 'up' ? 'text-olive' : tone === 'down' ? 'text-terra' : 'text-body-secondary';
  const trendIcon = tone === 'up' ? 'bi-arrow-up-right' : tone === 'down' ? 'bi-arrow-down-right' : 'bi-dot';

  return (
    <div className="card card-lift h-100">
      {/* Phones show 2 cards per row, so the icon sits above the text there */}
      <div className="card-body d-flex flex-column flex-sm-row align-items-start gap-2 gap-sm-3 p-3 p-sm-4">
        <div className={`stat-icon icon-${color}`} aria-hidden="true">
          <i className={`bi ${icon}`} />
        </div>
        <div className="min-w-0">
          <p className="text-body-secondary small fw-semibold mb-1">{label}</p>
          <p className="stat-value mb-1">{value}</p>
          <p className={`small mb-0 ${trendClass}`}>
            <i className={`bi ${trendIcon} me-1`} aria-hidden="true" />
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
