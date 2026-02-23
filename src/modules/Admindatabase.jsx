import React, { useState } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminDatabase() {
  const [collection, setCollection] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCollection = async (name) => {
    setCollection(name);
    setLoading(true);
    try {
      const url = name === 'orders' ? `${API}/admin/orders` : `${API}/admin/users`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json.orders || json.users || []);
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Database Viewer</h1>
        <p>Browse MongoDB collections</p>
      </div>
      <div className="admin-db-tabs">
        {['orders', 'users'].map(c => (
          <button
            key={c}
            className={`admin-db-tab ${collection === c ? 'active' : ''}`}
            onClick={() => loadCollection(c)}
          >{c.charAt(0).toUpperCase() + c.slice(1)}</button>
        ))}
      </div>
      {!collection && <div className="admin-loading">Select a collection above</div>}
      {loading && <div className="admin-loading">Loading...</div>}
      {!loading && data.map((doc, i) => (
        <pre key={i} className="admin-db-doc">{JSON.stringify(doc, null, 2)}</pre>
      ))}
      {!loading && collection && data.length === 0 && (
        <div className="admin-loading">No documents found</div>
      )}
    </div>
  );
}