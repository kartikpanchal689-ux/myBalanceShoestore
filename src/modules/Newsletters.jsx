// src/modules/Newsletter.jsx
import './Newsletters.css';
export default function Newsletters() {
  return (
    <section className="newsletter">
      <h2>Stay Updated</h2>
      <p>Subscribe to get the latest offers and product updates.</p>
      <form>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}
