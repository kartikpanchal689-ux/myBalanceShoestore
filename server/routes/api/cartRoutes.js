const express = require("express");
const Cart = require("../../models/cart");
const router = express.Router();

// Get cart for a user
router.get("/cart/:userEmail", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.userEmail });
    res.json({ success: true, items: cart ? cart.items : [] });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Save/update cart for a user
router.post("/cart/:userEmail", async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userEmail: req.params.userEmail },
      { items },
      { upsert: true, new: true }
    );

    // Notify all tabs of this user via SSE
    global.emitToUser(req.params.userEmail, {
      type: "CART_UPDATED",
      payload: cart.items
    });

    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;