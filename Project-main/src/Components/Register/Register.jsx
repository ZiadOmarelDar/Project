import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import dog from "../../assets/unsplash_BJaqPaH6AGQ.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

function Register() {
  // Separate state variables for each input field
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email address";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    axios
      .post("http://localhost:3001/register", {
        fullName,
        userType,
        username,
        email,
        password,
      })
      .then((result) => {
        toast.success("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          toast.error("❌ This email is already registered. Please use a different email.");
        } else {
          toast.error("❌ An error occurred. Please try again later.");
        }
        console.error("Error:", err);
      });
  };



  return (
    <div className="register-container">
      <div className="image-section">
        <img src={dog} alt="Dog with toy" className="dog-image" />
      </div>
      <div className="form-section">
        <h1 className="form-title">Please Fill out form to Register!</h1>
        <form onSubmit={handleSubmit} className="inputs">
          <label>Full name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <label>Account Type:</label>
          <select
            name="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="clinicAdmin">Clinic Admin</option>
            <option value="trainer">Trainer</option>
          </select>

          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <span className="error">{errors.username}</span>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}

          <label>Confirm Password:</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="login-text">
          Yes, I have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

        <button className="google-signup">
          <FaGoogle className="google-icon" /> Sign up with Google
        </button>

        <div className="social-icons">
          <FaFacebook className="icon" />
          <FaWhatsapp className="icon" />
          <FaTelegram className="icon" />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Register;
