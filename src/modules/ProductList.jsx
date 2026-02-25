import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, categoryName, addToCart }) => {
  const [showFilters, setShowFilters] = useState(false); // ✅ FIX 1: Changed from true to false
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Get unique values for filters
  const uniqueColors = useMemo(() => {
    const colors = new Set();
    products.forEach(product => {
      if (product.colors) {
        product.colors.forEach(color => colors.add(color));
      }
    });
    return Array.from(colors);
  }, [products]);

  const uniqueSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach(product => {
      if (product.sizes) {
        product.sizes.forEach(size => sizes.add(size));
      }
    });
    return Array.from(sizes);
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        if (!product.colors || !product.colors.some(color => selectedColors.includes(color))) {
          return false;
        }
      }

      // Size filter
      if (selectedSizes.length > 0) {
        if (!product.sizes || !product.sizes.some(size => selectedSizes.includes(size))) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, sortBy, priceRange, selectedColors, selectedSizes]);

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    if (addToCart) {
      addToCart(product);
      const btn = e.target;
      const originalText = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.backgroundColor = '#28a745';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    }
  };

  return (
    <div className="product-listing">
      {/* Header */}
      <div className="listing-header">
        <h1 className="category-title">
          {categoryName} <span className="product-count">({filteredAndSortedProducts.length})</span>
        </h1>

        <div className="header-controls">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="sort-dropdown">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A-Z</option>
              <option value="name-za">Name: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="listing-container">

        {/* ✅ FIX 2 & 3: Filters Sidebar - restructured with filters-top-bar and filters-body */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>

          {/* ✅ Fixed top bar inside panel - Hide Filters + Sort always visible */}
          <div className="filters-top-bar">
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Hide Filters
            </button>
            <div className="sort-dropdown">
              <label htmlFor="sort-mobile">Sort</label>
              <select
                id="sort-mobile"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
            </div>
          </div>

          {/* ✅ Fixed filters title - always visible */}
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* ✅ Only this part scrolls */}
          <div className="filters-body">

            {/* Price Filter */}
            <div className="filter-section">
              <button className="filter-section-header">
                Price
                <span className="expand-icon">+</span>
              </button>
              <div className="filter-section-content">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      min="0"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      min="0"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="price-slider"
                />
              </div>
            </div>

            {/* Color Filter */}
            {uniqueColors.length > 0 && (
              <div className="filter-section">
                <button className="filter-section-header">
                  Color
                  <span className="expand-icon">+</span>
                </button>
                <div className="filter-section-content">
                  {uniqueColors.map(color => (
                    <label key={color} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleColor(color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            {uniqueSizes.length > 0 && (
              <div className="filter-section">
                <button className="filter-section-header">
                  Size
                  <span className="expand-icon">+</span>
                </button>
                <div className="filter-section-content">
                  {uniqueSizes.map(size => (
                    <label key={size} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div> {/* end filters-body */}
        </aside>

        {/* Product Grid */}
        <div className="products-grid">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            filteredAndSortedProducts.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="product-image"
                  />
                 {product.badge && typeof product.badge === 'string' && <span className={`badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>{product.badge}</span>}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category || 'Unisex Lifestyle'}</p>
                  <p className="product-price">₹{product.price}</p>
                  {addToCart && (
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;