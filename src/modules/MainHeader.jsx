import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './MainHeader.css';

export default function MainHeader({ cartCount, isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) setSearchQuery('');
  };

  const handleLogout = () => {
    setProfileOpen(false);
    localStorage.removeItem('userEmail');
    onLogout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/myBalanceShoestore/images/Headerlogo.png" alt="ShoeStore Logo" className="logo" />
        <span className="brand-name">New Balance</span>
      </div>

      {searchOpen && (
        <div className="search-overlay-nb">
          <form onSubmit={handleSearch} className="search-form-nb">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-nb"
            />
            <button type="button" onClick={() => setSearchQuery('')} className="clear-btn-nb">
              Clear
            </button>
          </form>
        </div>
      )}

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        <button onClick={toggleSearch} className="icon-btn" aria-label="Search">
          {searchOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/checkout">Checkout</Link>

            <div className="profile-container" ref={profileRef}>
              <img
                src="/myBalanceShoestore/images/ProfilePic.png"
                alt="Profile"
                className="profile-icon"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">My Account</div>
                  {userEmail && (
                    <div className="dropdown-email">{userEmail}</div>
                  )}
                  <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    Settings
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    My Orders
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
}