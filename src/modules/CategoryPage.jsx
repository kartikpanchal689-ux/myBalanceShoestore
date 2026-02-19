import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductList from './ProductList';
import allProducts from '../data/products';

function CategoryPage({ addToCart }) {
  const { category } = useParams();
  
  const categoryMap = {
    'running': 'Running',
    'lifestyle': 'Lifestyle',
    'training': 'Training',
    'accessories': 'Accessories'
  };
  
  const categoryName = categoryMap[category.toLowerCase()] || category;
  
  const products = allProducts.filter(p => 
    p.category.toLowerCase() === categoryName.toLowerCase()
  );
  
  return (
    <div style={{ width: "100%", paddingTop: "70px" }}>
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
    </div>
  );
}

export default CategoryPage;