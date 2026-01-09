import React from 'react'
import './Category.css';
function Category() {
  return (
    <>
       <section className="categories">
  <h2 className="section-title">Shop by Category</h2>
  <div className="category-grid">
    <div className="category-card">
      <img src="/myBalanceShoestore/images/Running.png" alt="Running Shoes" />
      <h3>Running</h3>
    </div>
    <div className="category-card">
      <img src="/myBalanceShoestore/images/LifeStyle.png" alt="Lifestyle Shoes" />
      <h3>Lifestyle</h3>
    </div>
    <div className="category-card">
      <img src="/myBalanceShoestore/images/Training.png" alt="Training Shoes" />
      <h3>Training</h3>
    </div>
    <div className="category-card">
      <img src="/myBalanceShoestore/images/accessories.png" alt="Accessories" />
      <h3>Accessories</h3>
    </div>
  </div>
</section>
    </>
  )
}

export default Category