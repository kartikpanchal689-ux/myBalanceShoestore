import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import allProducts from '../data/products';

function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      // 🔌 BACKEND CONNECTION POINT:
      // Replace this frontend filter with your API call when ready
      // Example: 
      // fetch(`YOUR_API_URL/api/products/search?query=${query}`)
      //   .then(res => res.json())
      //   .then(data => setResults(data))
      
      // Current: Frontend search (filters from products.js)
      const searchResults = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
    }
  }, [query]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product);
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.backgroundColor = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 1500);
  };

  return (
    <div style={{ paddingTop: "100px", maxWidth: "1400px", margin: "0 auto", padding: "100px 20px 40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <Link to="/" style={{ color: "#666", textDecoration: "none" }}>← Back to Home</Link>
        <h1 style={{ fontSize: "2.5rem", marginTop: "20px" }}>
          Search Results for "{query}"
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          {results.length} {results.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>No products found matching "{query}"</p>
          <p style={{ color: "#999", marginTop: "10px" }}>Try searching with different keywords</p>
          <Link to="/" style={{ display: "inline-block", marginTop: "20px", padding: "12px 30px", backgroundColor: "#000", color: "#fff", textDecoration: "none", borderRadius: "4px" }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "40px" }}>
          {results.map(p => (
            <div key={p.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", backgroundColor: "white", display: "flex", flexDirection: "column", transition: "all 0.3s" }}>
              <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "280px", objectFit: "cover" }} />
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>{p.category}</span>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", fontWeight: 600 }}>{p.name}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "auto" }}>{p.description}</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#000", marginTop: "15px" }}>₹{p.price}</p>
                </div>
              </Link>
              <button 
                onClick={(e) => handleAddToCart(p, e)}
                style={{ width: "calc(100% - 40px)", margin: "0 20px 20px", padding: "14px", backgroundColor: "#000", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, transition: "all 0.3s" }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#333"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#000"}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;