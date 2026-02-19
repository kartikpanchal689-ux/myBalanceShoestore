const express = require("express");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
const User = require("../../models/user");
const router = express.Router();

console.log('🔥 AUTH ROUTE FILE LOADED');

// Temporary OTP store (for demo; use Redis/DB in production)
const otpStore = {};

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ============ EMAIL SETUP ============
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send OTP email
async function sendOtpEmail(email, otp) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP Code - myBalance',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
            .container { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #cc0000; }
            .otp-box { background: #f7f7f5; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #0a0a0a; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">myBalance</div>
              <p style="color: #666;">Your One-Time Password</p>
            </div>
            
            <p>Hello,</p>
            <p>You requested to log in to your myBalance account. Use the OTP below to proceed:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
            
            <div class="footer">
              <p>© 2025 myBalance Shoestore. All rights reserved.</p>
              <p>Need help? Contact us at support@mybalance.com</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// ---------------- PASSWORD LOGIN ----------------
router.post("/password-login", async (req, res) => {
  const identifier = req.body.identifier?.toLowerCase();
  const password = req.body.password;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Compare plain password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      role: user.role || "customer",
      message: `${user.role === "admin" ? "Admin" : "Customer"} login successful`
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- SEND OTP (WITH EMAIL) ----------------
router.post("/login", async (req, res) => {
  const { identifier } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    otpStore[identifier] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };

    // Send OTP via email
    const emailSent = await sendOtpEmail(user.email, otp);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email. Please try again." 
      });
    }

    console.log(`📧 OTP sent to ${user.email}: ${otp}`);
    
    return res.status(200).json({ 
      success: true, 
      message: "OTP sent to your email successfully" 
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- VERIFY OTP (WITH EXPIRY CHECK) ----------------
router.post("/verify-otp", async (req, res) => {
  const { identifier, otp } = req.body;

  const storedData = otpStore[identifier];
  
  if (!storedData) {
    return res.status(401).json({ success: false, message: "OTP expired or not found" });
  }

  // Check if OTP expired
  if (Date.now() > storedData.expiresAt) {
    delete otpStore[identifier];
    return res.status(401).json({ success: false, message: "OTP has expired" });
  }

  // Verify OTP
  if (otp !== storedData.otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

  // OTP verified successfully
  delete otpStore[identifier];
  
  return res.status(200).json({ 
    success: true, 
    message: "Login successful" 
  });
});

// ---------------- PING TEST ROUTE ----------------
router.post("/ping", (req, res) => {
  res.json({ success: true, message: "Ping route working" });
});

module.exports = router;