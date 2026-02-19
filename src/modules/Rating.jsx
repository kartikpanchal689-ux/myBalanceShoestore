// src/modules/Rating.jsx
import React from 'react';

export default function Rating({ rating, size = 'medium', showNumber = false, reviewCount = 0 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    small: { fontSize: '14px', gap: '2px' },
    medium: { fontSize: '18px', gap: '3px' },
    large: { fontSize: '24px', gap: '4px' }
  };
  
  const style = sizeClasses[size] || sizeClasses.medium;

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`full-${i}`} style={{ color: '#FFA500' }}>★</span>
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <span key="half" style={{ position: 'relative', color: '#FFA500' }}>
        <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>★</span>
        <span style={{ color: '#ddd' }}>★</span>
      </span>
    );
  }

  // Empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} style={{ color: '#ddd' }}>★</span>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: style.gap,
      fontSize: style.fontSize 
    }}>
      <div style={{ display: 'flex', gap: style.gap }}>
        {stars}
      </div>
      {showNumber && (
        <span style={{ 
          fontSize: size === 'small' ? '13px' : size === 'large' ? '18px' : '15px',
          color: '#666',
          marginLeft: '6px',
          fontWeight: '500'
        }}>
          {rating.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
}