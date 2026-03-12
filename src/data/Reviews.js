// src/data/Reviews.js
// Static Reviews Database for MyBalance Store

const reviews = {
  1: [
    {
      id: 1,
      productId: 1,
      userName: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment: "Best running shoes I've ever owned! The cushioning is incredible and they're super comfortable even on long runs.",
      verified: true,
      helpful: 24,
      photos: ['/myBalanceShoestore/images/running1.jpg'],
      replies: [
        {
          id: 1,
          author: "New Balance",
          date: "2024-01-16",
          comment: "Thank you for your wonderful feedback, Sarah! We're thrilled to hear our Running Elite is serving you well. Happy running! 🏃‍♀️"
        }
      ]
    },
    {
      id: 2,
      productId: 1,
      userName: "Mike Chen",
      rating: 4,
      date: "2024-01-10",
      comment: "Great shoes overall. Very comfortable and supportive. Took off one star because they run slightly small.",
      verified: true,
      helpful: 12,
    },
  ],
  2: [
    {
      id: 3,
      productId: 2,
      userName: "David Thompson",
      rating: 5,
      date: "2024-01-20",
      comment: "Lightning fast! Perfect for speed workouts and races.",
      verified: true,
      helpful: 15,
    },
  ],
  3: [
    {
      id: 4,
      productId: 3,
      userName: "James Wilson",
      rating: 5,
      date: "2024-01-22",
      comment: "Ran my first sub-3 hour marathon in these! The energy return is incredible.",
      verified: true,
      helpful: 32,
      replies: [
        {
          id: 2,
          author: "New Balance",
          date: "2024-01-23",
          comment: "Congratulations on your sub-3, James! That's an amazing achievement! 🎉"
        }
      ]
    },
  ],
  7: [
    {
      id: 5,
      productId: 7,
      userName: "Chris Martinez",
      rating: 5,
      date: "2024-01-25",
      comment: "The retro style is fire! So comfortable for everyday wear.",
      verified: true,
      helpful: 28,
    },
  ],
  10: [
    {
      id: 6,
      productId: 10,
      userName: "Tom Anderson",
      rating: 5,
      date: "2024-01-28",
      comment: "Classic design, unbeatable price. These are my go-to daily shoes.",
      verified: true,
      helpful: 45,
    },
  ],
  13: [
    {
      id: 7,
      productId: 13,
      userName: "Marcus Johnson",
      rating: 5,
      date: "2024-01-30",
      comment: "Perfect for CrossFit! Stable for lifts and comfortable for metcons.",
      verified: true,
      helpful: 19,
      replies: [
        {
          id: 3,
          author: "New Balance",
          date: "2024-01-31",
          comment: "That's exactly what we designed them for, Marcus! Keep crushing those WODs! 💪"
        }
      ]
    },
  ],
};

export const getProductReviews = (productId) => {
  return reviews[productId] || [];
};

export const getAverageRating = (productId) => {
  const productReviews = reviews[productId] || [];
  if (productReviews.length === 0) return 0;
  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / productReviews.length).toFixed(1);
};

export const getReviewCount = (productId) => {
  return (reviews[productId] || []).length;
};

export const getAllReviews = () => {
  return Object.values(reviews).flat().sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default reviews;