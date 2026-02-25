import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Running', link: '/category/running', image: '/myBalanceShoestore/images/running1-white-1.webp' },
  { name: 'Lifestyle', link: '/category/lifestyle', image: '/myBalanceShoestore/images/lifestyle1.jpg' },
  { name: 'Training', link: '/category/training', image: '/myBalanceShoestore/images/training1.webp' },
  { name: 'Accessories', link: '/category/accessories', image: '/myBalanceShoestore/images/socks.webp' },
];

function Category() {
  return (
    <section style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Shop by Category</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {categories.map(cat => (
          <Link key={cat.name} to={cat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Category;