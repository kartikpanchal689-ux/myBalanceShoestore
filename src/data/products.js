const allProducts = [
  {
    id: 1,
    name: "NB Running Elite",
    price: 150,
    image: "/myBalanceShoestore/images/shoes1.png",
    description: "Elite running shoes with advanced cushioning.",
    category: "Shoes"
  },
  {
    id: 2,
    name: "NB Lifestyle Classic",
    price: 120,
    image: "/myBalanceShoestore/images/lifestyleClassic.png",
    description: "Stylish and comfortable for everyday wear.",
    category: "Lifestyle"
  },
  {
    id: 3,
    name: "NB Training Pro",
    price: 130,
    image: "/myBalanceShoestore/images/shoes3.png",
    description: "Pro-level training shoes.",
    category: "Shoes"
  },
  {
    id: 4,
    name: "NB Staple Tee",
    price: 45,
    image: "/myBalanceShoestore/images/stapleTee.png",
    description: "Soft cotton tee for casual comfort.",
    category: "Lifestyle"
  },
  {
    id: 5,
    name: "NB Training Pro",
    price: 130,
    image: "/myBalanceShoestore/images/Footershoe.png",
    description: "Pro-level training shoes.",
    category: "Shoes"
  },
  {
    id: 6,
    name: "NB Training Pro",
    price: 130,
    image: "/myBalanceShoestore/images/FooterTee.png",
    description: "Pro-level training shoes.",
    category: "Shoes"
  },
  {
    id: 7,
    name: "NB Training Pro",
    price: 130,
    image: "/myBalanceShoestore/images/Footershoes1.png",
    description: "Pro-level training shoes.",
    category: "Shoes"
  },
  {
    id: 8,
    name: "NB Training Pro",
    price: 130,
    image: "/myBalanceShoestore/images/FooterTee1.png",
    description: "Pro-level training shoes.",
    category: "Shoes"
  },
];

export const shopNowProducts = allProducts.slice(0, 4); // First 2 items
export const gridProducts = allProducts.slice(4);       // Remaining 2 items
export default allProducts;
