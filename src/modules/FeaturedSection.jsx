import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FeaturedSection.css";

const FeaturedSection = ({ products, addToCart }) => {
  const [added, setAdded] = useState(null);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent Link navigation
    if (addToCart) {
      addToCart(product);
      setAdded(product.id);
      setTimeout(() => setAdded(null), 1500);
    }
  };

  // Show message if no products
  if (!products || products.length === 0) {
    return null; // Don't render section if empty
  }

  return (
    <section className="nb-featured">
      <div className="nb-featured__header">
        <div>
          <p className="nb-featured__label">JUST FOR YOU</p>
          <h2 className="nb-featured__title">Featured Products</h2>
        </div>
        <Link to="/products" className="nb-featured__view-all">View All</Link>
      </div>

      <div className="nb-featured__grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="nb-featured__card"
          >
            <div className="nb-featured__img-box">
              <img src={product.image} alt={product.name} className="nb-featured__img" />
              {product.badge && (
                <span className="nb-featured__badge">{product.badge}</span>
              )}
              <button
                className={`nb-featured__add ${added === product.id ? 'nb-featured__add--done' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
              >
                {added === product.id ? '✓ Added' : 'Add to Cart'}
              </button>
            </div>
            <div className="nb-featured__info">
              <span className="nb-featured__cat">{product.category || 'Featured'}</span>
              <h3 className="nb-featured__name">{product.name}</h3>
              <p className="nb-featured__desc">{product.tagline || product.description}</p>
              <span className="nb-featured__price">₹{product.price?.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;