import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  const stats = [
    { number: '14+', label: 'Premium Products' },
    { number: '1000+', label: 'Happy Customers' },
    { number: '4', label: 'Categories' },
    { number: '100%', label: 'Authentic' },
  ];

  const values = [
    {
      icon: '⚡',
      title: 'Performance First',
      desc: 'Every product is engineered for peak performance, tested by athletes, trusted by professionals.',
    },
    {
      icon: '♻️',
      title: 'Sustainability',
      desc: 'We\'re committed to reducing our environmental impact with eco-friendly materials and practices.',
    },
    {
      icon: '🎯',
      title: 'Innovation',
      desc: 'Constantly pushing boundaries with cutting-edge technology and design excellence.',
    },
    {
      icon: '🤝',
      title: 'Community',
      desc: 'Building a community of passionate individuals who refuse to settle for anything less than the best.',
    },
  ];

  const timeline = [
    { year: '2020', event: 'Founded with a vision to bring premium New Balance footwear to India.' },
    { year: '2021', event: 'Expanded to 4 major categories and launched online platform.' },
    { year: '2023', event: 'Reached 1000+ satisfied customers across the country.' },
    { year: '2025', event: 'Continuing to grow and innovate with new collections every season.' },
  ];

  return (
    <div className="nb-about">
      {/* Hero Section */}
      <section className="nb-about-hero">
        <div className="nb-about-hero__content">
          <span className="nb-about-hero__label">WHO WE ARE</span>
          <h1 className="nb-about-hero__title">
            Built for Those<br />
            Who <span className="nb-about-hero__accent">Move Forward.</span>
          </h1>
          <p className="nb-about-hero__sub">
            We're not just selling shoes. We're empowering individuals to push their limits, 
            chase their dreams, and never settle for ordinary.
          </p>
        </div>
        <div className="nb-about-hero__decoration">
          <div className="nb-about-hero__circle"></div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="nb-about-stats">
        {stats.map((stat, i) => (
          <div key={i} className="nb-about-stat">
            <span className="nb-about-stat__number">{stat.number}</span>
            <span className="nb-about-stat__label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Story Section */}
      <section className="nb-about-story">
        <div className="nb-about-story__text">
          <span className="nb-about__label">OUR STORY</span>
          <h2 className="nb-about__title">More Than Just Footwear</h2>
          <p className="nb-about__para">
            Founded in 2020, myBalance started with a simple belief: everyone deserves access 
            to premium performance footwear. What began as a passion project has grown into 
            a trusted destination for athletes, fitness enthusiasts, and style-conscious individuals 
            across India.
          </p>
          <p className="nb-about__para">
            We carefully curate every product in our collection, ensuring it meets the highest 
            standards of quality, comfort, and performance. From running shoes engineered for 
            marathon runners to lifestyle sneakers that turn heads on city streets, we've got 
            something for everyone who refuses to compromise.
          </p>
          <Link to="/category/running" className="nb-about__cta">Explore Our Collection</Link>
        </div>
        <div className="nb-about-story__img">
          <img src="/myBalanceShoestore/images/shoes1.png" alt="Our Story" />
        </div>
      </section>

      {/* Values Grid */}
      <section className="nb-about-values">
        <div className="nb-about-values__header">
          <span className="nb-about__label">OUR VALUES</span>
          <h2 className="nb-about__title">What Drives Us</h2>
        </div>
        <div className="nb-about-values__grid">
          {values.map((value, i) => (
            <div key={i} className="nb-about-value-card">
              <span className="nb-about-value-card__icon">{value.icon}</span>
              <h3 className="nb-about-value-card__title">{value.title}</h3>
              <p className="nb-about-value-card__desc">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="nb-about-timeline">
        <div className="nb-about-timeline__header">
          <span className="nb-about__label">OUR JOURNEY</span>
          <h2 className="nb-about__title">The Road So Far</h2>
        </div>
        <div className="nb-about-timeline__track">
          {timeline.map((item, i) => (
            <div key={i} className="nb-about-timeline-item">
              <span className="nb-about-timeline-item__year">{item.year}</span>
              <div className="nb-about-timeline-item__dot"></div>
              <p className="nb-about-timeline-item__event">{item.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="nb-about-cta">
        <div className="nb-about-cta__content">
          <h2 className="nb-about-cta__title">Ready to Find Your Perfect Fit?</h2>
          <p className="nb-about-cta__sub">Join thousands of satisfied customers who've already made the switch.</p>
          <div className="nb-about-cta__btns">
            <Link to="/category/running" className="nb-btn-fill">Shop Now</Link>
            <Link to="/contact" className="nb-btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}