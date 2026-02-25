const express = require("express");
const Order = require("../../models/order");
const User = require("../../models/user");
const Product = require("../../models/product");
const router = express.Router();

// Get all orders (admin)
router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get all users (admin)
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0, password: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Delete a user (admin)
router.delete("/admin/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update order status (admin)
router.patch("/admin/order-status/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) return res.json({ success: false, message: "Order not found" });
    global.emitToUser(order.userEmail, { type: "ORDER_STATUS_UPDATED", payload: order });
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get all products (admin)
router.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;