import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import allProducts from "../data/products";
import ReviewSection from "./Reviewsection";
import Rating from "./Rating";
import { getAverageRating, getReviewCount } from "../data/Reviews";
import "./ProductDetail.css";

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  
  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ paddingTop: "100px", textAlign: "center", padding: "100px 20px" }}>
        <p>Product not found</p>
        <Link to="/" style={{ display: "inline-block", marginTop: "20px", padding: "12px 30px", backgroundColor: "#000", color: "#fff", textDecoration: "none", borderRadius: "4px" }}>
          Return to Home
        </Link>
      </div>
    );
  }

  // Get related products (show 6 instead of 3)
  const related = allProducts.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Get rating data
  const averageRating = parseFloat(getAverageRating(product.id));
  const reviewCount = getReviewCount(product.id);

  // Product images - with color support
  const productImages = selectedColor && product.colorImages && product.colorImages[selectedColor]
    ? product.colorImages[selectedColor]
    : product.images || [product.image];
  
  // Initialize selected color on mount
  useEffect(() => {
    if (!selectedColor && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors, selectedColor]);

  // Reset to first image when color changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-container">
        
        {/* Product Info Section */}
        <div className="product-info-grid">
          {/* Image Gallery */}
          <div className="product-images">
            {/* Main Image */}
            <div className="main-image-container">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name} 
                className="main-product-image"
              />
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="thumbnail-images">
                {productImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="product-details">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Rating */}
            {reviewCount > 0 && (
              <div className="product-rating">
                <Rating rating={averageRating} size="medium" showNumber={true} reviewCount={reviewCount} />
              </div>
            )}
            
            <span className="product-category-badge">{product.category}</span>
            
            <p className="product-description">{product.description}</p>
            
            <p className="product-price">₹{product.price}</p>
            
            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="color-selector">
                <h4>Color: <span>{selectedColor}</span></h4>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selector">
                <h4>Size:</h4>
                <div className="size-options">
                  {product.sizes.map((size, index) => (
                    <button key={index} className="size-btn">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <p className="stock-status">
              {product.stock > 0 ? `In Stock: ${product.stock} items` : 'Out of Stock'}
            </p>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
            >
              {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            
            <Link to="/cart" className="view-cart-link">
              View Cart
            </Link>
          </div>
        </div>

        {/* Related Products - MOVED ABOVE REVIEWS */}
        {related.length > 0 && (
          <div className="related-products-section">
            <h3 className="section-title">You May Also Like</h3>
            <div className="related-products-grid">
              {related.map(r => {
                const relatedRating = parseFloat(getAverageRating(r.id));
                const relatedReviewCount = getReviewCount(r.id);
                
                return (
                  <Link to={`/product/${r.id}`} key={r.id} className="related-product-card">
                    <div className="related-product-image">
                      <img src={r.image} alt={r.name} />
                    </div>
                    <div className="related-product-info">
                      <p className="related-product-name">{r.name}</p>
                      {relatedReviewCount > 0 && (
                        <div className="related-product-rating">
                          <Rating rating={relatedRating} size="small" showNumber={true} reviewCount={relatedReviewCount} />
                        </div>
                      )}
                      <p className="related-product-price">₹{r.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews Section - NOW BELOW RELATED PRODUCTS */}
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}