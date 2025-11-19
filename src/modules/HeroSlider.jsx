import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import logo from '../assets/images/logo.png';

export default function HeroSlider() {
  const [menuOpen, setMenuOpen] = useState(false);

  // 👇 Parallax effect
  useEffect(() => {
    const hero = document.querySelector(".product-slider-container");

    const handleScroll = () => {
      if (hero) {
        hero.style.backgroundPositionY = window.scrollY * 0.5 + "px";
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER SECTION */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="ShoeStore Logo" className="logo" />
          <span className="brand-name">New Balance</span>
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="main-content">
        <div className="product-slider-container">
          <div className="hero-overlay">
            <h1 className="hero-title">Step Into STYLE!</h1>
            <p className="hero-subtitle">Discover our latest New Balance Collection</p>
            <button className="hero-btn">Shop Now</button>
          </div>
        </div>
      </main>
    </>
  );
}
