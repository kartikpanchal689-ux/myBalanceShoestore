import React, { useState } from 'react';
import products from '../data/products';

export default function AdminProducts() {
  const [customProducts, setCustomProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminProducts') || '[]'); } catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Running', price: '', image: '', description: '', colors: '', sizes: '' });

  const allProducts = [...products, ...customProducts];

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', category: 'Running', price: '', image: '', description: '', colors: '', sizes: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name, category: p.category, price: p.price,
      image: p.image, description: p.description || '',
      colors: (p.colors || []).join(', '), sizes: (p.sizes || []).join(', ')
    });
    setShowModal(true);
  };

  const save = () => {
    if (!form.name || !form.price) return alert('Name and price required');
    const product = {
      id: editId || Date.now(),
      name: form.name, category: form.category, price: parseFloat(form.price),
      image: form.image, description: form.description,
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
    };
    let custom = [...customProducts];
    const idx = custom.findIndex(p => p.id === editId);
    if (idx >= 0) custom[idx] = product; else custom.push(product);
    setCustomProducts(custom);
    localStorage.setItem('adminProducts', JSON.stringify(custom));
    setShowModal(false);
  };

  const deleteProduct = (id) => {
    if (!window.confirm('Delete this product?')) return;
    const custom = customProducts.filter(p => p.id !== id);
    setCustomProducts(custom);
    localStorage.setItem('adminProducts', JSON.stringify(custom));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <p>Manage your product catalog ({allProducts.length} products)</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <button className="admin-btn primary large" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="admin-products-grid">
        {allProducts.map((p, i) => (
          <div className="admin-product-card" key={i}>
            <img src={p.image} alt={p.name} className="admin-product-img"
              onError={e => e.target.style.background = '#1f1f1f'} />
            <div className="admin-product-info">
              <div className="admin-product-name">{p.name}</div>
              <div className="admin-product-cat">{p.category}</div>
              <div className="admin-product-price">₹{p.price}</div>
              <div className="admin-product-actions">
                <button className="admin-btn primary" onClick={() => openEdit(p)}>Edit</button>
                <button className="admin-btn danger" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="admin-modal">
            <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
            {[
              { label: 'Product Name', key: 'name', type: 'text', placeholder: 'NB Running Elite' },
              { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '150' },
              { label: 'Image URL', key: 'image', type: 'text', placeholder: '/images/product.jpg' },
              { label: 'Colors (comma separated)', key: 'colors', type: 'text', placeholder: 'Black, White, Gray' },
              { label: 'Sizes (comma separated)', key: 'sizes', type: 'text', placeholder: '7, 8, 9, 10, 11' },
            ].map(f => (
              <div key={f.key}>
                <label className="admin-modal-label">{f.label}</label>
                <input className="admin-modal-input" type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="admin-modal-label">Category</label>
              <select className="admin-modal-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Running','Lifestyle','Training','Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-modal-label">Description</label>
              <textarea className="admin-modal-input" rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="admin-modal-btns">
              <button className="admin-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn primary" onClick={save}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}