import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductList from './ProductList';
import staticProducts from '../data/products';

const SERVER_URL = "https://mybalanceshoestore.onrender.com";

function CategoryPage({ addToCart }) {
  const { category } = useParams();
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryMap = {
    'running': 'Running',
    'lifestyle': 'Lifestyle',
    'training': 'Training',
    'accessories': 'Accessories'
  };

   if (!category) return <div>Invalid category</div>;
  const categoryName = category ? (categoryMap[category.toLowerCase()] || category) : '';  

  // Fetch DB products on mount
  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/products`)
      .then(r => r.json())
      .then(data => { if (data.success) setDbProducts(data.products); })
      .catch(err => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Listen to SSE for real-time product updates
  useEffect(() => {
    const sse = new EventSource(`${SERVER_URL}/api/sync/guest`);
    sse.onmessage = (e) => {
      const event = JSON.parse(e.data);
      if (event.type === "PRODUCT_ADDED") {
        setDbProducts(prev => [...prev, event.payload]);
      } else if (event.type === "PRODUCT_UPDATED") {
        setDbProducts(prev => prev.map(p => p._id === event.payload._id ? event.payload : p));
      } else if (event.type === "PRODUCT_DELETED") {
        setDbProducts(prev => prev.filter(p => p._id !== event.payload.id));
      }
    };
    sse.onerror = () => sse.close();
    return () => sse.close();
  }, []);

  const allProducts = [...staticProducts, ...dbProducts];

  const products = allProducts.filter(p =>
  p.category && categoryName && 
  p.category.toLowerCase() === categoryName.toLowerCase()
);

  if (loading) return <div style={{textAlign:'center', padding:'60px'}}>Loading...</div>;

  return (
    <>
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>No products found in this category</p>
          <Link to="/" style={{ display: "inline-block", marginTop: "20px", padding: "12px 30px", backgroundColor: "#000", color: "#fff", textDecoration: "none", borderRadius: "4px" }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <ProductList
          products={products}
          categoryName={categoryName}
          addToCart={addToCart}
        />
      )}
    </>
  );
}

export default CategoryPage;