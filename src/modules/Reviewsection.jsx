import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import './Reviewsection.css';
import { getProductReviews, getAverageRating, getReviewCount } from '../data/Reviews';

const SERVER_URL = "https://mybalanceshoestore.onrender.com";

export default function ReviewSection({ productId, productName }) {
  const [dbReviews, setDbReviews] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: '', photo1: '', photo2: '', photo3: '' });

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userName = localStorage.getItem('userName') || userEmail.split('@')[0] || 'User';

  // Fetch DB reviews
  useEffect(() => {
    fetch(`${SERVER_URL}/api/reviews/${productId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setDbReviews(data.reviews); })
      .catch(() => {});
  }, [productId]);

  // Static reviews as fallback
  const staticReviews = getProductReviews(productId);

  // Merge: DB reviews + static reviews (avoid duplicates)
  const allReviews = [
    ...dbReviews.map(r => ({
      id: r._id,
      userName: r.userName,
      rating: r.rating,
      date: r.createdAt,
      comment: r.comment,
      photos: r.photos || [],
      helpful: r.helpful || 0,
      verified: r.verified,
      isDb: true,
      _id: r._id,
      reply: r.reply || null,
    })),
    ...staticReviews
  ];

  const averageRating = allReviews.length
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : 0;
  const reviewCount = allReviews.length;

  const sortedReviews = [...allReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: allReviews.filter(r => r.rating === rating).length,
    percentage: allReviews.length ? (allReviews.filter(r => r.rating === rating).length / allReviews.length) * 100 : 0
  }));

  const handleSubmit = async () => {
    if (!form.comment.trim()) return alert('Please write a review');
    setSubmitting(true);
    try {
      const photos = [form.photo1, form.photo2, form.photo3].filter(Boolean);
      const res = await fetch(`${SERVER_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: String(productId),
          productName: productName || '',
          userName,
          userEmail,
          rating: form.rating,
          comment: form.comment,
          photos,
        })
      });
      const data = await res.json();
      if (data.success) {
        setDbReviews(prev => [data.review, ...prev]);
        setSubmitted(true);
        setShowForm(false);
        setForm({ rating: 5, comment: '', photo1: '', photo2: '', photo3: '' });
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error');
    }
    setSubmitting(false);
  };

  const handleHelpful = async (review) => {
    if (!review.isDb) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/reviews/${review._id}/helpful`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setDbReviews(prev => prev.map(r => r._id === review._id ? { ...r, helpful: data.helpful } : r));
      }
    } catch {}
  };

  return (
    <div className="reviews-section-wrapper">
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {/* Rating Summary */}
        {reviewCount > 0 && (
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
              {isLoggedIn
                ? <button className="write-review-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '✍️ Write a Review'}
                  </button>
                : <p style={{ fontSize: 13, color: '#888' }}>
                    <a href="#/login" style={{ color: '#e8471a' }}>Login</a> to write a review
                  </p>
              }
            </div>
          </div>
        )}

        {/* No reviews yet */}
        {reviewCount === 0 && (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
            {isLoggedIn
              ? <button className="write-review-btn" onClick={() => setShowForm(!showForm)}>Write a Review</button>
              : <p style={{ fontSize: 13, color: '#888' }}><a href="#/login" style={{ color: '#e8471a' }}>Login</a> to write a review</p>
            }
          </div>
        )}

        {/* Success message */}
        {submitted && (
          <div style={{ background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#15803d', fontSize: 14 }}>
            ✅ Your review has been submitted! Thank you.
          </div>
        )}

        {/* Review Form */}
        {showForm && isLoggedIn && (
          <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Write Your Review</h3>

            {/* Star Rating */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Rating</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => setForm({...form, rating: s})}
                    style={{ fontSize: 28, cursor: 'pointer', color: s <= form.rating ? '#FFA500' : '#ddd', transition: '.2s' }}>★</span>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience with this product..."
                value={form.comment}
                onChange={e => setForm({...form, comment: e.target.value})}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {/* Photo URLs */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Photo URLs (optional)</label>
              {['photo1','photo2','photo3'].map((key, i) => (
                <input key={key} type="text" placeholder={`Photo ${i+1} URL`}
                  value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 7, fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '11px 24px', fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviewCount > 0 && (
          <>
            <div className="reviews-header-bar">
              <h3>All Reviews ({reviewCount})</h3>
              <div className="sort-dropdown-wrapper">
                <label>Sort by:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="reviews-grid">
              {sortedReviews.map(review => (
                <div key={review.id || review._id} className="review-item">
                  <div className="review-top">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <div className="avatar-circle">{review.userName.charAt(0).toUpperCase()}</div>
                      </div>
                      <div className="reviewer-details">
                        <span className="reviewer-name">{review.userName}</span>
                        {review.verified && <span className="verified-tag">✓ Verified Purchase</span>}
                      </div>
                    </div>
                    <Rating rating={review.rating} size="small" />
                  </div>

                  <div className="review-date-text">
                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>

                  <p className="review-text">{review.comment}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="review-photos">
                      {review.photos.map((photo, index) => (
                        <div key={index} className="review-photo" onClick={() => window.open(photo, '_blank')}>
                          <img src={photo} alt={`Review photo ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="review-footer">
                    <button className="helpful-button" onClick={() => handleHelpful(review)}>
                      👍 Helpful ({review.helpful || 0})
                    </button>
                  </div>

                  {/* Admin Reply */}
                  {review.reply && (
                    <div className="brand-reply-box">
                      <div className="reply-top">
                        <div className="brand-avatar-circle">
                          <span style={{ fontSize: 18 }}>👟</span>
                        </div>
                        <div className="brand-details">
                          <div className="brand-name-row">
                            <span className="brand-name-text">New Balance</span>
                            <span className="official-badge">OFFICIAL RESPONSE</span>
                          </div>
                          <span className="reply-date-text">
                            {new Date(review.reply.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <p className="reply-text">{review.reply.comment}</p>
                    </div>
                  )}

                  {/* Static reviews replies */}
                  {review.replies && review.replies.map(reply => (
                    <div key={reply.id} className="brand-reply-box">
                      <div className="reply-top">
                        <div className="brand-avatar-circle">
                          <span style={{ fontSize: 18 }}>👟</span>
                        </div>
                        <div className="brand-details">
                          <div className="brand-name-row">
                            <span className="brand-name-text">New Balance</span>
                            <span className="official-badge">OFFICIAL RESPONSE</span>
                          </div>
                          <span className="reply-date-text">
                            {new Date(reply.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <p className="reply-text">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}