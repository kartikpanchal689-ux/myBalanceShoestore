import React, { useState, useEffect } from 'react';
import staticProducts from '../data/products';

const SERVER_URL = "https://mybalanceshoestore.onrender.com";

export default function AdminProducts() {
  const [dbProducts, setDbProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '', category: 'Running', price: '', image: '', description: '', colors: '', sizes: ''
  });

  // Fetch DB products on mount
  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/products`)
      .then(r => r.json())
      .then(data => { if (data.success) setDbProducts(data.products); })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const allProducts = [...staticProducts, ...dbProducts];

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', category: 'Running', price: '', image: '', description: '', colors: '', sizes: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p._id || p.id);
    setForm({
      name: p.name, category: p.category, price: p.price,
      image: p.image, description: p.description || '',
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', ')
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name || !form.price) return alert('Name and price required');

    const product = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description,
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      let res, data;
      // Only DB products (with _id) can be edited via API
      const isDbProduct = editId && typeof editId === 'string' && editId.length === 24;

      if (isDbProduct) {
        res = await fetch(`${SERVER_URL}/api/admin/products/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      } else {
        res = await fetch(`${SERVER_URL}/api/admin/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      }

      data = await res.json();
      if (!data.success) return alert('Failed to save: ' + data.message);

      if (isDbProduct) {
        setDbProducts(prev => prev.map(p => p._id === editId ? data.product : p));
      } else {
        setDbProducts(prev => [...prev, data.product]);
      }

      setShowModal(false);
    } catch (err) {
      alert('Server error: ' + err.message);
    }
  };

  const deleteProduct = async (p) => {
    if (!window.confirm('Delete this product?')) return;
    const isDbProduct = p._id;

    if (!isDbProduct) return alert('Static products cannot be deleted here.');

    try {
      const res = await fetch(`${SERVER_URL}/api/admin/products/${p._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setDbProducts(prev => prev.filter(x => x._id !== p._id));
    } catch (err) {
      alert('Server error: ' + err.message);
    }
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
          <div className="admin-product-card" key={p._id || p.id || i}>
            <img src={p.image} alt={p.name} className="admin-product-img"
              onError={e => e.target.style.background = '#1f1f1f'} />
            <div className="admin-product-info">
              <div className="admin-product-name">{p.name}</div>
              <div className="admin-product-cat">{p.category}</div>
              <div className="admin-product-price">₹{p.price}</div>
              <div className="admin-product-actions">
                <button className="admin-btn primary" onClick={() => openEdit(p)}>Edit</button>
                <button className="admin-btn danger" onClick={() => deleteProduct(p)}>Delete</button>
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
                {['Running', 'Lifestyle', 'Training', 'Accessories'].map(c => <option key={c}>{c}</option>)}
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