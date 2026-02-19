import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './HeroSlider.css';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Slide data with separate desktop and mobile images
  const slides = [
    {
      id: 1,
      category: "NEW ARRIVALS",
      title1: "MADE TO",
      title2: "MOVE.",
      subtitle: "Engineered for performance. Designed for life.",
      btnText: "SHOP RUNNING",
      btnLink: "/category/running",
      bgImage: "/myBalanceShoestore/images/MainPage.jpg",
      bgImageMobile: "/myBalanceShoestore/images/running1-mobile.jpg",
      bgColor: "#e8e8e8"
    },
    {
      id: 2,
      category: "LIFESTYLE",
      title1: "BORN TO",
      title2: "STAND OUT.",
      subtitle: "Iconic silhouettes for the everyday.",
      btnText: "SHOP LIFESTYLE",
      btnLink: "/category/lifestyle",
      bgImage: "/myBalanceShoestore/images/MainPage.jpg",
      bgImageMobile: "/myBalanceShoestore/images/lifestyle1-mobile.jpg",
      bgColor: "#ebebeb"
    },
    {
      id: 3,
      category: "PERFORMANCE",
      title1: "PUSH YOUR",
      title2: "LIMITS.",
      subtitle: "Gear up for every challenge.",
      btnText: "SHOP TRAINING",
      btnLink: "/category/training",
      bgImage: "/myBalanceShoestore/images/MainPage.jpg",
      bgImageMobile: "/myBalanceShoestore/images/training1-mobile.jpg",
      bgColor: "#e5e5e5"
    }
  ];

  // Detect window resize to switch images
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-slider-wrapper">
      <div className="hero-slider">
        
        {/* Slides */}
        {slides.map((slide, index) => {
          // Choose image based on screen size
          const bgImage = isMobile ? slide.bgImageMobile : slide.bgImage;
          
          return (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                backgroundColor: slide.bgColor
              }}
            >
              <div className="hero-content">
                <span className="hero-category">{slide.category}</span>
                <h1 className="hero-title">
                  <span className="title-line-1">{slide.title1}</span>
                  <span className="title-line-2">{slide.title2}</span>
                </h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-buttons">
                  <Link to={slide.btnLink} className="hero-btn primary">
                    {slide.btnText}
                  </Link>
                  <Link to="/products" className="hero-btn secondary">
                    VIEW ALL
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button className="slider-arrow prev" onClick={goToPrev} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="slider-arrow next" onClick={goToNext} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot Navigation */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}