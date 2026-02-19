import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="nb-footer">
      <div className="nb-footer__top">
        {/* Brand Column */}
        <div className="nb-footer__brand">
          <h2 className="nb-footer__logo">myBalance</h2>
          <p className="nb-footer__tagline">
            Premium footwear engineered for performance and crafted for style.
          </p>
          <div className="nb-footer__socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nb-footer__social">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="nb-footer__social">
              Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="nb-footer__social">
              Facebook
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="nb-footer__social">
              YouTube
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nb-footer__nav">
          <div className="nb-footer__col">
            <h5>SHOP</h5>
            <Link to="/category/running">Running</Link>
            <Link to="/category/lifestyle">Lifestyle</Link>
            <Link to="/category/training">Training</Link>
            <Link to="/category/accessories">Accessories</Link>
          </div>
          <div className="nb-footer__col">
            <h5>HELP</h5>
            <a href="#">Size Guide</a>
            <a href="#">Returns & Exchanges</a>
            <a href="#">Track Order</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="nb-footer__col">
            <h5>COMPANY</h5>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Sustainability</a>
            <a href="#">Press</a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="nb-footer__newsletter">
          <h5>STAY UPDATED</h5>
          <p>Get exclusive access to new drops and special offers.</p>
          <div className="nb-footer__form">
            <input type="email" placeholder="Your email address" />
            <button type="button">Go</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="nb-footer__bottom">
        <span>© 2025 myBalance. All rights reserved.</span>
        <div className="nb-footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}