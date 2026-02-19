import React from 'react'
import { Link } from 'react-router-dom';
import './Category.css';

function Category() {
  return (
    <>
      <section className="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          <Link to="/category/running" className="category-card">
            <img src="/myBalanceShoestore/images/Running.png" alt="Running Shoes" />
            <h3>Running</h3>
          </Link>
          <Link to="/category/lifestyle" className="category-card">
            <img src="/myBalanceShoestore/images/LifeStyle.png" alt="Lifestyle Shoes" />
            <h3>Lifestyle</h3>
          </Link>
          <Link to="/category/training" className="category-card">
            <img src="/myBalanceShoestore/images/Training.png" alt="Training Shoes" />
            <h3>Training</h3>
          </Link>
          <Link to="/category/accessories" className="category-card">
            <img src="/myBalanceShoestore/images/accessories.png" alt="Accessories" />
            <h3>Accessories</h3>
          </Link>
        </div>
        
      </section>
    </>
  )
}

export default Category