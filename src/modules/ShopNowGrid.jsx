import React from "react";
import "./ShopNowGrid.css";

const ShopNowGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <section className="shop-now">
      <h2 className="section-title">Shop Now</h2>
      <div className="product-grid">
        {products.map((item, index) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">${item.price}</p>
            <button className="btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};


export default ShopNowGrid;
