import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      detail: 'support@mybalance.com',
      link: 'mailto:support@mybalance.com',
    },
    {
      icon: '📞',
      title: 'Call Us',
      detail: '+91 9876543210',
      link: 'tel:+919876543210',
    },
    {
      icon: '📍',
      title: 'Visit Us',
      detail: 'Mumbai, Maharashtra, India',
      link: '#',
    },
    {
      icon: '⏰',
      title: 'Working Hours',
      detail: 'Mon-Sat: 10AM - 8PM',
      link: '#',
    },
  ];

  const faqs = [
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day return policy on all unworn products with original packaging.',
    },
    {
      q: 'Do you ship nationwide?',
      a: 'Yes! We ship to all major cities across India with free shipping on orders above ₹2,999.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once shipped, you\'ll receive a tracking number via email to monitor your delivery.',
    },
    {
      q: 'Are your products authentic?',
      a: '100% authentic New Balance products. We source directly from authorized distributors.',
    },
  ];

  return (
    <div className="nb-contact">
      {/* Hero */}
      <section className="nb-contact-hero">
        <div className="nb-contact-hero__content">
          <span className="nb-contact-hero__label">GET IN TOUCH</span>
          <h1 className="nb-contact-hero__title">
            Let's Start a<br />
            <span className="nb-contact-hero__accent">Conversation.</span>
          </h1>
          <p className="nb-contact-hero__sub">
            Have questions? Need help? Want to share feedback? We're here for you. 
            Drop us a message and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="nb-contact-info">
        <div className="nb-contact-info__grid">
          {contactInfo.map((info, i) => (
            <a
              key={i}
              href={info.link}
              className="nb-contact-info-card"
              onClick={info.link === '#' ? (e) => e.preventDefault() : null}
            >
              <span className="nb-contact-info-card__icon">{info.icon}</span>
              <h3 className="nb-contact-info-card__title">{info.title}</h3>
              <p className="nb-contact-info-card__detail">{info.detail}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + Quick Links */}
      <section className="nb-contact-main">
        <div className="nb-contact-main__container">
          {/* Form */}
          <div className="nb-contact-form-wrap">
            <div className="nb-contact-form__header">
              <span className="nb-contact__label">SEND MESSAGE</span>
              <h2 className="nb-contact__title">Get in Touch</h2>
              <p className="nb-contact__para">
                Fill out the form below and our team will respond as soon as possible.
              </p>
            </div>

            <form className="nb-contact-form" onSubmit={handleSubmit}>
              <div className="nb-form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="nb-form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="nb-form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div className="nb-form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more..."
                ></textarea>
              </div>

              <button type="submit" className="nb-contact-form__btn">
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="nb-contact-sidebar">
            <div className="nb-contact-quick">
              <h3 className="nb-contact-quick__title">Quick Links</h3>
              <Link to="/category/running" className="nb-contact-quick__link">
                Shop Running Shoes
              </Link>
              <Link to="/category/lifestyle" className="nb-contact-quick__link">
                Shop Lifestyle
              </Link>
              <Link to="/cart" className="nb-contact-quick__link">
                View Cart
              </Link>
              <Link to="/about" className="nb-contact-quick__link">
                About Us
              </Link>
            </div>

            <div className="nb-contact-social">
              <h3 className="nb-contact-social__title">Follow Us</h3>
              <div className="nb-contact-social__links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="nb-contact-faq">
        <div className="nb-contact-faq__header">
          <span className="nb-contact__label">FAQ</span>
          <h2 className="nb-contact__title">Frequently Asked Questions</h2>
        </div>

        <div className="nb-contact-faq__grid">
          {faqs.map((faq, i) => (
            <div key={i} className="nb-contact-faq-item">
              <h4 className="nb-contact-faq-item__q">{faq.q}</h4>
              <p className="nb-contact-faq-item__a">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}