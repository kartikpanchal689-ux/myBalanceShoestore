// ProductList.jsx
import React from "react";
import allProducts from "../data/products"; // your product data file

function ProductList({ addToCart }) {
  return (
    <div>
      <h2>Products</h2>
      {allProducts.map((product) => (
        <div key={product.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <img src={product.image} alt={product.name} width="100" />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
