import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ShopNowGrid.css";

const ShopNowGrid = ({ products, addToCart }) => {
  const [added, setAdded] = useState(null);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent Link navigation
    if (addToCart) {
      addToCart(product);
      setAdded(product.id);
      setTimeout(() => setAdded(null), 1500);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="nb-trending">
      <div className="nb-trending__header">
        <div>
          <p className="nb-trending__label">TRENDING NOW</p>
          <h2 className="nb-trending__title">Shop Now</h2>
        </div>
        <Link to="/products" className="nb-trending__view-all">View All</Link>
      </div>

      <div className="nb-trending__grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="nb-trending__card"
          >
            <div className="nb-trending__img-box">
              <img src={product.image} alt={product.name} className="nb-trending__img" />
              {product.isNew && (
                <span className="nb-trending__badge">NEW</span>
              )}
              <button
                className={`nb-trending__add ${added === product.id ? 'nb-trending__add--done' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
              >
                {added === product.id ? '✓ Added' : 'Add to Cart'}
              </button>
            </div>
            <div className="nb-trending__info">
              <h3 className="nb-trending__name">{product.name}</h3>
              <span className="nb-trending__price">₹{product.price?.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopNowGrid;