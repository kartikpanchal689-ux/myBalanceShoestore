// FeaturedSection.jsx
import React from "react";
import "./FeaturedSection.css";

const FeaturedSection = ({ products }) => {
  return (
    <section className="featured">
      <h2 className="section-title">Featured Products</h2>
      <div className="featured-grid">
        {products.map((item, index) => (
          <div className="featured-card" key={index}>
            <img src={item.image} alt={item.name} />
            <div className="featured-info">
              <h3>{item.name}</h3>
              <p className="tagline">{item.tagline}</p>
              <p className="price">${item.price}</p>
              <button className="btn">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
