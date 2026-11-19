import { Bar, Doughnut } from 'react-chartjs-2';
import { Link, useOutletContext } from 'react-router-dom';
import '../utils/chartSetup';
import ChartCard from '../components/ChartCard';
import ResponsiveTable from '../components/ResponsiveTable';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { BRAND } from '../utils/brand';
import { formatDate, formatMoney } from '../utils/format';
import {
  ORDER_STATUSES,
  getLastMonths,
  getMonthlyTotals,
  getPercentChange,
  getReferenceDate,
  getRevenue,
  getStatusCounts,
  trendText,
} from '../utils/stats';

// Doughnut colours match the StatusBadge colours
const STATUS_COLORS = {
  Pending: BRAND.terra,
  Preparing: BRAND.sage,
  Completed: BRAND.olive,
  Cancelled: BRAND.espresso,
};

// Columns of the "Recent orders" table (see ResponsiveTable)
const RECENT_COLUMNS = [
  { key: 'id', label: 'Order', card: 'title', nowrap: true, render: (order) => <span className="fw-semibold">{order.id}</span> },
  { key: 'customer', label: 'Customer' },
  { key: 'total', label: 'Total', nowrap: true, render: (order) => formatMoney(order.total) },
  { key: 'status', label: 'Status', card: 'badge', nowrap: true, render: (order) => <StatusBadge status={order.status} /> },
];

/** 'up' / 'down' / 'neutral' for a StatCard, from a percentage change */
function toneFor(change) {
  if (change === null || change === 0) return 'neutral';
  return change > 0 ? 'up' : 'down';
}

export default function Dashboard() {
  const { users, products, orders } = useOutletContext();

  // ---- derived numbers (recalculated whenever the data changes) ----
  const referenceDate = getReferenceDate(orders);
  const monthly = getMonthlyTotals(orders, getLastMonths(referenceDate, 6));
  const thisMonth = monthly[monthly.length - 1];
  const lastMonth = monthly[monthly.length - 2];

  const totalRevenue = getRevenue(orders);
  const ordersChange = getPercentChange(thisMonth.orders, lastMonth.orders);
  const revenueChange = getPercentChange(thisMonth.revenue, lastMonth.revenue);

  const sixtyDaysAgo = new Date(referenceDate);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const newUsers = users.filter((user) => new Date(user.joined) >= sixtyDaysAgo).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;

  const statusCounts = getStatusCounts(orders);
  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const bestSold = topProducts[0]?.sold || 1;

  // ---- chart data ----
  const monthlyChart = {
    labels: monthly.map((month) => month.label),
    datasets: [
      {
        type: 'bar',
        label: 'Orders',
        data: monthly.map((month) => month.orders),
        backgroundColor: BRAND.olive,
        borderRadius: 8,
        maxBarThickness: 36,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Revenue ($)',
        data: monthly.map((month) => Math.round(month.revenue)),
        borderColor: BRAND.terra,
        backgroundColor: BRAND.terra,
        tension: 0.35,
        pointRadius: 4,
        yAxisID: 'y1',
      },
    ],
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(56, 37, 29, 0.07)' }, title: { display: true, text: 'Orders' } },
      y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: (value) => `$${value}` } },
    },
  };

  const statusChart = {
    labels: ORDER_STATUSES,
    datasets: [
      {
        data: ORDER_STATUSES.map((status) => statusCounts[status]),
        backgroundColor: ORDER_STATUSES.map((status) => STATUS_COLORS[status]),
        borderColor: BRAND.cream,
        borderWidth: 3,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <>
      <p className="text-body-secondary mb-4">
        Overview up to {formatDate(referenceDate)} (date of the newest order).
      </p>

      {/* Stat cards: 2 per row on phones and tablets, 4 on desktop */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-people" color="olive" label="Total Users" value={users.length} trend={`${newUsers} new in the last 60 days`} tone={newUsers > 0 ? 'up' : 'neutral'} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-cup-hot"
            color="sage"
            label="Total Products"
            value={products.length}
            trend={`${outOfStock} out of stock`}
            tone={outOfStock > 0 ? 'down' : 'neutral'}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-receipt"
            color="terra"
            label="Total Orders"
            value={orders.length}
            trend={`${trendText(ordersChange, lastMonth.label)} (${thisMonth.label} so far)`}
            tone={toneFor(ordersChange)}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-cash-stack"
            color="espresso"
            label="Total Revenue"
            value={formatMoney(totalRevenue)}
            trend={`${trendText(revenueChange, lastMonth.label)} (${thisMonth.label} so far)`}
            tone={toneFor(revenueChange)}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12 col-xl-8">
          <ChartCard title="Orders & revenue" subtitle="Last 6 months · revenue from completed orders" height={300}>
            <Bar data={monthlyChart} options={monthlyOptions} aria-label="Bar chart of orders and line of revenue per month" role="img" />
          </ChartCard>
        </div>
        <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
          <ChartCard title="Orders by status" subtitle={`${orders.length} orders in total`} height={300}>
            <Doughnut data={statusChart} options={statusOptions} aria-label="Doughnut chart of orders by status" role="img" />
          </ChartCard>
        </div>
      </div>

      {/* Recent orders + top products */}
      <div className="row g-3 g-lg-4">
        <div className="col-12 col-xl-7">
          <div className="card h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 card-title mb-0">Recent orders</h2>
                <Link to="/orders" className="small fw-semibold text-decoration-none">View all</Link>
              </div>
              {/* Table on tablet/desktop, cards on phones */}
              <ResponsiveTable columns={RECENT_COLUMNS} rows={recentOrders} caption="Recent orders" />
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 card-title mb-0">Top products</h2>
                <Link to="/products" className="small fw-semibold text-decoration-none">View all</Link>
              </div>
              <ul className="list-group list-group-flush">
                {topProducts.map((product, index) => (
                  <li key={product.id} className="list-group-item px-0 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <span className="rank" aria-hidden="true">{index + 1}</span>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between gap-2">
                          <span className="fw-semibold text-truncate">{product.name}</span>
                          <span className="small text-body-secondary text-nowrap">{product.sold} sold</span>
                        </div>
                        <div className="small text-body-secondary mb-2">{product.category}</div>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label={`${product.name} sales`}
                          aria-valuenow={product.sold}
                          aria-valuemin={0}
                          aria-valuemax={bestSold}
                        >
                          <div className="progress-bar" style={{ width: `${(product.sold / bestSold) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
