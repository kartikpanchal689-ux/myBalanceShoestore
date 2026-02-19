// src/data/Reviews.js
// Mock Reviews Database with Photos for MyBalance Store

const reviews = {
  // Running Category
  1: [ // NB Running Elite
    {
      id: 1,
      productId: 1,
      userName: "Sarah Johnson",
      userAvatar: "/myBalanceShoestore/images/avatar1.jpg",
      rating: 5,
      date: "2024-01-15",
      comment: "Best running shoes I've ever owned! The cushioning is incredible and they're super comfortable even on long runs. The quality is outstanding!",
      verified: true,
      helpful: 24,
      photos: [
        '/myBalanceShoestore/images/running1.jpg', // Placeholder - use your actual review photos
        '/myBalanceShoestore/images/running1.jpg',
        '/myBalanceShoestore/images/running1.jpg'
      ],
      replies: [
        {
          id: 1,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-01-16",
          comment: "Thank you for your wonderful feedback and photos, Sarah! We're thrilled to hear our Running Elite is serving you well. Happy running! 🏃‍♀️"
        }
      ]
    },
    {
      id: 2,
      productId: 1,
      userName: "Mike Chen",
      userAvatar: "/myBalanceShoestore/images/avatar2.jpg",
      rating: 4,
      date: "2024-01-10",
      comment: "Great shoes overall. Very comfortable and supportive. Took off one star because they run slightly small. I'd recommend going half a size up.",
      verified: true,
      helpful: 12,
      photos: [
        '/myBalanceShoestore/images/running1.jpg'
      ]
    },
    {
      id: 3,
      productId: 1,
      userName: "Emily Rodriguez",
      userAvatar: "/myBalanceShoestore/images/avatar3.jpg",
      rating: 5,
      date: "2024-01-05",
      comment: "Perfect for marathon training! I've put over 200 miles on these and they still feel great. Highly recommend!",
      verified: true,
      helpful: 18
    }
  ],

  2: [ // NB Speed Runner
    {
      id: 4,
      productId: 2,
      userName: "David Thompson",
      userAvatar: "/myBalanceShoestore/images/avatar4.jpg",
      rating: 5,
      date: "2024-01-20",
      comment: "Lightning fast! Perfect for speed workouts and races. The new color is amazing too! Here are some photos from my last 5K race.",
      verified: true,
      helpful: 15,
      photos: [
        '/myBalanceShoestore/images/running2.jpg',
        '/myBalanceShoestore/images/running2.jpg'
      ],
      replies: [
        {
          id: 2,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-01-21",
          comment: "We're so glad you're loving the new color and performance, David! Keep crushing those workouts! 💪"
        }
      ]
    },
    {
      id: 5,
      productId: 2,
      userName: "Lisa Park",
      userAvatar: "/myBalanceShoestore/images/avatar5.jpg",
      rating: 4,
      date: "2024-01-18",
      comment: "Very lightweight and responsive. Great for tempo runs! Love how they look too.",
      verified: true,
      helpful: 8,
      photos: [
        '/myBalanceShoestore/images/running2.jpg'
      ]
    }
  ],

  3: [ // NB Marathon Pro
    {
      id: 6,
      productId: 3,
      userName: "James Wilson",
      userAvatar: "/myBalanceShoestore/images/avatar6.jpg",
      rating: 5,
      date: "2024-01-22",
      comment: "Ran my first sub-3 hour marathon in these! The energy return is incredible. Worth every penny. Attaching photos from race day!",
      verified: true,
      helpful: 32,
      photos: [
        '/myBalanceShoestore/images/running3.jpg',
        '/myBalanceShoestore/images/running3.jpg',
        '/myBalanceShoestore/images/running3.jpg'
      ],
      replies: [
        {
          id: 3,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-01-23",
          comment: "Congratulations on your sub-3, James! That's an amazing achievement! 🎉 We're honored our Marathon Pro was part of your success!"
        }
      ]
    },
    {
      id: 7,
      productId: 3,
      userName: "Amanda Lee",
      userAvatar: "/myBalanceShoestore/images/avatar7.jpg",
      rating: 5,
      date: "2024-01-19",
      comment: "Worth every penny! These are professional-grade shoes that deliver on all fronts.",
      verified: true,
      helpful: 20
    }
  ],

  // Lifestyle Category
  7: [ // ABZORB 2000
    {
      id: 8,
      productId: 7,
      userName: "Chris Martinez",
      userAvatar: "/myBalanceShoestore/images/avatar8.jpg",
      rating: 5,
      date: "2024-01-25",
      comment: "The retro style is fire! So comfortable for everyday wear. Get tons of compliments. Here's how they look with different outfits!",
      verified: true,
      helpful: 28,
      photos: [
        '/myBalanceShoestore/images/lifestyle1.jpg',
        '/myBalanceShoestore/images/lifestyle1.jpg',
        '/myBalanceShoestore/images/lifestyle1.jpg'
      ],
      replies: [
        {
          id: 4,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-01-26",
          comment: "Love hearing that, Chris! The ABZORB 2000 is definitely a head-turner. Thanks for sharing those style photos! 😎"
        }
      ]
    },
    {
      id: 9,
      productId: 7,
      userName: "Rachel Kim",
      userAvatar: "/myBalanceShoestore/images/avatar9.jpg",
      rating: 4,
      date: "2024-01-23",
      comment: "Super stylish and comfortable. Wish there were more color options though! Still very happy with my purchase.",
      verified: true,
      helpful: 11
    }
  ],

  10: [ // 574 Core
    {
      id: 10,
      productId: 10,
      userName: "Tom Anderson",
      userAvatar: "/myBalanceShoestore/images/avatar10.jpg",
      rating: 5,
      date: "2024-01-28",
      comment: "Classic design, unbeatable price. These are my go-to daily shoes. Can't beat the value!",
      verified: true,
      helpful: 45
    },
    {
      id: 11,
      productId: 10,
      userName: "Jessica Brown",
      userAvatar: "/myBalanceShoestore/images/avatar11.jpg",
      rating: 5,
      date: "2024-01-27",
      comment: "I own these in 3 colors! Can't go wrong with the 574. They go with everything.",
      verified: true,
      helpful: 22,
      photos: [
        '/myBalanceShoestore/images/lifestyle4.jpg',
        '/myBalanceShoestore/images/lifestyle4.jpg'
      ]
    }
  ],

  // Training Category
  13: [ // NB CrossFit Pro
    {
      id: 12,
      productId: 13,
      userName: "Marcus Johnson",
      userAvatar: "/myBalanceShoestore/images/avatar12.jpg",
      rating: 5,
      date: "2024-01-30",
      comment: "Perfect for CrossFit! Stable for lifts and comfortable for metcons. These shoes can handle anything I throw at them.",
      verified: true,
      helpful: 19,
      photos: [
        '/myBalanceShoestore/images/training1.webp',
        '/myBalanceShoestore/images/training1.webp'
      ],
      replies: [
        {
          id: 5,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-01-31",
          comment: "That's exactly what we designed them for, Marcus! Keep crushing those WODs! 💪"
        }
      ]
    },
    {
      id: 13,
      productId: 13,
      userName: "Nina Patel",
      userAvatar: "/myBalanceShoestore/images/avatar13.jpg",
      rating: 4,
      date: "2024-01-29",
      comment: "Great training shoes. Very versatile for different workouts. Love the stability!",
      verified: true,
      helpful: 14
    }
  ],

  // Accessories
  17: [ // NB Sports Socks
    {
      id: 14,
      productId: 17,
      userName: "Kevin Lee",
      userAvatar: "/myBalanceShoestore/images/avatar14.jpg",
      rating: 5,
      date: "2024-02-01",
      comment: "Best athletic socks I've tried. No blisters, stay in place perfectly. Buying more!",
      verified: true,
      helpful: 9
    }
  ],

  18: [ // NB Running Cap
    {
      id: 15,
      productId: 18,
      userName: "Lauren Smith",
      userAvatar: "/myBalanceShoestore/images/avatar15.jpg",
      rating: 5,
      date: "2024-02-02",
      comment: "Lightweight and breathable. Perfect for hot summer runs! The fit is great too.",
      verified: true,
      helpful: 7,
      replies: [
        {
          id: 6,
          author: "New Balance",
          authorRole: "brand",
          avatar: "/myBalanceShoestore/images/nb-logo.jpg",
          date: "2024-02-03",
          comment: "Stay cool out there, Lauren! Thanks for choosing New Balance! ☀️"
        }
      ]
    }
  ]
};

// Calculate average rating for a product
export const getAverageRating = (productId) => {
  const productReviews = reviews[productId] || [];
  if (productReviews.length === 0) return 0;
  
  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / productReviews.length).toFixed(1);
};

// Get review count for a product
export const getReviewCount = (productId) => {
  return (reviews[productId] || []).length;
};

// Get reviews for a product
export const getProductReviews = (productId) => {
  return reviews[productId] || [];
};

// Get all reviews sorted by date
export const getAllReviews = () => {
  return Object.values(reviews).flat().sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};

export default reviews;