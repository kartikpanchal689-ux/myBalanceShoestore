import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ items, setItems }) {
  const navigate = useNavigate();

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setItems(items.map((item, i) => {
      if (i !== index) return item;
      const newQty = (item.quantity || 1) + delta;
      if (newQty < 1) return null;
      return { ...item, quantity: newQty };
    }).filter(Boolean));
  };

  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const goToCheckout = () => {
    navigate("/checkout", { state: { items, total } });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button className="cart-shop-btn" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, index) => (
                <div className="cart-item" key={index}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  )}
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">${item.price}</p>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQuantity(index, -1)}>−</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(index, 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <button className="cart-remove-btn" onClick={() => removeItem(index)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="cart-checkout-btn" onClick={goToCheckout}>
                Proceed to Checkout →
              </button>
              <button className="cart-continue-btn" onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;