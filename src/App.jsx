import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHeader from './modules/MainHeader';
import HeroSlider from './modules/HeroSlider';
import Category from './modules/Category';
import FeaturedSection from './modules/FeaturedSection';
import ShopNowGrid from './modules/ShopNowGrid';
import CTABanner from './modules/CTAbanner';
import Testimonials from './modules/Testimonials';
import Newsletters from './modules/Newsletters';
import Footer from './modules/Footer';
import ProductGrid from './modules/ProductGrid';
import Cart from './modules/Cart';
import Checkout from './modules/Checkout';
import Login from './modules/Login';
import { shopNowProducts, gridProducts } from './data/products';
import Register from './modules/Register';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => setCartItems([...cartItems, product]);

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div>
      <MainHeader
        cartCount={cartItems.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

    <Routes>
  <Route
    path=""
    element={
      <>
        <HeroSlider />
        <Category />
        <FeaturedSection products={[]} />
        <ShopNowGrid products={shopNowProducts} />
        <CTABanner />
        <Testimonials />
        <Newsletters />
        <ProductGrid products={gridProducts} />
        <Footer />
      </>
    }
  />
  <Route path="cart" element={<Cart items={cartItems} setItems={setCartItems} />} />
  <Route path="checkout" element={<Checkout total={total} />} />
  <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="register" element={<Register />} /> {/* ✅ lowercase and no slash */}
</Routes>

    </div>
  );
}

export default App;
