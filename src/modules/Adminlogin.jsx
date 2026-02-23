import React, { useState } from 'react';

const API = 'https://mybalanceshoestore.onrender.com/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/password-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });
      const data = await res.json();
      if (data.success && data.role === 'admin') {
        localStorage.setItem('adminToken', 'true');
        localStorage.setItem('adminEmail', email);
        onLogin();
      } else if (data.success && data.role !== 'admin') {
        setError('This account does not have admin access.');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-logo">MB <span>Admin</span></div>
        <h2>Sign In</h2>
        <p>myBalance Shoestore Admin Panel</p>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" placeholder="admin@mybalance.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}