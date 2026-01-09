import { Link } from 'react-router-dom';

export default function ProductGrid({ products }) {
  return (
    <section className="product-grid">
      {products.map(p => (
        <div key={p.id} className="product-card">
          <img src={p.image} alt={p.name} />
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <Link to={`/product/${p.id}`}>View Details</Link>
        </div>
      ))}
    </section>
  );
}
