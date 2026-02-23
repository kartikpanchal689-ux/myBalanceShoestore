const express = require("express");
const bcrypt = require("bcrypt");
const https = require("https");
const User = require("../../models/user");
const router = express.Router();

console.log('🔥 AUTH ROUTE FILE LOADED');

// Temporary OTP store (for demo; use Redis/DB in production)
const otpStore = {};

// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Function to send OTP email via Brevo HTTP API
async function sendOtpEmail(email, otp) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      sender: { name: "MyBalance", email: "kartikpanchal689@gmail.com" },
      to: [{ email: email }],
      subject: "Your OTP Code - MyBalance",
      htmlContent: `
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

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        if (res.statusCode === 201) {
          console.log(`✅ OTP email sent to ${email}`);
          resolve(true);
        } else {
          console.error(`❌ Brevo API error: ${res.statusCode} - ${body}`);
          resolve(false);
        }
      });
    });

    req.on("error", (err) => {
      console.error("❌ Email sending failed:", err.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
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
      expiresAt: Date.now() + 10 * 60 * 1000
    };

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

  if (Date.now() > storedData.expiresAt) {
    delete otpStore[identifier];
    return res.status(401).json({ success: false, message: "OTP has expired" });
  }

  if (otp !== storedData.otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

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


// ---------------- SEND ORDER RECEIPT EMAIL ----------------
router.post("/send-receipt", async (req, res) => {
  const { email, html, orderId } = req.body;

  if (!email || !html) {
    return res.status(400).json({ success: false, message: "Email and html are required" });
  }

  const data = JSON.stringify({
    sender: { name: "myBalance Shoestore", email: "kartikpanchal689@gmail.com" },
    to: [{ email }],
    subject: `Order Confirmation - ${orderId} | myBalance`,
    htmlContent: html
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

  const request = https.request(options, (response) => {
    let body = "";
    response.on("data", (chunk) => body += chunk);
    response.on("end", () => {
      if (response.statusCode === 201) {
        console.log(`✅ Receipt email sent to ${email}`);
        return res.status(200).json({ success: true });
      } else {
        console.error(`❌ Receipt email failed: ${body}`);
        return res.status(500).json({ success: false });
      }
    });
  });

  request.on("error", (err) => {
    console.error("Receipt email error:", err.message);
    return res.status(500).json({ success: false });
  });

  request.write(data);
  request.end();
});

module.exports = router;

