const express = require("express");
const Order = require("../../models/order");
const router = express.Router();


const https = require("https");

async function sendStatusEmail(email, order, status) {
  const statusMessages = {
    "Shipped": "Your order has been shipped and is on its way! 🚚",
    "Out for Delivery": "Your order is out for delivery today! 📦",
    "Delivered": "Your order has been delivered! Enjoy your new shoes! 👟",
    "Cancelled": "Your order has been cancelled as requested."
  };

  const message = statusMessages[status];
  if (!message) return;

  const data = JSON.stringify({
    sender: { name: "myBalance Shoestore", email: "kartikpanchal689@gmail.com" },
    to: [{ email }],
    subject: `Order ${status} - ${order.orderId} | myBalance`,
    htmlContent: `
      <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
      <div style="background:white;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;">
        <div style="background:#cc0000;padding:24px;text-align:center;">
          <h1 style="color:white;margin:0;">myBalance</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111;">Order Update 📬</h2>
          <p style="color:#444;font-size:16px;">${message}</p>
          <div style="background:#f7f7f7;border-radius:8px;padding:16px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#666;">Order ID</span>
              <strong>${order.orderId}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#666;">Tracking ID</span>
              <strong>${order.trackingId}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#666;">Status</span>
              <strong style="color:#cc0000;">${status}</strong>
            </div>
          </div>
          <p style="color:#666;">Thank you for shopping with myBalance!</p>
        </div>
        <div style="background:#f5f5f5;padding:20px;text-align:center;color:#999;font-size:13px;">
          <p>© 2025 myBalance Shoestore. Need help? support@mybalance.com</p>
        </div>
      </div>
      </body></html>
    `
  });

  const options = {
    hostname: "api.brevo.com",
    path: "/v3/smtp/email",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => resolve());
    });
    req.on("error", () => resolve());
    req.write(data);
    req.end();
  });
}

// Save new order
router.post("/place-order", async (req, res) => {
  try {
    const { userEmail, orderId, trackingId, items, total, paymentMethod, address, estimatedDelivery } = req.body;

    const order = new Order({
      userEmail,
      orderId,
      trackingId,
      items,
      total,
      paymentMethod,
      address,
      estimatedDelivery,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      status: "Processing"
    });

    await order.save();

    // Notify all tabs of this user via SSE
    global.emitToUser(userEmail, {
      type: "ORDER_PLACED",
      payload: order
    });

    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get orders for a user
router.get("/my-orders/:userEmail", async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.userEmail }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Cancel an order
router.patch("/cancel-order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Notify all tabs of this user via SSE
    global.emitToUser(order.userEmail, {
      type: "ORDER_CANCELLED",
      payload: order
    });

    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update order status (admin only)
router.patch("/update-status/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Notify all tabs of this user via SSE
    global.emitToUser(order.userEmail, {
      type: "ORDER_STATUS_UPDATED",
      payload: order
    });
    await sendStatusEmail(order.userEmail, order, status);
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;