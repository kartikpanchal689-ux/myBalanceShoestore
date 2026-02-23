import React, { useState, useEffect } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, cancelled: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/orders`).then(r => r.json()),
      fetch(`${API}/admin/users`).then(r => r.json())
    ]).then(([ordersData, usersData]) => {
      if (ordersData.success) {
        const orders = ordersData.orders;
        const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0);
        const cancelled = orders.filter(o => o.status === 'Cancelled').length;
        setStats({ revenue, orders: orders.length, users: usersData.users?.length || 0, cancelled });
        setRecentOrders(orders.slice(0, 8));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your store</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card green">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{stats.revenue.toFixed(0)}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="admin-stat-card blue">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="admin-stat-card yellow">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.users}</div>
          <div className="stat-sub">Registered</div>
        </div>
        <div className="admin-stat-card red">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-sub">Orders</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header"><h3>Recent Orders</h3></div>
        {loading ? <div className="admin-loading">Loading...</div> : (
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={i}>
                  <td className="mono">{o.orderId}</td>
                  <td>{o.userEmail}</td>
                  <td>₹{(o.total || 0).toFixed(2)}</td>
                  <td><span className={`admin-badge ${(o.status || '').toLowerCase()}`}>{o.status || 'Processing'}</span></td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}