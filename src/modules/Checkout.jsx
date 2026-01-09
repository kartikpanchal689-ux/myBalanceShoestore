// Checkout.jsx
import React from "react";
import { useLocation } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const { items = [], total = 0 } = location.state || {};

  const handleCheckout = () => {
    alert("Redirecting to payment... (Stripe integration goes here)");
  };

  return (
    <div style={{ paddingTop: "80px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Checkout</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <button onClick={handleCheckout}>Pay Now</button>
    </div>
  );
}

export default Checkout;
