import { useParams } from "react-router-dom";
import allProducts from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <p>Product not found</p>;
  }

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id);

  return (
    <section className="product-detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <button>Add to Cart</button>

      <h3>Related Products</h3>
      <div className="related-products">
        {related.map(r => (
          <div key={r.id}>
            <img src={r.image} alt={r.name} />
            <p>{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
