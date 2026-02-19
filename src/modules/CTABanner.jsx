import React from "react";
import { Link } from "react-router-dom";
import "./CTABanner.css";

const CTABanner = () => {
  return (
    <section className="nb-cta">
      <div className="nb-cta__inner">
        <div className="nb-cta__text">
          <span className="nb-cta__label">LIMITED EDITION</span>
          <h2 className="nb-cta__title">Step Into<br />Your Best.</h2>
          <p className="nb-cta__sub">Discover premium performance footwear crafted for excellence.</p>
          <Link to="/category/running" className="nb-cta__btn">Shop Collection</Link>
        </div>
        <div className="nb-cta__decoration">
          <div className="nb-cta__circle"></div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;