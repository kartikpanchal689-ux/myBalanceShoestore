import React, { useState, useEffect } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders`);
      const data = await res.json();
      if (data.success) { setOrders(data.orders); setFiltered(data.orders); }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filter = (q) => {
    setFiltered(orders.filter(o =>
      o.orderId?.toLowerCase().includes(q.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(q.toLowerCase())
    ));
  };

  const updateStatus = async (orderId, status) => {
    const endpoint = status === 'Cancelled'
      ? `${API}/cancel-order/${orderId}`
      : `${API}/admin/order-status/${orderId}`;
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <p>Manage all customer orders</p>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Orders ({filtered.length})</h3>
          <input className="admin-search" placeholder="Search by order ID or email..." onChange={e => filter(e.target.value)} />
        </div>
        {loading ? <div className="admin-loading">Loading...</div> : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={i}>
                    <td className="mono small">{o.orderId}</td>
                    <td className="small">{o.userEmail}</td>
                    <td>{(o.items || []).length} items</td>
                    <td>₹{(o.total || 0).toFixed(2)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{o.paymentMethod}</td>
                    <td><span className={`admin-badge ${(o.status || '').toLowerCase()}`}>{o.status || 'Processing'}</span></td>
                    <td className="small">{o.date}</td>
                    <td>
                      {o.status !== 'Delivered' && (
                        <button className="admin-btn success" onClick={() => updateStatus(o.orderId, 'Delivered')}>Deliver</button>
                      )}
                      {o.status !== 'Cancelled' && (
                        <button className="admin-btn danger" onClick={() => updateStatus(o.orderId, 'Cancelled')}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}