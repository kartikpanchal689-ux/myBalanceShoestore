import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import profileIcon from '../assets/images/profileimg.jpg'; // 👈 add a profile icon image
import './HeroSlider.css';

export default function MainHeader({ cartCount, isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="ShoeStore Logo" className="logo" />
        <span className="brand-name">New Balance</span>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {isLoggedIn ? (
          <>
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/checkout">Checkout</Link>

            {/* 👇 Profile icon instead of logout */}
            <div className="profile-container">
              <img
                src={profileIcon}
                alt="Profile"
                className="profile-icon"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link to="/settings">Settings</Link>
                  <button onClick={onLogout}>Logout</button>
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
