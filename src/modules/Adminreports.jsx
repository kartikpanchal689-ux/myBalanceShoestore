import React, { useState, useEffect, useMemo } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

// ── Mini SVG Sparkline ──
function Sparkline({ data, color = '#22c55e', height = 40 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity="0.12" stroke="none" />
    </svg>
  );
}

// ── Animated Number ──
function AnimNum({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const dur = 900;
    const step = 16;
    const inc = (end / dur) * step;
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

export default function AdminReports() {
  const [orders, setOrders] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    fetch(`${API}/admin/orders`).then(r => r.json()).then(res => {
      if (res.success) setOrders(res.orders);
    });
  }, []);

  // ── Filter by date range ──
  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const d = new Date(o.createdAt || o.date);
      if (from && d < new Date(from)) return false;
      if (to && d > new Date(to + 'T23:59:59')) return false;
      return true;
    });
  }, [orders, from, to]);

  if (!orders) return (
    <div className="admin-page">
      <div className="rp-loading">
        <div className="rp-spinner" />
        <span>Crunching numbers...</span>
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // COMPUTE ALL 8 REPORTS
  // ══════════════════════════════════════════

  const active = filtered.filter(o => o.status !== 'Cancelled');
  const totalRevenue = active.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = active.length ? totalRevenue / active.length : 0;
  const cancelRate = filtered.length ? ((filtered.filter(o => o.status === 'Cancelled').length / filtered.length) * 100) : 0;

  // 1. REVENUE HEATMAP — revenue by day of week
  const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dowRevenue = Array(7).fill(0);
  active.forEach(o => {
    const d = new Date(o.createdAt || o.date);
    if (!isNaN(d)) dowRevenue[d.getDay()] += (o.total || 0);
  });
  const maxDow = Math.max(...dowRevenue, 1);

  // 2. ORDER VELOCITY — orders by hour
  const hourBuckets = Array(24).fill(0);
  filtered.forEach(o => {
    const d = new Date(o.createdAt || o.date);
    if (!isNaN(d)) hourBuckets[d.getHours()]++;
  });
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets));
  const maxHour = Math.max(...hourBuckets, 1);

  // 3. CUSTOMER LOYALTY — repeat vs one-time
  const emailCount = {};
  filtered.forEach(o => { emailCount[o.userEmail] = (emailCount[o.userEmail] || 0) + 1; });
  const repeatBuyers = Object.values(emailCount).filter(c => c > 1).length;
  const oneTimeBuyers = Object.values(emailCount).filter(c => c === 1).length;
  const totalCustomers = Object.keys(emailCount).length;
  const loyaltyScore = totalCustomers ? Math.round((repeatBuyers / totalCustomers) * 100) : 0;

  // 4. BASKET SIZE ANALYSIS
  const basketSizes = filtered.map(o => (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0));
  const avgBasket = basketSizes.length ? basketSizes.reduce((a, b) => a + b, 0) / basketSizes.length : 0;
  const basket1 = basketSizes.filter(b => b === 1).length;
  const basket2_3 = basketSizes.filter(b => b >= 2 && b <= 3).length;
  const basket4plus = basketSizes.filter(b => b >= 4).length;
  const basketMax = Math.max(basket1, basket2_3, basket4plus, 1);

  // 5. PRODUCT CANCELLATION RISK
  const productOrders = {}, productCancels = {};
  filtered.forEach(o => {
    (o.items || []).forEach(item => {
      productOrders[item.name] = (productOrders[item.name] || 0) + 1;
      if (o.status === 'Cancelled') productCancels[item.name] = (productCancels[item.name] || 0) + 1;
    });
  });
  const cancelRisk = Object.entries(productOrders).map(([name, total]) => ({
    name, total, cancelled: productCancels[name] || 0,
    rate: Math.round(((productCancels[name] || 0) / total) * 100)
  })).sort((a, b) => b.rate - a.rate).slice(0, 6);

  // 6. DAILY SALES TREND — last 14 days
  const today = new Date();
  const trendDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d;
  });
  const trendRevenue = trendDays.map(day => {
    return active.filter(o => {
      const d = new Date(o.createdAt || o.date);
      return d.toDateString() === day.toDateString();
    }).reduce((s, o) => s + (o.total || 0), 0);
  });
  const trendLabels = trendDays.map(d => `${d.getDate()}/${d.getMonth() + 1}`);

  // 7. PAYMENT METHOD TREND
  const paymentData = {};
  active.forEach(o => {
    const m = (o.paymentMethod || 'unknown').toUpperCase();
    paymentData[m] = (paymentData[m] || 0) + (o.total || 0);
  });
  const totalPayRev = Object.values(paymentData).reduce((a, b) => a + b, 0) || 1;

  // 8. PEAK SHOPPING DAYS — top/bottom days
  const dayRevMap = {};
  active.forEach(o => {
    const d = new Date(o.createdAt || o.date);
    if (!isNaN(d)) {
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      dayRevMap[key] = (dayRevMap[key] || 0) + (o.total || 0);
    }
  });
  const dayRevEntries = Object.entries(dayRevMap).sort((a, b) => b[1] - a[1]);
  const topDays = dayRevEntries.slice(0, 5);
  const worstDays = [...dayRevEntries].sort((a, b) => a[1] - b[1]).slice(0, 3);

  const payColors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

  return (
    <div className="admin-page">
      <style>{`
        .rp-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; height:300px; gap:16px; color:#888; font-size:15px; }
        .rp-spinner { width:36px; height:36px; border:3px solid #333; border-top-color:#e8471a; border-radius:50%; animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        .rp-top { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:24px; }
        .rp-title { font-size:24px; font-weight:800; color:#fff; margin:0; }
        .rp-sub { font-size:13px; color:#888; margin:4px 0 0; }

        .rp-date-bar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .rp-date-bar label { font-size:12px; color:#aaa; font-weight:600; letter-spacing:.5px; }
        .rp-date-input { background:#1a1a1a; border:1px solid #333; border-radius:7px; color:#fff; font-size:13px; padding:7px 12px; outline:none; cursor:pointer; }
        .rp-date-input:focus { border-color:#e8471a; }
        .rp-clear-btn { background:none; border:1px solid #444; color:#aaa; border-radius:7px; padding:7px 14px; font-size:12px; cursor:pointer; transition:.2s; }
        .rp-clear-btn:hover { border-color:#e8471a; color:#e8471a; }

        .rp-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .rp-kpi { background:#111; border:1px solid #222; border-radius:12px; padding:20px; position:relative; overflow:hidden; }
        .rp-kpi::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--kpi-color,#e8471a); }
        .rp-kpi-label { font-size:11px; color:#666; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
        .rp-kpi-value { font-size:26px; font-weight:900; color:#fff; line-height:1; margin-bottom:4px; }
        .rp-kpi-sub { font-size:12px; color:#555; }

        .rp-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .rp-card { background:#111; border:1px solid #222; border-radius:14px; padding:22px; }
        .rp-card-wide { grid-column:span 2; }
        .rp-card h3 { font-size:14px; font-weight:800; color:#fff; margin:0 0 4px; letter-spacing:.3px; }
        .rp-card-sub { font-size:11px; color:#555; margin:0 0 18px; }

        /* Heatmap */
        .rp-heatmap { display:flex; gap:8px; align-items:flex-end; }
        .rp-hm-col { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; }
        .rp-hm-bar { width:100%; border-radius:6px 6px 0 0; min-height:4px; transition:height .5s; }
        .rp-hm-label { font-size:11px; color:#666; font-weight:600; }
        .rp-hm-val { font-size:10px; color:#888; }

        /* Hour velocity */
        .rp-velocity { display:flex; gap:3px; align-items:flex-end; height:60px; }
        .rp-vel-bar { flex:1; border-radius:3px 3px 0 0; min-height:2px; transition:height .5s; }
        .rp-vel-labels { display:flex; justify-content:space-between; margin-top:6px; }
        .rp-vel-label { font-size:10px; color:#555; }

        /* Loyalty gauge */
        .rp-loyalty { display:flex; align-items:center; gap:24px; }
        .rp-gauge { position:relative; width:100px; height:100px; flex-shrink:0; }
        .rp-gauge svg { transform:rotate(-90deg); }
        .rp-gauge-num { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#fff; }
        .rp-loyalty-stats { flex:1; display:flex; flex-direction:column; gap:10px; }
        .rp-loyalty-row { display:flex; justify-content:space-between; font-size:13px; }
        .rp-loyalty-row span { color:#888; }
        .rp-loyalty-row strong { color:#fff; }

        /* Basket */
        .rp-basket-bars { display:flex; flex-direction:column; gap:10px; }
        .rp-basket-row { display:flex; align-items:center; gap:10px; }
        .rp-basket-label { font-size:12px; color:#888; width:60px; flex-shrink:0; }
        .rp-basket-track { flex:1; background:#1a1a1a; border-radius:4px; height:10px; overflow:hidden; }
        .rp-basket-fill { height:100%; border-radius:4px; transition:width .6s; }
        .rp-basket-count { font-size:12px; color:#aaa; width:40px; text-align:right; }

        /* Cancel risk */
        .rp-risk-list { display:flex; flex-direction:column; gap:8px; }
        .rp-risk-row { display:flex; align-items:center; gap:10px; }
        .rp-risk-name { font-size:12px; color:#aaa; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .rp-risk-bar-track { width:80px; background:#1a1a1a; border-radius:4px; height:8px; overflow:hidden; flex-shrink:0; }
        .rp-risk-bar-fill { height:100%; border-radius:4px; }
        .rp-risk-pct { font-size:12px; font-weight:700; width:36px; text-align:right; flex-shrink:0; }

        /* Trend chart */
        .rp-trend { overflow-x:auto; }
        .rp-trend-chart { display:flex; gap:6px; align-items:flex-end; height:80px; min-width:500px; }
        .rp-trend-bar { flex:1; border-radius:4px 4px 0 0; min-height:2px; background:#e8471a; opacity:.85; transition:height .5s; cursor:pointer; position:relative; }
        .rp-trend-bar:hover { opacity:1; }
        .rp-trend-bar:hover::after { content:attr(data-tip); position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#222; color:#fff; font-size:10px; padding:3px 7px; border-radius:4px; white-space:nowrap; pointer-events:none; }
        .rp-trend-labels { display:flex; gap:6px; margin-top:6px; min-width:500px; }
        .rp-trend-label { flex:1; font-size:9px; color:#555; text-align:center; }

        /* Payment donut */
        .rp-payment { display:flex; align-items:center; gap:20px; }
        .rp-donut { position:relative; flex-shrink:0; }
        .rp-donut-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .rp-donut-center span { font-size:11px; color:#666; }
        .rp-donut-center strong { font-size:18px; font-weight:900; color:#fff; }
        .rp-pay-legend { flex:1; display:flex; flex-direction:column; gap:8px; }
        .rp-pay-row { display:flex; align-items:center; gap:8px; font-size:12px; }
        .rp-pay-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .rp-pay-name { flex:1; color:#aaa; text-transform:uppercase; font-size:11px; letter-spacing:.5px; }
        .rp-pay-pct { color:#fff; font-weight:700; }

        /* Peak days */
        .rp-peak { display:flex; gap:20px; }
        .rp-peak-col { flex:1; }
        .rp-peak-title { font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; margin-bottom:10px; }
        .rp-peak-row { display:flex; justify-content:space-between; align-items:center; padding:7px 10px; border-radius:7px; margin-bottom:6px; font-size:13px; }
        .rp-peak-row span { color:#aaa; }
        .rp-peak-row strong { color:#fff; }

        @media(max-width:900px) {
          .rp-kpis { grid-template-columns:repeat(2,1fr); }
          .rp-grid { grid-template-columns:1fr; }
          .rp-card-wide { grid-column:span 1; }
          .rp-loyalty { flex-direction:column; }
          .rp-payment { flex-direction:column; }
          .rp-peak { flex-direction:column; }
        }
      `}</style>

      {/* Header */}
      <div className="rp-top">
        <div>
          <h1 className="rp-title">Reports</h1>
          <p className="rp-sub">Deep analytics — {filtered.length} orders {from || to ? 'in selected range' : 'all time'}</p>
        </div>
        <div className="rp-date-bar">
          <label>FROM</label>
          <input type="date" className="rp-date-input" value={from} onChange={e => setFrom(e.target.value)} />
          <label>TO</label>
          <input type="date" className="rp-date-input" value={to} onChange={e => setTo(e.target.value)} />
          {(from || to) && <button className="rp-clear-btn" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="rp-kpis">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, sub: `${active.length} active orders`, color: '#22c55e' },
          { label: 'Avg Order Value', value: `₹${avgOrder.toFixed(0)}`, sub: 'per order', color: '#3b82f6' },
          { label: 'Cancel Rate', value: `${cancelRate.toFixed(1)}%`, sub: `${filtered.filter(o=>o.status==='Cancelled').length} cancelled`, color: '#ef4444' },
          { label: 'Loyalty Score', value: `${loyaltyScore}%`, sub: `${repeatBuyers} repeat buyers`, color: '#f59e0b' },
        ].map(k => (
          <div className="rp-kpi" key={k.label} style={{'--kpi-color': k.color}}>
            <div className="rp-kpi-label">{k.label}</div>
            <div className="rp-kpi-value">{k.value}</div>
            <div className="rp-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="rp-grid">

        {/* 1. Revenue Heatmap by Day of Week */}
        <div className="rp-card">
          <h3>📅 Revenue Heatmap</h3>
          <p className="rp-card-sub">Which days generate the most revenue</p>
          <div className="rp-heatmap" style={{height:120}}>
            {dowLabels.map((day, i) => {
              const pct = (dowRevenue[i] / maxDow) * 100;
              const intensity = Math.round((pct / 100) * 255);
              return (
                <div className="rp-hm-col" key={day}>
                  <div className="rp-hm-val">₹{Math.round(dowRevenue[i]/1000)}k</div>
                  <div className="rp-hm-bar" style={{
                    height: `${Math.max(pct, 4)}%`,
                    background: `rgb(232, ${255 - intensity}, ${255 - intensity})`,
                    maxHeight: 70
                  }} />
                  <div className="rp-hm-label">{day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Order Velocity by Hour */}
        <div className="rp-card">
          <h3>⚡ Order Velocity</h3>
          <p className="rp-card-sub">Peak shopping hour: {peakHour}:00 – {peakHour+1}:00</p>
          <div className="rp-velocity">
            {hourBuckets.map((count, h) => (
              <div key={h} className="rp-vel-bar" style={{
                height: `${Math.max((count / maxHour) * 56, 2)}px`,
                background: h === peakHour ? '#e8471a' : count > 0 ? '#3b82f6' : '#1f1f1f'
              }} title={`${h}:00 — ${count} orders`} />
            ))}
          </div>
          <div className="rp-vel-labels">
            {['12am','6am','12pm','6pm','11pm'].map(l => <span key={l} className="rp-vel-label">{l}</span>)}
          </div>
        </div>

        {/* 3. Customer Loyalty Score */}
        <div className="rp-card">
          <h3>🏆 Customer Loyalty</h3>
          <p className="rp-card-sub">Repeat vs one-time buyers</p>
          <div className="rp-loyalty">
            <div className="rp-gauge">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b"
                  strokeWidth="10"
                  strokeDasharray={`${(loyaltyScore/100)*251.2} 251.2`}
                  strokeLinecap="round"/>
              </svg>
              <div className="rp-gauge-num">{loyaltyScore}%</div>
            </div>
            <div className="rp-loyalty-stats">
              <div className="rp-loyalty-row"><span>Total Customers</span><strong>{totalCustomers}</strong></div>
              <div className="rp-loyalty-row"><span>Repeat Buyers</span><strong style={{color:'#f59e0b'}}>{repeatBuyers}</strong></div>
              <div className="rp-loyalty-row"><span>One-time Buyers</span><strong style={{color:'#888'}}>{oneTimeBuyers}</strong></div>
              <div className="rp-loyalty-row"><span>Avg Orders/Customer</span><strong>{totalCustomers ? (filtered.length/totalCustomers).toFixed(1) : 0}</strong></div>
            </div>
          </div>
        </div>

        {/* 4. Basket Size Analysis */}
        <div className="rp-card">
          <h3>🛒 Basket Size Analysis</h3>
          <p className="rp-card-sub">Avg {avgBasket.toFixed(1)} items per order</p>
          <div className="rp-basket-bars">
            {[
              { label: '1 item', count: basket1, color: '#3b82f6' },
              { label: '2–3 items', count: basket2_3, color: '#8b5cf6' },
              { label: '4+ items', count: basket4plus, color: '#e8471a' },
            ].map(b => (
              <div className="rp-basket-row" key={b.label}>
                <div className="rp-basket-label">{b.label}</div>
                <div className="rp-basket-track">
                  <div className="rp-basket-fill" style={{ width: `${(b.count/basketMax*100).toFixed(0)}%`, background: b.color }} />
                </div>
                <div className="rp-basket-count">{b.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Cancellation Risk by Product */}
        <div className="rp-card">
          <h3>🚨 Cancellation Risk</h3>
          <p className="rp-card-sub">Products with highest cancel rates</p>
          <div className="rp-risk-list">
            {cancelRisk.length === 0 ? <p style={{color:'#555',fontSize:13}}>No cancellations in range</p> :
              cancelRisk.map(p => (
                <div className="rp-risk-row" key={p.name}>
                  <div className="rp-risk-name">{p.name}</div>
                  <div className="rp-risk-bar-track">
                    <div className="rp-risk-bar-fill" style={{
                      width: `${p.rate}%`,
                      background: p.rate > 50 ? '#ef4444' : p.rate > 25 ? '#f59e0b' : '#22c55e'
                    }} />
                  </div>
                  <div className="rp-risk-pct" style={{ color: p.rate > 50 ? '#ef4444' : p.rate > 25 ? '#f59e0b' : '#22c55e' }}>
                    {p.rate}%
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* 6. Daily Sales Trend */}
        <div className="rp-card">
          <h3>📈 Daily Sales Trend</h3>
          <p className="rp-card-sub">Revenue over last 14 days</p>
          <div className="rp-trend">
            <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80,minWidth:500}}>
              {trendRevenue.map((v, i) => {
                const maxT = Math.max(...trendRevenue, 1);
                return (
                  <div key={i} className="rp-trend-bar"
                    style={{ height: `${Math.max((v/maxT)*76, 2)}px` }}
                    data-tip={`₹${v.toFixed(0)}`}
                    title={`${trendLabels[i]}: ₹${v.toFixed(0)}`}
                  />
                );
              })}
            </div>
            <div className="rp-trend-labels">
              {trendLabels.map((l,i) => <div key={i} className="rp-trend-label">{l}</div>)}
            </div>
          </div>
          <div style={{marginTop:10}}>
            <Sparkline data={trendRevenue} color="#e8471a" height={30} />
          </div>
        </div>

        {/* 7. Payment Method Breakdown */}
        <div className="rp-card">
          <h3>💳 Payment Intelligence</h3>
          <p className="rp-card-sub">Revenue split by payment method</p>
          <div className="rp-payment">
            <div className="rp-donut">
              <svg width="110" height="110" viewBox="0 0 110 110">
                {(() => {
                  const entries = Object.entries(paymentData);
                  let offset = 0;
                  const circumference = 2 * Math.PI * 38;
                  return entries.map(([method, rev], i) => {
                    const pct = rev / totalPayRev;
                    const dash = pct * circumference;
                    const el = (
                      <circle key={method} cx="55" cy="55" r="38"
                        fill="none" stroke={payColors[i % payColors.length]}
                        strokeWidth="16"
                        strokeDasharray={`${dash} ${circumference}`}
                        strokeDashoffset={-offset * circumference}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="rp-donut-center">
                <span>total</span>
                <strong>₹{Math.round(totalRevenue/1000)}k</strong>
              </div>
            </div>
            <div className="rp-pay-legend">
              {Object.entries(paymentData).map(([m, v], i) => (
                <div className="rp-pay-row" key={m}>
                  <div className="rp-pay-dot" style={{background: payColors[i % payColors.length]}} />
                  <div className="rp-pay-name">{m}</div>
                  <div className="rp-pay-pct">{((v/totalPayRev)*100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Peak vs Worst Shopping Days */}
        <div className="rp-card">
          <h3>🔥 Peak Shopping Days</h3>
          <p className="rp-card-sub">Best and worst performing days</p>
          <div className="rp-peak">
            <div className="rp-peak-col">
              <div className="rp-peak-title" style={{color:'#22c55e'}}>🏅 Best Days</div>
              {topDays.length === 0 ? <p style={{color:'#555',fontSize:12}}>No data</p> :
                topDays.map(([day, rev], i) => (
                  <div className="rp-peak-row" key={day} style={{background: i===0?'rgba(34,197,94,0.08)':'transparent'}}>
                    <span>{day}</span>
                    <strong style={{color:'#22c55e'}}>₹{rev.toFixed(0)}</strong>
                  </div>
                ))
              }
            </div>
            <div className="rp-peak-col">
              <div className="rp-peak-title" style={{color:'#ef4444'}}>📉 Worst Days</div>
              {worstDays.length === 0 ? <p style={{color:'#555',fontSize:12}}>No data</p> :
                worstDays.map(([day, rev]) => (
                  <div className="rp-peak-row" key={day} style={{background:'rgba(239,68,68,0.05)'}}>
                    <span>{day}</span>
                    <strong style={{color:'#ef4444'}}>₹{rev.toFixed(0)}</strong>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}