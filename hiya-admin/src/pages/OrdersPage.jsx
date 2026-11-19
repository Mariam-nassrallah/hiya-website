import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime, formatMoney } from '../utils/format';
import { ORDER_STATUSES } from '../utils/stats';

const PAYMENTS = ['Cash', 'Card'];

// hideBelow / card: see ResponsiveTable
const columns = [
  { key: 'id', label: 'Order', card: 'title', nowrap: true, render: (order) => <span className="fw-semibold">{order.id}</span> },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Items', hideBelow: 'xxl' },
  { key: 'total', label: 'Total', nowrap: true, render: (order) => formatMoney(order.total) },
  {
    key: 'payment',
    label: 'Payment',
    hideBelow: 'xxl',
    nowrap: true,
    render: (order) => (
      <>
        <i className={`bi ${order.payment === 'Card' ? 'bi-credit-card' : 'bi-cash-coin'} me-2 text-body-secondary`} aria-hidden="true" />
        {order.payment}
      </>
    ),
  },
  { key: 'status', label: 'Status', card: 'badge', nowrap: true, render: (order) => <StatusBadge status={order.status} /> },
  { key: 'date', label: 'Date', nowrap: true, render: (order) => formatDateTime(order.date) },
];

const editFields = [
  { name: 'customer', label: 'Customer name' },
  { name: 'items', label: 'Items', type: 'number', min: 1, step: 1, half: true },
  { name: 'total', label: 'Total ($)', type: 'number', min: 0, step: 0.25, half: true },
  { name: 'payment', label: 'Payment', type: 'select', options: PAYMENTS, half: true },
  { name: 'status', label: 'Status', type: 'select', options: ORDER_STATUSES, half: true },
];

export default function OrdersPage() {
  const { orders, setOrders, showToast } = useOutletContext();

  // Newest orders first (a sorted copy; the original array is not changed)
  const sortedOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date));
  const openCount = orders.filter((order) => order.status === 'Pending' || order.status === 'Preparing').length;

  function handleSave(updatedOrder) {
    setOrders((list) => list.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
    showToast(`Order ${updatedOrder.id} was updated.`);
  }

  function handleDelete(deletedOrder) {
    setOrders((list) => list.filter((order) => order.id !== deletedOrder.id));
    showToast(`Order ${deletedOrder.id} was deleted.`, 'danger');
  }

  return (
    <>
      <p className="text-body-secondary mb-4">
        {orders.length} orders · {openCount} still open (pending or preparing). Newest first.
      </p>
      <DataTable
        columns={columns}
        rows={sortedOrders}
        filter={{ key: 'status', label: 'Status', allLabel: 'All statuses', options: ORDER_STATUSES }}
        editFields={editFields}
        itemName="order"
        getRowLabel={(order) => `Order ${order.id}`}
        onSave={handleSave}
        onDelete={handleDelete}
        searchPlaceholder="Search orders…"
      />
    </>
  );
}
