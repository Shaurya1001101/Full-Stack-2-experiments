import { useState } from 'react';
import RoleBadge from '../components/RoleBadge';

const INITIAL_USERS = [
  { id: 'u-1', name: 'Amara Singh', username: 'admin', role: 'Admin', status: 'Active' },
  { id: 'u-2', name: 'Devon Cole', username: 'editor', role: 'Editor', status: 'Active' },
  { id: 'u-3', name: 'Priya Nair', username: 'viewer', role: 'Viewer', status: 'Active' },
];

export default function AdminPanel() {
  const [users, setUsers] = useState(INITIAL_USERS);

  function toggleStatus(id) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u)),
    );
  }

  function changeRole(id, role) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Experiment 2 — Admin clearance</p>
        <h1 className="page__title">Admin Panel</h1>
        <p className="page__lede">
          Only accounts with the Admin role can reach this route. Changes here live in local
          state and reset on reload.
        </p>
      </header>

      <section className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>
                  <code>{u.username}</code>
                </td>
                <td>
                  <select
                    className="field__input field__input--compact"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td>
                  <RoleBadge role={u.role} showLevel={false} />
                  <span className={`status-pill status-pill--${u.status.toLowerCase()}`}>{u.status}</span>
                </td>
                <td>
                  <button type="button" className="btn btn--ghost btn--small" onClick={() => toggleStatus(u.id)}>
                    {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
