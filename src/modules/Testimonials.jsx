import './Testimonials.css';

export default function Testimonials() {
  const reviews = [
    { name: "Amit K.", text: "Best running shoes I've ever owned. The comfort is unmatched!", rating: 5, location: "Mumbai" },
    { name: "Priya S.", text: "Stylish, durable, and worth every rupee. Highly recommended.", rating: 5, location: "Delhi" },
    { name: "Rahul M.", text: "Fast delivery and excellent quality. Will buy again!", rating: 4, location: "Bangalore" },
  ];

  return (
    <section className="nb-testimonials">
      <div className="nb-testimonials__header">
        <p className="nb-testimonials__label">CUSTOMER REVIEWS</p>
        <h2 className="nb-testimonials__title">What Our Customers Say</h2>
      </div>

      <div className="nb-testimonials__grid">
        {reviews.map((r, i) => (
          <div key={i} className="nb-testimonial-card">
            <div className="nb-testimonial-card__stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className={idx < r.rating ? 'star-filled' : 'star-empty'}>
                  ★
                </span>
              ))}
            </div>
            <p className="nb-testimonial-card__text">"{r.text}"</p>
            <div className="nb-testimonial-card__author">
              <span className="nb-testimonial-card__name">{r.name}</span>
              <span className="nb-testimonial-card__location">{r.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}