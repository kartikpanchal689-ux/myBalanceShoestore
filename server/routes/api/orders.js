const express = require("express");
const Order = require("../../models/order");
const router = express.Router();

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

module.exports = router;