import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setIsLoggedIn }) {
  const [mode, setMode] = useState("password"); // "password" or "otp"
  const [emailOrPhone, setEmailOrPhone] = useState(""); // can be email or phone
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(null); // store OTP from backend
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ---------------- PASSWORD LOGIN ----------------
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError("Please enter both email/phone and password.");
      return;
    }
    // TODO: call backend password login if you want
    setIsLoggedIn(true);
    navigate("/");
  };

  // ---------------- SEND OTP ----------------
const sendOtp = () => {
  if (!emailOrPhone) {
    setError("Please enter your email/phone.");
    return;
  }

  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: emailOrPhone }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setSentOtp(data.otp); // store OTP temporarily
        setOtpSent(true);
        setError("");
        alert("OTP sent to " + emailOrPhone);
      } else {
        setError(data.message);
      }
    });
};

// ---------------- VERIFY OTP ----------------
const verifyOtp = (e) => {
  e.preventDefault();
  if (!otp) {
    setError("Please enter the OTP.");
    return;
  }

  fetch("http://localhost:5000/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp, sentOtp }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setError(data.message);
      }
    });
};


  const handleGoogleLogin = () => {
    alert("Signed in with Google!");
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form
          className="login-form"
          onSubmit={mode === "password" ? handlePasswordLogin : verifyOtp}
        >
          <h2>{mode === "password" ? "Password Login" : "OTP Login"}</h2>

          {error && <p className="error-msg">{error}</p>}

          <label>Email / Phone</label>
          <input
            type="text"
            placeholder="you@example.com or 9876543210"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          {mode === "password" ? (
            <>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="forgot-link">
                <a href="/forgot-password">Forgot Password?</a>
              </p>
              <button type="submit">Login</button>
            </>
          ) : (
            <>
              {!otpSent ? (
                <button type="button" onClick={sendOtp}>
                  Send OTP
                </button>
              ) : (
                <>
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button type="submit">Verify OTP</button>
                </>
              )}
            </>
          )}

          {/* Google Sign-In */}
          <div className="google-login">
            <button className="google-btn" type="button" onClick={handleGoogleLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google logo"
                className="google-icon"
              />
              Sign in with Google
            </button>
          </div>

          {/* Register link */}
          <p className="signup-link">
            Not registered? <a href="/signup">Sign up</a>
          </p>
        </form>

        {/* Toggle buttons below form */}
        <div className="login-toggle">
          <button
            className={mode === "password" ? "active" : ""}
            onClick={() => setMode("password")}
          >
            Password Login
          </button>
          <button
            className={mode === "otp" ? "active" : ""}
            onClick={() => setMode("otp")}
          >
            OTP Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
