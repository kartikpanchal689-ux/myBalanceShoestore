import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getSocket, disconnectSocket } from './socket';
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
import Orders from './modules/Orders';
import { shopNowProducts, gridProducts } from './data/products';

const SERVER_URL = "https://mybalanceshoestore.onrender.com";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('recentlyViewed');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const cartSyncTimer = useRef(null);
  const cartLoaded = useRef(false);
  const isSyncing = useRef(false);

  // Load cart from DB only once on login
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail || !isLoggedIn || cartLoaded.current) return;
    cartLoaded.current = true;
    isSyncing.current = true;
    fetch(`${SERVER_URL}/api/cart/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.items.length > 0) {
          setCartItems(data.items);
          localStorage.setItem('cartItems', JSON.stringify(data.items));
        }
      })
      .catch(err => console.error("Failed to load cart:", err))
      .finally(() => {
        setTimeout(() => { isSyncing.current = false; }, 500);
      });
  }, [isLoggedIn]);

  // Save cart to localStorage always, sync to DB only when user changes it
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Don't sync to DB during initial load
    if (isSyncing.current) return;
    if (!isLoggedIn) return;
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    if (cartSyncTimer.current) clearTimeout(cartSyncTimer.current);
    cartSyncTimer.current = setTimeout(() => {
      fetch(`${SERVER_URL}/api/cart/${userEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems })
      }).catch(err => console.error("Cart sync failed:", err));
    }, 1000);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // SSE for order sync only
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (isLoggedIn && userEmail) {
      getSocket(userEmail, (event) => {
        console.log('Sync event received:', event);
        if (event.type === 'ORDER_PLACED' || event.type === 'ORDER_CANCELLED') {
          window.dispatchEvent(new CustomEvent('ordersUpdated'));
        }
      });
    } else {
      disconnectSocket();
    }
  }, [isLoggedIn]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

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

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    cartLoaded.current = false;
    isSyncing.current = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    disconnectSocket();
  };

  return (
    <div>
      <MainHeader
        cartCount={cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
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
        <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
        <Route path="/category/:category" element={<CategoryPage addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} addToRecentlyViewed={addToRecentlyViewed} />} />
        <Route path="/search" element={<SearchResults addToCart={addToCart} addToSearchHistory={addToSearchHistory} searchHistory={searchHistory} />} />
        <Route path="/cart" element={<Cart items={cartItems} setItems={setCartItems} />} />
        <Route path="/checkout" element={<Checkout total={total} items={cartItems} setCartItems={setCartItems} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;