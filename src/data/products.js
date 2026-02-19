// src/data/products.js
// Complete Products Database for MyBalance Store with Multiple Images

const products = [
  // ========================================
  // RUNNING CATEGORY
  // ========================================
  {
    id: 1,
    name: 'NB Running Elite',
    category: 'Running',
    price: '$150',
    image: '/myBalanceShoestore/images/running1-white-1.webp',
    images: [
      '/myBalanceShoestore/images/running1.jpg',
      '/myBalanceShoestore/images/running1.jpg', // Placeholder - add your actual images
      '/myBalanceShoestore/images/running1.jpg',
      '/myBalanceShoestore/images/running1.jpg'
    ],
    description: 'Elite running shoes with advanced cushioning.',
    colors: ['White', 'BLACK with CASTLEROCK', 'RAIN CLOUD with CASTLEROCK and White'],
    colorImages: {
    'White': [
      '/myBalanceShoestore/images/running1-white-1.webp',
      '/myBalanceShoestore/images/running1-white-2.webp',
      '/myBalanceShoestore/images/running1-white-3.webp',
      '/myBalanceShoestore/images/running1-white-4.webp',
      '/myBalanceShoestore/images/running1-white-5.webp',
      '/myBalanceShoestore/images/running1-white-6.webp'
    ],
    'BLACK with CASTLEROCK': [
      '/myBalanceShoestore/images/running1-blackCastleRock-1.webp',
      '/myBalanceShoestore/images/running1-blackCastleRock-2.webp',
      '/myBalanceShoestore/images/running1-blackCastleRock-3.webp',
      '/myBalanceShoestore/images/running1-blackCastleRock-4.webp',
      '/myBalanceShoestore/images/running1-blackCastleRock-5.webp',
      '/myBalanceShoestore/images/running1-blackCastleRock-6.webp'
    ],
    'RAIN CLOUD with CASTLEROCK and White': [
      '/myBalanceShoestore/images/running1-rainCastleRock-1.webp',
      '/myBalanceShoestore/images/running1-rainCastleRock-2.webp',
      '/myBalanceShoestore/images/running1-rainCastleRock-3.webp',
      '/myBalanceShoestore/images/running1-rainCastleRock-4.webp',
      '/myBalanceShoestore/images/running1-rainCastleRock-5.webp',
      '/myBalanceShoestore/images/running1-rainCastleRock-6.webp',
    ]
  },
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: false,
    badge: null
  },
  {
    id: 2,
    name: 'NB Speed Runner',
    category: 'Running',
    price: 130,
    image: '/myBalanceShoestore/images/running2.jpg',
    images: [
      '/myBalanceShoestore/images/running2.jpg',
      '/myBalanceShoestore/images/running2.jpg',
      '/myBalanceShoestore/images/running2.jpg',
      '/myBalanceShoestore/images/running2.jpg'
    ],
    description: 'Lightweight shoes for speed training.',
    colors: ['Blue', 'Black', 'Gray'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: true,
    badge: 'New color'
  },
  {
    id: 3,
    name: 'NB Marathon Pro',
    category: 'Running',
    price: 180,
    image: '/myBalanceShoestore/images/running3.jpg',
    images: [
      '/myBalanceShoestore/images/running3.jpg',
      '/myBalanceShoestore/images/running3.jpg',
      '/myBalanceShoestore/images/running3.jpg',
      '/myBalanceShoestore/images/running3.jpg'
    ],
    description: 'Professional marathon running shoes.',
    colors: ['Black', 'Orange', 'White'],
    sizes: ['8', '9', '10', '11', '12'],
    isNew: false,
    badge: 'NB Exclusive'
  },
  {
    id: 4,
    name: 'Fresh Foam 1080',
    category: 'Running',
    price: 165,
    image: '/myBalanceShoestore/images/running4.jpg',
    images: [
      '/myBalanceShoestore/images/running4.jpg',
      '/myBalanceShoestore/images/running4.jpg',
      '/myBalanceShoestore/images/running4.jpg'
    ],
    description: 'Premium cushioned running experience.',
    colors: ['Navy', 'Gray', 'Green'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    isNew: false,
    badge: null
  },
  {
    id: 5,
    name: '860v13',
    category: 'Running',
    price: 140,
    image: '/myBalanceShoestore/images/running5.jpg',
    images: [
      '/myBalanceShoestore/images/running5.jpg',
      '/myBalanceShoestore/images/running5.jpg',
      '/myBalanceShoestore/images/running5.jpg'
    ],
    description: 'Stability running shoe for overpronators.',
    colors: ['Black', 'Blue', 'Silver'],
    sizes: ['7', '8', '9', '10', '11'],
    isNew: false,
    badge: null
  },
  {
    id: 6,
    name: 'FuelCell Rebel',
    category: 'Running',
    price: 135,
    image: '/myBalanceShoestore/images/running6.jpg',
    images: [
      '/myBalanceShoestore/images/running6.jpg',
      '/myBalanceShoestore/images/running6.jpg',
      '/myBalanceShoestore/images/running6.jpg'
    ],
    description: 'Fast and responsive for tempo runs.',
    colors: ['Orange', 'Black', 'White'],
    sizes: ['8', '9', '10', '11', '12'],
    isNew: true,
    badge: null
  },

  // ========================================
  // LIFESTYLE CATEGORY
  // ========================================
  {
    id: 7,
    name: 'ABZORB 2000',
    category: 'Lifestyle',
    price: 169.99,
    image: '/myBalanceShoestore/images/lifestyle1.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle1.jpg',
      '/myBalanceShoestore/images/lifestyle1.jpg',
      '/myBalanceShoestore/images/lifestyle1.jpg',
      '/myBalanceShoestore/images/lifestyle1.jpg'
    ],
    description: 'Retro style with modern comfort.',
    colors: ['Silver', 'Black', 'White'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: true,
    badge: 'New color'
  },
  {
    id: 8,
    name: '2010',
    category: 'Lifestyle',
    price: 159.99,
    image: '/myBalanceShoestore/images/lifestyle2.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle2.jpg',
      '/myBalanceShoestore/images/lifestyle2.jpg',
      '/myBalanceShoestore/images/lifestyle2.jpg'
    ],
    description: 'Classic 2000s silhouette.',
    colors: ['Blue', 'Gray', 'White'],
    sizes: ['7', '8', '9', '10', '11'],
    isNew: false,
    badge: 'NB Exclusive'
  },
  {
    id: 9,
    name: '204L',
    category: 'Lifestyle',
    price: 119.99,
    image: '/myBalanceShoestore/images/lifestyle3.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle3.jpg',
      '/myBalanceShoestore/images/lifestyle3.jpg',
      '/myBalanceShoestore/images/lifestyle3.jpg'
    ],
    description: 'Sporty lifestyle sneaker.',
    colors: ['White', 'Blue', 'Gum'],
    sizes: ['8', '9', '10', '11', '12'],
    isNew: false,
    badge: 'NB Exclusive'
  },
  {
    id: 10,
    name: '574 Core',
    category: 'Lifestyle',
    price: 89.99,
    image: '/myBalanceShoestore/images/lifestyle4.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle4.jpg',
      '/myBalanceShoestore/images/lifestyle4.jpg',
      '/myBalanceShoestore/images/lifestyle4.jpg',
      '/myBalanceShoestore/images/lifestyle4.jpg'
    ],
    description: 'Iconic 574 design.',
    colors: ['Navy', 'Gray', 'Black', 'Burgundy'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: false,
    badge: null
  },
  {
    id: 11,
    name: '990v6',
    category: 'Lifestyle',
    price: 199.99,
    image: '/myBalanceShoestore/images/lifestyle5.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle5.jpg',
      '/myBalanceShoestore/images/lifestyle5.jpg',
      '/myBalanceShoestore/images/lifestyle5.jpg'
    ],
    description: 'Made in USA premium lifestyle shoe.',
    colors: ['Gray', 'Navy', 'Black'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: false,
    badge: 'NB Exclusive'
  },
  {
    id: 12,
    name: '327',
    category: 'Lifestyle',
    price: 99.99,
    image: '/myBalanceShoestore/images/lifestyle6.jpg',
    images: [
      '/myBalanceShoestore/images/lifestyle6.jpg',
      '/myBalanceShoestore/images/lifestyle6.jpg',
      '/myBalanceShoestore/images/lifestyle6.jpg'
    ],
    description: '70s-inspired retro runner.',
    colors: ['Yellow', 'Orange', 'Blue', 'Green'],
    sizes: ['7', '8', '9', '10', '11'],
    isNew: true,
    badge: null
  },

  // ========================================
  // TRAINING CATEGORY
  // ========================================
  {
    id: 13,
    name: 'NB CrossFit Pro',
    category: 'Training',
    price: 120,
    image: '/myBalanceShoestore/images/training1.webp',
    images: [
      '/myBalanceShoestore/images/training1.webp',
      '/myBalanceShoestore/images/training1.webp',
      '/myBalanceShoestore/images/training1.webp'
    ],
    description: 'Versatile training shoes for the gym.',
    colors: ['Black', 'Red', 'White'],
    sizes: ['8', '9', '10', '11', '12'],
    isNew: false,
    badge: null
  },
  {
    id: 14,
    name: 'NB Trainer X',
    category: 'Training',
    price: 110,
    image: '/myBalanceShoestore/images/training2.webp',
    images: [
      '/myBalanceShoestore/images/training2.webp',
      '/myBalanceShoestore/images/training2.webp',
      '/myBalanceShoestore/images/training2.webp'
    ],
    description: 'Stability for intense workouts.',
    colors: ['Gray', 'Blue', 'Black'],
    sizes: ['7', '8', '9', '10', '11'],
    isNew: false,
    badge: null
  },
  {
    id: 15,
    name: 'Minimus Trainer',
    category: 'Training',
    price: 95,
    image: '/myBalanceShoestore/images/training3.webp',
    images: [
      '/myBalanceShoestore/images/training3.webp',
      '/myBalanceShoestore/images/training3.webp'
    ],
    description: 'Minimalist training shoe.',
    colors: ['Black', 'White'],
    sizes: ['8', '9', '10', '11', '12'],
    isNew: false,
    badge: null
  },
  {
    id: 16,
    name: 'FuelCell Trainer',
    category: 'Training',
    price: 115,
    image: '/myBalanceShoestore/images/training4.webp',
    images: [
      '/myBalanceShoestore/images/training4.webp',
      '/myBalanceShoestore/images/training4.webp',
      '/myBalanceShoestore/images/training4.webp'
    ],
    description: 'Energy return for high-intensity training.',
    colors: ['Red', 'Black', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: true,
    badge: 'New color'
  },

  // ========================================
  // ACCESSORIES CATEGORY
  // ========================================
  {
    id: 17,
    name: 'NB Sports Socks 3-Pack',
    category: 'Accessories',
    price: 15,
    image: '/myBalanceShoestore/images/socks.webp',
    images: [
      '/myBalanceShoestore/images/socks.webp',
      '/myBalanceShoestore/images/socks.webp'
    ],
    description: 'Comfortable athletic socks.',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    badge: null
  },
  {
    id: 18,
    name: 'NB Running Cap',
    category: 'Accessories',
    price: 25,
    image: '/myBalanceShoestore/images/cap.webp',
    images: [
      '/myBalanceShoestore/images/cap.webp',
      '/myBalanceShoestore/images/cap.webp'
    ],
    description: 'Breathable running cap.',
    colors: ['Black', 'Navy', 'Red', 'White'],
    sizes: ['One Size'],
    isNew: true,
    badge: null
  },
  {
    id: 19,
    name: 'NB Sport Backpack',
    category: 'Accessories',
    price: 45,
    image: '/myBalanceShoestore/images/backpack.webp',
    images: [
      '/myBalanceShoestore/images/backpack.webp',
      '/myBalanceShoestore/images/backpack.webp'
    ],
    description: 'Spacious gym backpack.',
    colors: ['Black', 'Navy', 'Gray'],
    sizes: ['One Size'],
    isNew: false,
    badge: null
  },
  {
    id: 20,
    name: 'NB Water Bottle',
    category: 'Accessories',
    price: 12,
    image: '/myBalanceShoestore/images/bottle.webp',
    images: [
      '/myBalanceShoestore/images/bottle.webp',
      '/myBalanceShoestore/images/bottle.webp'
    ],
    description: 'BPA-free sports water bottle.',
    colors: ['Clear', 'Black', 'Blue'],
    sizes: ['750ml'],
    isNew: false,
    badge: null
  },
  {
    id: 21,
    name: 'NB Wristbands Pair',
    category: 'Accessories',
    price: 8,
    image: '/myBalanceShoestore/images/wristbands.jpg',
    images: [
      '/myBalanceShoestore/images/wristbands.jpg'
    ],
    description: 'Sweat-absorbing wristbands.',
    colors: ['White', 'Black', 'Red'],
    sizes: ['One Size'],
    isNew: false,
    badge: null
  },
  {
    id: 22,
    name: 'NB Performance Shirt',
    category: 'Accessories',
    price: 35,
    image: '/myBalanceShoestore/images/shirt.webp',
    images: [
      '/myBalanceShoestore/images/shirt.webp',
      '/myBalanceShoestore/images/shirt.webp'
    ],
    description: 'Moisture-wicking athletic shirt.',
    colors: ['Black', 'White', 'Navy', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    badge: 'New color'
  }
];

// ========================================
// HELPER EXPORTS
// ========================================

// For homepage featured products
export const shopNowProducts = products.slice(0, 4);

// For homepage grid
export const gridProducts = products.slice(0, 8);

// Filter by category
export const getProductsByCategory = (categoryName) => {
  return products.filter(p => 
    p.category.toLowerCase() === categoryName.toLowerCase()
  );
};

// Get unique categories
export const getCategories = () => {
  return [...new Set(products.map(p => p.category))];
};

// Search products
export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.description?.toLowerCase().includes(lowercaseQuery)
  );
};

// Default export
export default products;