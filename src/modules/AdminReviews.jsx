import React, { useState, useEffect } from 'react';

const SERVER_URL = "https://mybalanceshoestore.onrender.com";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/reviews`)
      .then(r => r.json())
      .then(data => { if (data.success) setReviews(data.reviews); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const submitReply = async (id) => {
    if (!replyText.trim()) return alert('Reply cannot be empty');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/reviews/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r._id === id ? data.review : r));
        setReplyingId(null);
        setReplyText('');
      }
    } catch { alert('Server error'); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setReviews(prev => prev.filter(r => r._id !== id));
    } catch { alert('Server error'); }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'replied') return !!r.reply;
    if (filter === 'pending') return !r.reply;
    if (filter === '5star') return r.rating === 5;
    if (filter === 'low') return r.rating <= 2;
    return true;
  }).filter(r =>
    !search || r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.productName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase())
  );

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const pending = reviews.filter(r => !r.reply).length;

  if (loading) return (
    <div className="admin-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#888' }}>
        Loading reviews...
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <style>{`
        .ar-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
        .ar-kpi { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:16px; }
        .ar-kpi-label { font-size:11px; color:#666; font-weight:700; letter-spacing:.8px; text-transform:uppercase; margin-bottom:6px; }
        .ar-kpi-value { font-size:24px; font-weight:900; color:#fff; }
        .ar-kpi-sub { font-size:12px; color:#555; margin-top:2px; }

        .ar-toolbar { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; align-items:center; }
        .ar-search { flex:1; min-width:200px; background:#1a1a1a; border:1px solid #333; border-radius:8px; color:#fff; padding:9px 14px; font-size:13px; outline:none; }
        .ar-search:focus { border-color:#e8471a; }
        .ar-filter-btn { background:#1a1a1a; border:1px solid #333; color:#aaa; border-radius:8px; padding:9px 14px; font-size:12px; cursor:pointer; font-weight:600; transition:.2s; white-space:nowrap; }
        .ar-filter-btn.active { background:#e8471a; border-color:#e8471a; color:#fff; }
        .ar-filter-btn:hover:not(.active) { border-color:#555; color:#fff; }

        .ar-list { display:flex; flex-direction:column; gap:14px; }
        .ar-card { background:#111; border:1px solid #222; border-radius:12px; padding:18px; }
        .ar-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px; }
        .ar-user { display:flex; align-items:center; gap:10px; }
        .ar-avatar { width:38px; height:38px; border-radius:50%; background:#222; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; }
        .ar-user-info { display:flex; flex-direction:column; gap:2px; }
        .ar-user-name { font-size:14px; font-weight:700; color:#fff; }
        .ar-user-email { font-size:11px; color:#555; }
        .ar-product-tag { font-size:11px; background:#1f1f1f; border:1px solid #333; color:#aaa; border-radius:5px; padding:3px 8px; margin-top:3px; display:inline-block; }

        .ar-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
        .ar-stars { color:#FFA500; font-size:14px; letter-spacing:1px; }
        .ar-date { font-size:11px; color:#555; }
        .ar-badge-replied { background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3); font-size:10px; font-weight:700; border-radius:4px; padding:2px 7px; }
        .ar-badge-pending { background:rgba(251,146,60,0.15); color:#fb923c; border:1px solid rgba(251,146,60,0.3); font-size:10px; font-weight:700; border-radius:4px; padding:2px 7px; }

        .ar-comment { font-size:13px; color:#bbb; line-height:1.6; margin:8px 0; }
        .ar-photos { display:flex; gap:8px; margin:8px 0; }
        .ar-photo { width:60px; height:60px; border-radius:6px; object-fit:cover; cursor:pointer; border:1px solid #333; }

        .ar-reply-box { background:#161616; border:1px solid #2a2a2a; border-radius:8px; padding:12px; margin-top:10px; }
        .ar-reply-label { font-size:11px; color:#22c55e; font-weight:700; letter-spacing:.5px; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
        .ar-reply-text { font-size:13px; color:#aaa; line-height:1.5; }
        .ar-reply-date { font-size:11px; color:#555; margin-top:4px; }

        .ar-actions { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
        .ar-btn { border:none; border-radius:7px; padding:7px 14px; font-size:12px; font-weight:600; cursor:pointer; transition:.2s; }
        .ar-btn-reply { background:#e8471a; color:#fff; }
        .ar-btn-reply:hover { background:#c73d15; }
        .ar-btn-edit { background:#2a2a2a; color:#aaa; border:1px solid #333; }
        .ar-btn-edit:hover { color:#fff; border-color:#555; }
        .ar-btn-delete { background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2); }
        .ar-btn-delete:hover { background:rgba(239,68,68,0.2); }

        .ar-reply-form { margin-top:12px; display:flex; flex-direction:column; gap:8px; }
        .ar-reply-input { background:#1a1a1a; border:1px solid #333; border-radius:8px; color:#fff; padding:10px 14px; font-size:13px; resize:vertical; outline:none; font-family:inherit; width:100%; box-sizing:border-box; }
        .ar-reply-input:focus { border-color:#e8471a; }
        .ar-reply-form-btns { display:flex; gap:8px; }

        .ar-empty { text-align:center; padding:60px 20px; color:#555; font-size:14px; }

        @media(max-width:700px) {
          .ar-kpis { grid-template-columns:repeat(2,1fr); }
          .ar-card-top { flex-direction:column; }
          .ar-meta { align-items:flex-start; }
        }
      `}</style>

      <div className="admin-page-header">
        <h1>Reviews</h1>
        <p>Manage customer reviews and respond to feedback</p>
      </div>

      {/* KPIs */}
      <div className="ar-kpis">
        <div className="ar-kpi">
          <div className="ar-kpi-label">Total Reviews</div>
          <div className="ar-kpi-value">{reviews.length}</div>
          <div className="ar-kpi-sub">from all products</div>
        </div>
        <div className="ar-kpi">
          <div className="ar-kpi-label">Avg Rating</div>
          <div className="ar-kpi-value" style={{color:'#FFA500'}}>{avgRating} ★</div>
          <div className="ar-kpi-sub">overall score</div>
        </div>
        <div className="ar-kpi">
          <div className="ar-kpi-label">Pending Reply</div>
          <div className="ar-kpi-value" style={{color: pending > 0 ? '#fb923c' : '#22c55e'}}>{pending}</div>
          <div className="ar-kpi-sub">need response</div>
        </div>
        <div className="ar-kpi">
          <div className="ar-kpi-label">Replied</div>
          <div className="ar-kpi-value" style={{color:'#22c55e'}}>{reviews.filter(r => r.reply).length}</div>
          <div className="ar-kpi-sub">responded</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ar-toolbar">
        <input className="ar-search" placeholder="Search by name, product, review..." value={search} onChange={e => setSearch(e.target.value)} />
        {[
          { key: 'all', label: `All (${reviews.length})` },
          { key: 'pending', label: `Pending (${reviews.filter(r=>!r.reply).length})` },
          { key: 'replied', label: `Replied (${reviews.filter(r=>r.reply).length})` },
          { key: '5star', label: '5 ★' },
          { key: 'low', label: '⚠️ Low Rating' },
        ].map(f => (
          <button key={f.key} className={`ar-filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="ar-empty">No reviews found</div>
      ) : (
        <div className="ar-list">
          {filtered.map(review => (
            <div key={review._id} className="ar-card">
              <div className="ar-card-top">
                <div className="ar-user">
                  <div className="ar-avatar">{review.userName.charAt(0).toUpperCase()}</div>
                  <div className="ar-user-info">
                    <div className="ar-user-name">{review.userName}</div>
                    <div className="ar-user-email">{review.userEmail}</div>
                    {review.productName && <span className="ar-product-tag">📦 {review.productName}</span>}
                  </div>
                </div>
                <div className="ar-meta">
                  <div className="ar-stars">{stars(review.rating)}</div>
                  <div className="ar-date">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  {review.reply
                    ? <span className="ar-badge-replied">✓ Replied</span>
                    : <span className="ar-badge-pending">⏳ Pending</span>
                  }
                </div>
              </div>

              <p className="ar-comment">"{review.comment}"</p>

              {review.photos && review.photos.length > 0 && (
                <div className="ar-photos">
                  {review.photos.map((p, i) => (
                    <img key={i} src={p} alt="review" className="ar-photo" onClick={() => window.open(p, '_blank')} />
                  ))}
                </div>
              )}

              {/* Existing Reply */}
              {review.reply && replyingId !== review._id && (
                <div className="ar-reply-box">
                  <div className="ar-reply-label">👟 Official Response</div>
                  <div className="ar-reply-text">{review.reply.comment}</div>
                  <div className="ar-reply-date">{new Date(review.reply.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              )}

              {/* Reply Form */}
              {replyingId === review._id && (
                <div className="ar-reply-form">
                  <textarea className="ar-reply-input" rows={3}
                    placeholder="Write your official response..."
                    value={replyText} onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="ar-reply-form-btns">
                    <button className="ar-btn ar-btn-reply" onClick={() => submitReply(review._id)}>Send Reply</button>
                    <button className="ar-btn ar-btn-edit" onClick={() => { setReplyingId(null); setReplyText(''); }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="ar-actions">
                {replyingId !== review._id && (
                  <button className="ar-btn ar-btn-reply" onClick={() => {
                    setReplyingId(review._id);
                    setReplyText(review.reply?.comment || '');
                  }}>
                    {review.reply ? '✏️ Edit Reply' : '💬 Reply'}
                  </button>
                )}
                <button className="ar-btn ar-btn-delete" onClick={() => deleteReview(review._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}