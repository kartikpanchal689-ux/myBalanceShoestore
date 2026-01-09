import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";   // ✅ import Link
import './HeroSlider.css';
import logo from '../assets/images/logo.png';
export default function HeroSlider() {
  useEffect(() => {
    const hero = document.querySelector(".product-slider-container");
    const handleScroll = () => {
      if (hero) {
        hero.style.backgroundPositionY = window.scrollY * 0.5 + "px";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="main-content">
      <div className="product-slider-container">
        <div className="hero-overlay">
          <h1 className="hero-title">Step Into STYLE!</h1>
          <p className="hero-subtitle">Discover our latest New Balance Collection</p>
          <button className="hero-btn">Shop Now</button>
        </div>
      </div>
    </main>
  );
}
