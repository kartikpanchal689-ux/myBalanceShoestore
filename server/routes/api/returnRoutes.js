console.log('🔄 RETURN ROUTES LOADED');
const express = require("express");
const Return = require("../../models/returnModel");
const Order = require("../../models/order");
const router = express.Router();

// Submit a return request
router.post("/return-request", async (req, res) => {
  try {
    const { orderId, userEmail, reasons, feedback } = req.body;

    // Save return request
    const returnRequest = new Return({
      orderId,
      userEmail,
      reasons,
      feedback,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      status: "Return in Process",
    });
    await returnRequest.save();

    // Update order status to "Return in Process"
    await Order.findOneAndUpdate({ orderId }, { status: "Return in Process" });

    // Notify via SSE
    global.emitToUser(userEmail, { type: "ORDER_STATUS_UPDATED", payload: { orderId, status: "Return in Process" } });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get all return requests (admin)
router.get("/admin/returns", async (req, res) => {
  try {
    const returns = await Return.find().sort({ createdAt: -1 });
    res.json({ success: true, returns });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get return requests for a specific user
router.get("/my-returns/:userEmail", async (req, res) => {
  try {
    const returns = await Return.find({ userEmail: req.params.userEmail }).sort({ createdAt: -1 });
    res.json({ success: true, returns });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update return status (admin: approve/reject)
router.patch("/admin/return-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const returnRequest = await Return.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!returnRequest) return res.json({ success: false, message: "Return not found" });

    // Also update order status if approved
    if (status === "Approved") {
      await Order.findOneAndUpdate({ orderId: returnRequest.orderId }, { status: "Returned" });
    }

    global.emitToUser(returnRequest.userEmail, { type: "ORDER_STATUS_UPDATED", payload: returnRequest });

    res.json({ success: true, returnRequest });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;