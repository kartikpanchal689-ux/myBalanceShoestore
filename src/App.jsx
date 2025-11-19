import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeroSlider from './modules/HeroSlider';
import Category from './modules/Category';
import FeaturedSection from './modules/FeaturedSection';
import ShopNowGrid from "./modules/ShopNowGrid";
import CTABanner from './modules/CTAbanner';

const allProducts = [
  { name: "NB Running Elite", price: 150, image: "/images/shoes1.png" },
  { name: "NB Lifestyle Classic", price: 120, image: "/images/lifestyleClassic.png" },
  { name: "NB Training Pro", price: 130, image: "/images/shoes3.png" },
  { name: "NB Staple Tee", price: 45, image: "/images/stapleTee.png" },
];

const featuredProducts = [
  {
    name: "NB Running Elite",
    tagline: "Best for Marathon Training",
    price: 150,
    image: "/images/feature1.png",
  },
  {
    name: "NB Lifestyle Classic",
    tagline: "Comfort Meets Style",
    price: 120,
    image: "/images/feature2.png",
  },
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <HeroSlider/>
      <Category/>
      <FeaturedSection products={featuredProducts} />
      <ShopNowGrid products={allProducts} />
      <CTABanner/>
    </div>
    </>
  )
}

export default App
