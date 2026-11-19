import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatMoney } from '../utils/format';

const CATEGORIES = ['Hot coffee', 'Iced coffee', 'Frappe', 'Matcha', 'Breakfast', 'Sweets'];
const LOW_STOCK = 10;

// hideBelow / card: see ResponsiveTable
const columns = [
  { key: 'name', label: 'Product', card: 'title', render: (product) => <span className="fw-semibold">{product.name}</span> },
  { key: 'category', label: 'Category', nowrap: true },
  { key: 'price', label: 'Price', nowrap: true, render: (product) => formatMoney(product.price) },
  {
    key: 'stock',
    label: 'Stock',
    nowrap: true,
    render: (product) =>
      product.stock > 0 && product.stock < LOW_STOCK ? (
        <span className="text-terra fw-semibold">{product.stock} · low</span>
      ) : (
        product.stock
      ),
  },
  { key: 'sold', label: 'Sold', hideBelow: 'xl' },
  { key: 'status', label: 'Status', card: 'badge', nowrap: true, render: (product) => <StatusBadge status={product.status} /> },
];

// Status is not in the form: it is worked out from the stock when saving
const editFields = [
  { name: 'name', label: 'Product name' },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORIES },
  { name: 'price', label: 'Price ($)', type: 'number', min: 0, step: 0.05, half: true },
  { name: 'stock', label: 'Stock', type: 'number', min: 0, step: 1, half: true },
];

export default function ProductsPage() {
  const { products, setProducts, showToast } = useOutletContext();

  function handleSave(updatedProduct) {
    const withStatus = {
      ...updatedProduct,
      status: updatedProduct.stock > 0 ? 'Available' : 'Out of stock',
    };
    setProducts((list) => list.map((product) => (product.id === withStatus.id ? withStatus : product)));
    showToast(`${withStatus.name} was updated.`);
  }

  function handleDelete(deletedProduct) {
    setProducts((list) => list.filter((product) => product.id !== deletedProduct.id));
    showToast(`${deletedProduct.name} was deleted.`, 'danger');
  }

  const outOfStock = products.filter((product) => product.stock === 0).length;

  return (
    <>
      <p className="text-body-secondary mb-4">
        {products.length} products · {outOfStock} out of stock. Setting stock to 0 marks a product as out of stock.
      </p>
      <DataTable
        columns={columns}
        rows={products}
        filter={{ key: 'category', label: 'Category', allLabel: 'All categories', options: CATEGORIES }}
        editFields={editFields}
        itemName="product"
        getRowLabel={(product) => product.name}
        onSave={handleSave}
        onDelete={handleDelete}
        searchPlaceholder="Search products…"
      />
    </>
  );
}
