import React, { useState, useEffect } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminReports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/orders`).then(r => r.json()).then(res => {
      if (res.success) setData(res.orders);
    });
  }, []);

  if (!data) return <div className="admin-page"><div className="admin-loading">Loading reports...</div></div>;

  const active = data.filter(o => o.status !== 'Cancelled');
  const totalRevenue = active.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = active.length ? totalRevenue / active.length : 0;

  const statusCount = data.reduce((acc, o) => {
    const s = o.status || 'Processing';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const paymentRevenue = active.reduce((acc, o) => {
    const m = o.paymentMethod || 'unknown';
    acc[m] = (acc[m] || 0) + (o.total || 0);
    return acc;
  }, {});

  const productCount = {};
  data.forEach(o => (o.items || []).forEach(item => {
    productCount[item.name] = (productCount[item.name] || 0) + (item.quantity || 1);
  }));
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxP = Math.max(...topProducts.map(p => p[1]), 1);

  const maxRev = Math.max(...Object.values(paymentRevenue), 1);
  const statusColors = { Processing: '#3b82f6', Delivered: '#22c55e', Cancelled: '#ef4444' };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reports</h1>
        <p>Sales and revenue analytics</p>
      </div>

      <div className="admin-reports-grid">
        {/* Revenue Summary */}
        <div className="admin-report-card">
          <h3>Revenue Summary</h3>
          <div className="report-summary">
            <div className="report-summary-row"><span>Total Revenue</span><strong style={{color:'#22c55e'}}>₹{totalRevenue.toFixed(2)}</strong></div>
            <div className="report-summary-row"><span>Total Orders</span><strong>{data.length}</strong></div>
            <div className="report-summary-row"><span>Avg Order Value</span><strong>₹{avgOrder.toFixed(2)}</strong></div>
            <div className="report-summary-row"><span>Delivered</span><strong style={{color:'#22c55e'}}>{statusCount['Delivered'] || 0}</strong></div>
            <div className="report-summary-row"><span>Processing</span><strong style={{color:'#3b82f6'}}>{statusCount['Processing'] || 0}</strong></div>
            <div className="report-summary-row"><span>Cancelled</span><strong style={{color:'#ef4444'}}>{statusCount['Cancelled'] || 0}</strong></div>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="admin-report-card">
          <h3>Orders by Status</h3>
          <div className="report-legend">
            {Object.entries(statusCount).map(([k, v]) => (
              <div className="report-legend-row" key={k}>
                <div className="report-dot" style={{background: statusColors[k] || '#888'}}></div>
                <span>{k}</span>
                <strong style={{marginLeft:'auto'}}>{v} orders</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Payment */}
        <div className="admin-report-card">
          <h3>Revenue by Payment Method</h3>
          <div className="report-bars">
            {Object.entries(paymentRevenue).map(([k, v]) => (
              <div className="report-bar-row" key={k}>
                <div className="report-bar-label">{k}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{width: `${(v/maxRev*100).toFixed(0)}%`}}></div>
                </div>
                <div className="report-bar-val">₹{v.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-report-card">
          <h3>Top Products Ordered</h3>
          <div className="report-bars">
            {topProducts.map(([name, count]) => (
              <div className="report-bar-row" key={name}>
                <div className="report-bar-label" style={{fontSize:11}}>{name.length > 14 ? name.slice(0,14)+'…' : name}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill blue" style={{width: `${(count/maxP*100).toFixed(0)}%`}}></div>
                </div>
                <div className="report-bar-val">{count} sold</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}