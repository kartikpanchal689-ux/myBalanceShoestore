import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminProducts from './Adminproducts';
import AdminReports from './Adminreports';
import AdminDatabase from './AdminDatabase';
import AdminReviews from './AdminReviews';

import './Admin.css';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('adminToken') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsAdmin(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    navigate('/admin');
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/orders', icon: '📦', label: 'Orders' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/products', icon: '👟', label: 'Products' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' },
    { path: '/admin/database', icon: '🗄️', label: 'Database' },
    { path: '/admin/reviews', icon: '⭐', label: 'Reviews' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">MB <span>Admin</span></div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-email">{localStorage.getItem('adminEmail') || 'Admin'}</div>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="database" element={<AdminDatabase />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Routes>
      </main>
    </div>
  );
}