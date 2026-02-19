import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHeader from './modules/MainHeader';
import HeroSlider from './modules/HeroSlider';
import Category from './modules/Category';
import FeaturedSection from './modules/FeaturedSection';
import ShopNowGrid from './modules/ShopNowGrid';
import CTABanner from './modules/CTAbanner';
import Testimonials from './modules/Testimonials';
import Footer from './modules/Footer';
import About from './modules/About';
import Contact from './modules/Contact';
import ProductDetail from './modules/ProductDetail';
import CategoryPage from './modules/CategoryPage';
import SearchResults from './modules/SearchResult';
import Cart from './modules/Cart';
import Checkout from './modules/Checkout';
import Login from './modules/Login';
import Register from './modules/Register';
import ProductsPage from './modules/ProductsPage';
import { shopNowProducts, gridProducts } from './data/products';


function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div>
      <MainHeader
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <Category />
              <FeaturedSection products={gridProducts.slice(0, 3)} addToCart={addToCart} />
              <ShopNowGrid products={shopNowProducts} addToCart={addToCart} />
              <CTABanner />
              <Testimonials />
              <Footer />
            </>
          }
        />

        <Route
          path="/products"
          element={<ProductsPage addToCart={addToCart} />}
        />

        <Route
          path="/category/:category"
          element={<CategoryPage addToCart={addToCart} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} />}
        />
        <Route
          path="/search"
          element={<SearchResults addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={<Cart items={cartItems} setItems={setCartItems} />}
        />
        <Route
          path="/checkout"
          element={<Checkout total={total} items={cartItems} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
         path="/about" 
         element={<About />} />
        <Route
         path="/contact" 
         element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;