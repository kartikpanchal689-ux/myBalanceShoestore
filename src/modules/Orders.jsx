import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const orders = (() => {
    try {
      return JSON.parse(localStorage.getItem("myOrders") || "[]");
    } catch { return []; }
  })();

  return (
    <div className="orders-page">
      <div className="orders-container">
        <button className="orders-back" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="orders-title">My Orders</h2>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <p>📦 No orders yet</p>
            <button className="orders-shop-btn" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.slice().reverse().map((order, index) => (
              <div className="order-card" key={index}>
                <div className="order-card-header">
                  <div>
                    <p className="order-id">Order #{order.orderId}</p>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <span className={`order-status ${order.status?.toLowerCase()}`}>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;