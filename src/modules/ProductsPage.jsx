import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import allProducts from '../data/products';
import Rating from './Rating';
import { getAverageRating, getReviewCount } from '../data/Reviews';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Running', 'Lifestyle', 'Training', 'Accessories'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage({ addToCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [addedIds, setAddedIds] = useState([]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 2000);
  };

  // New arrivals = products with isNew: true
  const newArrivals = allProducts.filter(p => p.isNew).slice(0, 4);

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="products-page">

      {/* ── HERO BANNER ── */}
      <section className="pp-hero">
        <div className="pp-hero-content">
          <p className="pp-hero-eyebrow">New Balance Collection</p>
          <h1 className="pp-hero-title">Built for<br /><span>Every Move</span></h1>
          <p className="pp-hero-sub">Performance-engineered footwear and gear for every athlete.</p>
        </div>
        <div className="pp-hero-shapes">
          <div className="pp-shape pp-shape1" />
          <div className="pp-shape pp-shape2" />
          <div className="pp-shape pp-shape3" />
        </div>
      </section>

      {/* ── SALE BANNER ── */}
      <div className="pp-sale-banner">
        <span className="pp-sale-tag">🔥 SALE</span>
        <span className="pp-sale-text">Up to <strong>30% OFF</strong> on selected Running & Training shoes</span>
        <span className="pp-sale-code">Use code: <strong>NB30</strong></span>
      </div>

      <div className="pp-main">

        {/* ── SEARCH BAR ── */}
        <div className="pp-search-wrap">
          <div className="pp-search-box">
            <span className="pp-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search shoes, accessories, categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pp-search-input"
            />
            {searchQuery && (
              <button className="pp-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* ── NEW ARRIVALS ── */}
        {!searchQuery && activeCategory === 'All' && (
          <section className="pp-new-arrivals">
            <div className="pp-section-header">
              <h2 className="pp-section-title">New Arrivals</h2>
              <span className="pp-section-badge">Just Dropped</span>
            </div>
            <div className="pp-arrivals-grid">
              {newArrivals.map(p => (
                <Link to={`/product/${p.id}`} key={p.id} className="pp-arrival-card">
                  <div className="pp-arrival-img">
                    <img src={p.image} alt={p.name} />
                    <span className="pp-new-tag">NEW</span>
                  </div>
                  <div className="pp-arrival-info">
                    <p className="pp-arrival-name">{p.name}</p>
                    <p className="pp-arrival-cat">{p.category}</p>
                    <p className="pp-arrival-price">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="pp-filter-bar">
          <div className="pp-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`pp-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="pp-cat-count">
                    {allProducts.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pp-sort-wrap">
            <label>Sort:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="pp-sort-select">
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── RESULTS COUNT ── */}
        <div className="pp-results-bar">
          <p className="pp-results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {(activeCategory !== 'All' || searchQuery) && (
            <button className="pp-clear-filters" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── PRODUCTS GRID ── */}
        {filteredProducts.length === 0 ? (
          <div className="pp-empty">
            <p className="pp-empty-icon">👟</p>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="pp-empty-btn">
              Show All Products
            </button>
          </div>
        ) : (
          <div className="pp-grid">
            {filteredProducts.map(p => {
              const rating = parseFloat(getAverageRating(p.id));
              const count = getReviewCount(p.id);
              const isAdded = addedIds.includes(p.id);

              return (
                <Link to={`/product/${p.id}`} key={p.id} className="pp-card">
                  <div className="pp-card-img">
                    {p.badge && <span className="pp-badge">{p.badge}</span>}
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="pp-card-body">
                    <p className="pp-card-cat">{p.category}</p>
                    <p className="pp-card-name">{p.name}</p>
                    {count > 0 && (
                      <div className="pp-card-rating">
                        <Rating rating={rating} size="small" showNumber={true} reviewCount={count} />
                      </div>
                    )}
                    <div className="pp-card-footer">
                      <span className="pp-card-price">₹{p.price}</span>
                      <button
                        className={`pp-add-btn ${isAdded ? 'added' : ''}`}
                        onClick={e => handleAddToCart(e, p)}
                      >
                        {isAdded ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}