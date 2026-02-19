// src/modules/Reviewsection.jsx
import React, { useState } from 'react';
import Rating from './Rating';
import './Reviewsection.css';
import { getProductReviews, getAverageRating, getReviewCount } from '../data/Reviews';

export default function ReviewSection({ productId }) {
  const [sortBy, setSortBy] = useState('recent');
  const reviews = getProductReviews(productId);
  const averageRating = parseFloat(getAverageRating(productId));
  const reviewCount = getReviewCount(productId);

  if (reviews.length === 0) {
    return (
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
          <button className="write-review-btn">Write a Review</button>
        </div>
      </div>
    );
  }

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="reviews-section-wrapper">
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {/* Rating Summary */}
        <div className="rating-summary-box">
          <div className="rating-overview-left">
            <div className="average-rating-large">
              <span className="rating-number-big">{averageRating.toFixed(1)}</span>
              <Rating rating={averageRating} size="large" />
              <p className="total-reviews-text">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>

          <div className="rating-bars-container">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="rating-bar-row">
                <span className="stars-label">{stars} ★</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="count-label">{count}</span>
              </div>
            ))}
          </div>

          <div className="write-review-container">
            <button className="write-review-btn">Write a Review</button>
          </div>
        </div>

        {/* Reviews Header */}
        <div className="reviews-header-bar">
          <h3>All Reviews ({reviewCount})</h3>
          <div className="sort-dropdown-wrapper">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {sortedReviews.map(review => (
            <div key={review.id} className="review-item">
              {/* Review Header */}
              <div className="review-top">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} />
                    ) : (
                      <div className="avatar-circle">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="reviewer-details">
                    <span className="reviewer-name">{review.userName}</span>
                    {review.verified && (
                      <span className="verified-tag">✓ Verified Purchase</span>
                    )}
                  </div>
                </div>
                <Rating rating={review.rating} size="small" />
              </div>

              {/* Review Date */}
              <div className="review-date-text">
                {new Date(review.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Review Content */}
              <p className="review-text">{review.comment}</p>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="review-photos">
                  {review.photos.map((photo, index) => (
                    <div key={index} className="review-photo" onClick={() => window.open(photo, '_blank')}>
                      <img src={photo} alt={`Review photo ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="review-footer">
                <button className="helpful-button">
                  👍 Helpful ({review.helpful || 0})
                </button>
              </div>

              {/* Brand Reply */}
              {review.replies && review.replies.map(reply => (
                <div key={reply.id} className="brand-reply-box">
                  <div className="reply-top">
                    <div className="brand-avatar-circle">
                      <img 
                        src={reply.avatar || '/myBalanceShoestore/images/nb-logo.png'} 
                        alt="New Balance"
                      />
                    </div>
                    <div className="brand-details">
                      <div className="brand-name-row">
                        <span className="brand-name-text">New Balance</span>
                        <span className="official-badge">OFFICIAL RESPONSE</span>
                      </div>
                      <span className="reply-date-text">
                        {new Date(reply.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="reply-text">{reply.comment}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}