import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ items, setItems }) {
  const navigate = useNavigate();

  const removeItem = (id) => {
    setItems(items.filter((item, i) => i !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const goToCheckout = () => {
    navigate("/checkout", { state: { items, total } });
  };

  return (
    <div style={{ paddingTop: "80px", maxWidth: "800px", margin: "0 auto" }}>
      {/* ✅ No header here, only content */}
      <h2>Cart</h2>
      {items.length === 0 && <p>No items in cart</p>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>

      {items.length > 0 && (
        <button onClick={goToCheckout}>Proceed to Checkout</button>
      )}
    </div>
  );
}

export default Cart;
