import React, { useState, useEffect } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/returns`);
      const data = await res.json();
      if (data.success) setReturns(data.returns);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`${API}/admin/return-status/${id}`, {
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
        <h1>Return Requests</h1>
        <p>Manage product return requests from customers</p>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Returns ({returns.length})</h3>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : returns.length === 0 ? (
          <div className="admin-loading">No return requests yet</div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Reasons</th>
                  <th>Feedback</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r, i) => (
                  <tr key={i}>
                    <td className="mono small">{r.orderId}</td>
                    <td className="small">{r.userEmail}</td>
                    <td style={{ maxWidth: 200 }}>
                      {(r.reasons || []).map((reason, idx) => (
                        <div key={idx} style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>• {reason}</div>
                      ))}
                    </td>
                    <td style={{ fontSize: 12, color: '#aaa', maxWidth: 180 }}>{r.feedback || '-'}</td>
                    <td className="small">{r.date}</td>
                    <td>
                      <span className={`admin-badge ${
                        r.status === 'Approved' ? 'delivered' :
                        r.status === 'Rejected' ? 'cancelled' : 'processing'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Return in Process' && (
                        <>
                          <button className="admin-btn success" onClick={() => updateStatus(r._id, 'Approved')}>Approve</button>
                          <button className="admin-btn danger" onClick={() => updateStatus(r._id, 'Rejected')}>Reject</button>
                        </>
                      )}
                      {r.status !== 'Return in Process' && (
                        <span style={{ color: '#444', fontSize: 12 }}>Resolved</span>
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