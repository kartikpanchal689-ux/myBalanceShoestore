import React, { useState, useEffect } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/users`);
      const data = await res.json();
      if (data.success) { setUsers(data.users); setFiltered(data.users); }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filter = (q) => {
    setFiltered(users.filter(u =>
      u.email?.toLowerCase().includes(q.toLowerCase()) ||
      u.name?.toLowerCase().includes(q.toLowerCase())
    ));
  };

  const deleteUser = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;
    const res = await fetch(`${API}/admin/user/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Users</h1>
        <p>Manage registered users</p>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Users ({filtered.length})</h3>
          <input className="admin-search" placeholder="Search by email or name..." onChange={e => filter(e.target.value)} />
        </div>
        {loading ? <div className="admin-loading">Loading...</div> : (
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Name</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i}>
                  <td>{u.email}</td>
                  <td>{u.name || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td><span className={`admin-badge ${u.role || 'customer'}`}>{u.role || 'customer'}</span></td>
                  <td>
                    {u.role !== 'admin'
                      ? <button className="admin-btn danger" onClick={() => deleteUser(u._id, u.email)}>Delete</button>
                      : <span className="protected">Protected</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}