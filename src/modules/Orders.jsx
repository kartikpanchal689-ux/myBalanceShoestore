import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const API = "https://mybalanceshoestore.onrender.com/api";

const RETURN_REASONS = [
  "Not satisfied with the product",
  "Placed the order by mistake",
  "Wrong size or color received",
  "Damaged or defective product",
  "Product looks different from website",
];

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return modal state
  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customFeedback, setCustomFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);

  const fetchOrders = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/my-orders/${userEmail}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener("ordersUpdated", fetchOrders);
    return () => window.removeEventListener("ordersUpdated", fetchOrders);
  }, []);

  const openReturnModal = (order) => {
    setSelectedOrder(order);
    setSelectedReasons([]);
    setCustomFeedback("");
    setReturnSuccess(false);
    setReturnModal(true);
  };

  const closeReturnModal = () => {
    setReturnModal(false);
    setSelectedOrder(null);
  };

  const toggleReason = (reason) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const submitReturn = async () => {
    if (selectedReasons.length === 0 && !customFeedback.trim()) {
      alert("Please select at least one reason or write feedback.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/return-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          userEmail: localStorage.getItem("userEmail"),
          reasons: selectedReasons,
          feedback: customFeedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReturnSuccess(true);
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to submit return. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <button className="orders-back" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="orders-title">My Orders</h2>

        {loading ? (
          <div className="orders-empty"><p>Loading orders...</p></div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <p>📦 No orders yet</p>
            <button className="orders-shop-btn" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div className="order-card" key={index}>
                <div className="order-card-header">
                  <div>
                    <p className="order-id">Order #{order.orderId}</p>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <span className={`order-status ${order.status?.toLowerCase().replace(/ /g, '-')}`}>
                    {order.status || "Processing"}
                  </span>
                </div>

                <div className="order-items-list">
                  {order.items.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      {item.image && <img src={item.image} alt={item.name} className="order-item-img" />}
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="order-item-price">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-tracking">
                    <span>Tracking ID:</span>
                    <strong>{order.trackingId}</strong>
                  </div>
                  <div className="order-tracking">
                    <span>Estimated Delivery:</span>
                    <strong>{order.estimatedDelivery}</strong>
                  </div>
                  <div className="order-tracking">
                    <span>Payment:</span>
                    <strong>
                      {order.paymentMethod === "cod" ? "Cash on Delivery" :
                       order.paymentMethod === "upi" ? "UPI" : "Card"}
                    </strong>
                  </div>
                  <div className="order-total-row">
                    <span>Total Paid</span>
                    <strong>₹{(order.total || 0).toFixed(2)}</strong>
                  </div>

                  <div className="order-action-btns">
                    {order.status !== "Cancelled" && order.status !== "Return in Process" && order.status !== "Returned" && (
                      <button
                        className="order-cancel-btn"
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to cancel this order?")) return;
                          const res = await fetch(`${API}/cancel-order/${order.orderId}`, { method: "PATCH" });
                          const data = await res.json();
                          if (data.success) fetchOrders();
                        }}
                      >
                        Cancel Order
                      </button>
                    )}

                    {order.status === "Delivered" && (
                      <button
                        className="order-return-btn"
                        onClick={() => openReturnModal(order)}
                      >
                        Return Product
                      </button>
                    )}

                    {(order.status === "Return in Process" || order.status === "Returned") && (
                      <span className="order-return-status-tag">
                        🔄 {order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RETURN MODAL */}
      {returnModal && (
        <div className="return-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeReturnModal()}>
          <div className="return-modal">
            {returnSuccess ? (
              <div className="return-success">
                <div className="return-success-icon">✅</div>
                <h3>Return Request Submitted</h3>
                <p>Your return request for Order #{selectedOrder?.orderId} has been submitted. Status is now <strong>Return in Process</strong>.</p>
                <button className="return-close-btn" onClick={closeReturnModal}>Close</button>
              </div>
            ) : (
              <>
                <h3>Return Product</h3>
                <p className="return-order-id">Order #{selectedOrder?.orderId}</p>
                <p className="return-section-label">Why are you returning this product?</p>
                <div className="return-reasons">
                  {RETURN_REASONS.map((reason) => (
                    <label key={reason} className="return-reason-item">
                      <input
                        type="checkbox"
                        checked={selectedReasons.includes(reason)}
                        onChange={() => toggleReason(reason)}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                <p className="return-section-label">Additional feedback (optional)</p>
                <textarea
                  className="return-textarea"
                  placeholder="Tell us more about your experience..."
                  value={customFeedback}
                  onChange={(e) => setCustomFeedback(e.target.value)}
                />
                <div className="return-modal-btns">
                  <button className="return-cancel-btn" onClick={closeReturnModal}>Cancel</button>
                  <button className="return-submit-btn" onClick={submitReturn} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Return"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;