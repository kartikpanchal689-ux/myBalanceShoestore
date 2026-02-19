import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

// Valid referral codes and their discounts
const REFERRAL_CODES = {
  "MYBALANCE10": 10,
  "WELCOME20": 20,
  "SAVE15": 15,
};

function generateOrderId() {
  return "MYB" + Date.now().toString().slice(-8).toUpperCase();
}

function generateTrackingId() {
  return "TRK" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function Checkout({ setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Load from localStorage on refresh if location.state is gone
  const getInitialData = () => {
    if (location.state?.items?.length > 0) {
      localStorage.setItem("checkoutData", JSON.stringify({
        items: location.state.items,
        total: location.state.total
      }));
      return { items: location.state.items, total: location.state.total };
    }
    try {
      const saved = localStorage.getItem("checkoutData");
      return saved ? JSON.parse(saved) : { items: [], total: 0 };
    } catch { return { items: [], total: 0 }; }
  };

  const { items, total } = getInitialData();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [referralCode, setReferralCode] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralError, setReferralError] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [address, setAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const discountAmount = (total * referralDiscount) / 100;
  const finalTotal = total - discountAmount;

  const applyReferral = () => {
    const code = referralCode.trim().toUpperCase();
    if (REFERRAL_CODES[code]) {
      setReferralDiscount(REFERRAL_CODES[code]);
      setReferralApplied(true);
      setReferralError("");
    } else {
      setReferralError("Invalid referral code");
      setReferralApplied(false);
      setReferralDiscount(0);
    }
  };

  const removeCheckedOutItemsFromCart = () => {
    if (!setCartItems) return;
    const checkedOutIds = items.map(i => i.id);
    setCartItems(prev => {
      const updated = prev.filter(item => !checkedOutIds.includes(item.id));
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
    localStorage.removeItem("checkoutData");
  };

  const placeOrder = () => {
    const orderId = generateOrderId();
    const trackingId = generateTrackingId();
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const details = {
      orderId,
      trackingId,
      estimatedDelivery,
      items,
      total: finalTotal,
      paymentMethod,
      address,
    };

    setOrderDetails(details);
    setOrderPlaced(true);
    removeCheckedOutItemsFromCart();
  };

  const handlePayment = () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        alert("Please enter your UPI ID.");
        return;
      }
      const upiLink = `upi://pay?pa=kartikpanchal689@oksbi&pn=myBalance%20Shoestore&am=${finalTotal.toFixed(2)}&cu=INR&tn=myBalance%20Order`;
      window.location.href = upiLink;
      setTimeout(() => placeOrder(), 2000);
    } else if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert("Please fill in all card details.");
        return;
      }
      placeOrder();
    } else if (paymentMethod === "cod") {
      placeOrder();
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p className="success-sub">Thank you for shopping with myBalance 🎉</p>

          <div className="order-tracking-card">
            <div className="tracking-row">
              <span className="tracking-label">Order ID</span>
              <span className="tracking-value">{orderDetails.orderId}</span>
            </div>
            <div className="tracking-row">
              <span className="tracking-label">Tracking ID</span>
              <span className="tracking-value">{orderDetails.trackingId}</span>
            </div>
            <div className="tracking-row">
              <span className="tracking-label">Estimated Delivery</span>
              <span className="tracking-value">{orderDetails.estimatedDelivery}</span>
            </div>
            <div className="tracking-row">
              <span className="tracking-label">Payment</span>
              <span className="tracking-value">
                {orderDetails.paymentMethod === "cod" ? "Cash on Delivery" :
                 orderDetails.paymentMethod === "upi" ? "UPI" : "Card"}
              </span>
            </div>
            <div className="tracking-row">
              <span className="tracking-label">Amount Paid</span>
              <span className="tracking-value">₹{orderDetails.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="ordered-items">
            <h4>Items Ordered</h4>
            {orderDetails.items.map((item, i) => (
              <div className="ordered-item" key={i}>
                <span>{item.name} × {item.quantity || 1}</span>
                <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="success-address">
            <span>📦 Delivering to:</span>
            <p>{orderDetails.address}</p>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>

        <div className="checkout-layout">
          {/* LEFT: Form */}
          <div className="checkout-left">

            {/* Delivery Address */}
            <div className="checkout-section">
              <h3>Delivery Address</h3>
              <textarea
                className="checkout-input"
                placeholder="Enter your full delivery address..."
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Referral Code */}
            <div className="checkout-section">
              <h3>Referral Code</h3>
              <div className="referral-row">
                <input
                  className="checkout-input"
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => { setReferralCode(e.target.value); setReferralApplied(false); setReferralError(""); }}
                  disabled={referralApplied}
                />
                <button
                  className="referral-btn"
                  onClick={applyReferral}
                  disabled={referralApplied}
                >
                  {referralApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>
              {referralApplied && <p className="referral-success">🎉 {referralDiscount}% discount applied!</p>}
              {referralError && <p className="referral-error">{referralError}</p>}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                  <span>📱 UPI</span>
                </label>
                <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <span>💳 Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <span>🚚 Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === "upi" && (
                <div className="payment-fields">
                  <input
                    className="checkout-input"
                    type="text"
                    placeholder="Enter your UPI ID (e.g. name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="payment-note">You will be redirected to your UPI app to complete payment.</p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="payment-fields">
                  <input className="checkout-input" type="text" placeholder="Cardholder Name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  <input className="checkout-input" type="text" placeholder="Card Number" maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} />
                  <div className="card-row">
                    <input className="checkout-input" type="text" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                    <input className="checkout-input" type="text" placeholder="CVV" maxLength={3} value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="payment-fields">
                  <p className="payment-note">Pay with cash when your order is delivered. Extra ₹50 COD charge may apply.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="checkout-right">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {items.map((item, index) => (
                  <div className="summary-item" key={index}>
                    <span>{item.name} × {item.quantity || 1}</span>
                    <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {referralApplied && (
                <div className="summary-row discount">
                  <span>Discount ({referralDiscount}%)</span>
                  <span>− ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handlePayment}>
                {paymentMethod === "cod" ? "Place Order" : "Pay Now"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;