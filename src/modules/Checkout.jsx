import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

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
  const [email, setEmail] = useState("");
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

  const saveOrderToHistory = (details) => {
    try {
      const existing = JSON.parse(localStorage.getItem("myOrders") || "[]");
      existing.push({
        ...details,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        status: "Processing"
      });
      localStorage.setItem("myOrders", JSON.stringify(existing));
    } catch {}
  };

  const sendEmailReceipt = async (details, userEmail) => {
    if (!userEmail) return;
    const itemsHtml = details.items.map(item =>
      `<tr>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity || 1}</td>
        <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${(item.price * (item.quantity || 1)).toFixed(2)}</td>
      </tr>`
    ).join("");

    const html = `
      <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
      <div style="background:white;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;">
        <div style="background:#cc0000;padding:24px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;">myBalance</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Order Confirmation</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111;margin:0 0 8px;">Thank you for your order! 🎉</h2>
          <p style="color:#666;">Your order has been placed successfully.</p>
          <div style="background:#f7f7f7;border-radius:8px;padding:16px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#666;font-size:14px;">Order ID</span>
              <strong style="font-size:14px;">${details.orderId}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#666;font-size:14px;">Tracking ID</span>
              <strong style="font-size:14px;">${details.trackingId}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#666;font-size:14px;">Estimated Delivery</span>
              <strong style="font-size:14px;">${details.estimatedDelivery}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#666;font-size:14px;">Payment Method</span>
              <strong style="font-size:14px;">${details.paymentMethod === "cod" ? "Cash on Delivery" : details.paymentMethod === "upi" ? "UPI" : "Card"}</strong>
            </div>
          </div>
          <h3 style="color:#111;margin:24px 0 12px;">Items Ordered</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="padding:8px;text-align:left;font-size:13px;">Product</th>
                <th style="padding:8px;text-align:center;font-size:13px;">Qty</th>
                <th style="padding:8px;text-align:right;font-size:13px;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="border-top:2px solid #f0f0f0;margin-top:16px;padding-top:16px;display:flex;justify-content:space-between;">
            <strong style="font-size:16px;">Total Paid</strong>
            <strong style="font-size:16px;color:#cc0000;">₹${details.total.toFixed(2)}</strong>
          </div>
          <div style="background:#f7f7f7;border-radius:8px;padding:16px;margin-top:20px;">
            <p style="margin:0;color:#666;font-size:14px;">📦 Delivering to:</p>
            <p style="margin:8px 0 0;font-weight:600;color:#111;">${details.address}</p>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:20px;text-align:center;color:#999;font-size:13px;">
          <p style="margin:0;">© 2025 myBalance Shoestore. Need help? support@mybalance.com</p>
        </div>
      </div>
      </body></html>
    `;

    try {
      await fetch("https://mybalanceshoestore.onrender.com/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, html, orderId: details.orderId })
      });
    } catch (err) {
      console.error("Receipt email failed:", err);
    }
  };

  const placeOrder = async () => {
    const orderId = generateOrderId();
    const trackingId = generateTrackingId();
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const details = {
      orderId, trackingId, estimatedDelivery,
      items, total: finalTotal, paymentMethod, address,
      userEmail: email
    };

    // Save to MongoDB
    await fetch("https://mybalanceshoestore.onrender.com/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details)
    });

    removeCheckedOutItemsFromCart();
    await sendEmailReceipt(details, email);
    setOrderDetails(details);
    setOrderPlaced(true);
  };

  const handlePayment = async () => {
    if (!address.trim()) { alert("Please enter your delivery address."); return; }
    if (!email.trim()) { alert("Please enter your email for order confirmation."); return; }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) { alert("Please enter your UPI ID."); return; }
      const upiLink = `upi://pay?pa=kartikpanchal689@oksbi&pn=myBalance%20Shoestore&am=${finalTotal.toFixed(2)}&cu=INR&tn=myBalance%20Order`;
      window.location.href = upiLink;
      setTimeout(() => placeOrder(), 2000);
    } else if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) { alert("Please fill in all card details."); return; }
      await placeOrder();
    } else if (paymentMethod === "cod") {
      await placeOrder();
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p className="success-sub">Thank you for shopping with myBalance 🎉</p>
          <p className="success-email-note">A confirmation email has been sent to <strong>{email}</strong></p>

          <div className="order-tracking-card">
            <div className="tracking-row"><span className="tracking-label">Order ID</span><span className="tracking-value">{orderDetails.orderId}</span></div>
            <div className="tracking-row"><span className="tracking-label">Tracking ID</span><span className="tracking-value">{orderDetails.trackingId}</span></div>
            <div className="tracking-row"><span className="tracking-label">Estimated Delivery</span><span className="tracking-value">{orderDetails.estimatedDelivery}</span></div>
            <div className="tracking-row"><span className="tracking-label">Payment</span><span className="tracking-value">{orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : orderDetails.paymentMethod === "upi" ? "UPI" : "Card"}</span></div>
            <div className="tracking-row"><span className="tracking-label">Amount Paid</span><span className="tracking-value">₹{orderDetails.total.toFixed(2)}</span></div>
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

          <div className="success-btns">
            <button className="checkout-btn" onClick={() => navigate("/orders")}>View My Orders</button>
            <button className="checkout-btn-outline" onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>
        <div className="checkout-layout">
          <div className="checkout-left">

            <div className="checkout-section">
              <h3>Contact Info</h3>
              <input className="checkout-input" type="email" placeholder="Email for order confirmation" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="checkout-section">
              <h3>Delivery Address</h3>
              <textarea className="checkout-input" placeholder="Enter your full delivery address..." rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="checkout-section">
              <h3>Referral Code</h3>
              <div className="referral-row">
                <input className="checkout-input" type="text" placeholder="Enter referral code" value={referralCode} onChange={(e) => { setReferralCode(e.target.value); setReferralApplied(false); setReferralError(""); }} disabled={referralApplied} />
                <button className="referral-btn" onClick={applyReferral} disabled={referralApplied}>{referralApplied ? "Applied ✓" : "Apply"}</button>
              </div>
              {referralApplied && <p className="referral-success">🎉 {referralDiscount}% discount applied!</p>}
              {referralError && <p className="referral-error">{referralError}</p>}
            </div>

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
                  <input className="checkout-input" type="text" placeholder="Enter your UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
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
              <div className="summary-row"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
              {referralApplied && (
                <div className="summary-row discount"><span>Discount ({referralDiscount}%)</span><span>− ₹{discountAmount.toFixed(2)}</span></div>
              )}
              <div className="summary-row total"><span>Total</span><span>₹{finalTotal.toFixed(2)}</span></div>
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