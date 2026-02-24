const express = require("express");
const Order = require("../../models/order");
const User = require("../../models/user");
const Product = require("../../models/product");
const router = express.Router();

// ========================================
// ORDERS
// ========================================

router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

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

// ========================================
// USERS
// ========================================

router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0, password: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.delete("/admin/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ========================================
// PRODUCTS
// ========================================

// Get all products from DB
router.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Add new product + broadcast via SSE
router.post("/admin/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Broadcast to all SSE clients
    const allClients = Object.values(global.sseClients || {}).flat();
    allClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: "PRODUCT_ADDED", payload: product })}\n\n`);
    });

    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update product + broadcast via SSE
router.put("/admin/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.json({ success: false, message: "Product not found" });

    const allClients = Object.values(global.sseClients || {}).flat();
    allClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: "PRODUCT_UPDATED", payload: product })}\n\n`);
    });

    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Delete product + broadcast via SSE
router.delete("/admin/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    const allClients = Object.values(global.sseClients || {}).flat();
    allClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: "PRODUCT_DELETED", payload: { id: req.params.id } })}\n\n`);
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;