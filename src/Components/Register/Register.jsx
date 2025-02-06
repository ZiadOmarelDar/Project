import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import dog from "../../assets/unsplash_BJaqPaH6AGQ.png";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    userType: "user",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required ";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email address";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted", formData);

      navigate("/login");
    }
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
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <label>Account Type:</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
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
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
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
              value={formData.confirmPassword}
              onChange={handleChange}
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
          Yes I have an account?{" "}
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
    </div>
  );
}

export default Register;
