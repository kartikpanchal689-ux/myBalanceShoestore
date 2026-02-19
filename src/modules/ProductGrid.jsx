import { Link } from 'react-router-dom';
// ========== NEW IMPORTS ==========
import Rating from './Rating';
import { getAverageRating, getReviewCount } from '../data/Reviews';
// =================================

export default function ProductGrid({ products }) {
  return (
    <section className="product-grid">
      {products.map(p => {
        // ========== NEW CODE: Get rating data ==========
        const averageRating = parseFloat(getAverageRating(p.id));
        const reviewCount = getReviewCount(p.id);
        // ===============================================
        
        return (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            
            {/* ========== NEW CODE: Rating Display ========== */}
            {reviewCount > 0 && (
              <div style={{ margin: '8px 0' }}>
                <Rating rating={averageRating} size="small" showNumber={true} reviewCount={reviewCount} />
              </div>
            )}
            {/* ============================================== */}
            
            <p>₹{p.price}</p>
            <Link to={`/product/${p.id}`}>View Details</Link>
          </div>
        );
      })}
    </section>
  );
}