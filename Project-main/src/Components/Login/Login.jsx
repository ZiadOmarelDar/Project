import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
import Dog from "../../assets/Dog.png";
import axios from "axios";
import { FaGoogle, FaFacebook, FaWhatsapp, FaTelegram,FaEyeSlash,FaEye } from "react-icons/fa";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setApiError("");

    let valid = true;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailPattern)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Login successful:", message);
        navigate("/");
      } else {
        setApiError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container-5">
      <div className="form">
        <div className="header">Welcome Back!</div>
        <form onSubmit={handleSubmit} className="inputs">
          <label>Email:</label>
          <div className="input">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError && <p className="error-message">{emailError}</p>}

          <label>Password:</label>
          <div className="input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <span
              className="toggle-password-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
         
          {passwordError && <p className="error-message">{passwordError}</p>}
          {apiError && <p className="error-message">{apiError}</p>}

          <button type="submit" className="submit">
            Login
          </button>
        </form>
        <p className="register">
          Don't have an Account?
          <span className="register-link" onClick={() => navigate("/register")}>
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
  );
}

export default Login;