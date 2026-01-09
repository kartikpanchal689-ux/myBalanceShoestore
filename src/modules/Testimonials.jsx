// src/modules/Testimonials.jsx
import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    { name: "Amit", text: "Amazing shoes, super comfortable!", rating: 3 },
    { name: "Priya", text: "Stylish and durable, worth the price.", rating: 5 },
    { name: "Rahul", text: "Fast delivery and great quality.", rating: 5 },
  ];

  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>
      <div className="reviews">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <p>"{r.text}"</p>
            <span>- {r.name}</span>
            <div>{"⭐".repeat(r.rating)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
