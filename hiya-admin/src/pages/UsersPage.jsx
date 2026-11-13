import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getInitials } from '../utils/format';

const ROLES = ['Admin', 'Staff', 'Customer'];
const STATUSES = ['Active', 'Inactive'];

// Which columns the table shows
const columns = [
  {
    key: 'name',
    label: 'Name',
    render: (user) => (
      <div className="d-flex align-items-center gap-2">
        <span className="avatar avatar-sm" aria-hidden="true">{getInitials(user.name)}</span>
        <span className="fw-semibold">{user.name}</span>
      </div>
    ),
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', render: (user) => <StatusBadge status={user.status} /> },
  { key: 'joined', label: 'Joined', render: (user) => formatDate(user.joined) },
];

// Which fields the Edit form shows
const editFields = [
  { name: 'name', label: 'Full name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'role', label: 'Role', type: 'select', options: ROLES, half: true },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, half: true },
];

export default function UsersPage() {
  const { users, setUsers, showToast } = useOutletContext();

  function handleSave(updatedUser) {
    setUsers((list) => list.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    showToast(`${updatedUser.name} was updated.`);
  }

  function handleDelete(deletedUser) {
    setUsers((list) => list.filter((user) => user.id !== deletedUser.id));
    showToast(`${deletedUser.name} was deleted.`, 'danger');
  }

  const activeCount = users.filter((user) => user.status === 'Active').length;

  return (
    <>
      <p className="text-body-secondary mb-4">
        {users.length} users · {activeCount} active. Search by name, email or phone, or filter by role.
      </p>
      <DataTable
        columns={columns}
        rows={users}
        filter={{ key: 'role', label: 'Role', allLabel: 'All roles', options: ROLES }}
        editFields={editFields}
        itemName="user"
        getRowLabel={(user) => user.name}
        onSave={handleSave}
        onDelete={handleDelete}
        searchPlaceholder="Search users…"
      />
    </>
  );
}
