import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Dog from "../../assets/Dog.png";
import { FaGoogle, FaFacebook, FaWhatsapp, FaTelegram } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailPattern)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (valid) {
      console.log("Logging in...");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form">
          <div className="header">Welcome Back!</div>
          <div className="inputs">
            <p>Email:</p>
            <div className="input">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {emailError && <p className="error-message">{emailError}</p>}

            <p>Password:</p>
            <div className="input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button className="submit" onClick={handleLogin}>
            Login
          </button>

          <p className="register">
            Dont have an Account?
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              {" "}
              Register
            </span>
          </p>

          <div className="icons">
            <button className="google-signup">
              <FaGoogle className="google-icon" /> Sign up with Google
            </button>
          </div>
          <div className="social-icons">
            <FaFacebook className="icon" />
            <FaWhatsapp className="icon" />
            <FaTelegram className="icon" />
          </div>
        </div>
        <div className="image-section">
          <img src={Dog} alt="Dog" />
        </div>
      </div>
    </>
  );
}

export default Login;
