import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import dog from "../../assets/Dog.png";
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
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email address";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/register", {
        name: fullName,
        userType,
        username,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); 

      toast.success("✅ Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/"); 
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.message) {
        const errorMessage = err.response.data.message;
        toast.error(`❌ ${errorMessage}`);

        let newErrors = {};
        if (errorMessage.includes("Email already registered")) {
          newErrors.email = "Email already registered";
        } else if (errorMessage.includes("Username already taken")) {
          newErrors.username = "Username already taken";
        } else if (errorMessage.includes("Invalid user type")) {
          newErrors.userType = "Invalid user type";
        } else if (errorMessage.includes("Username must be at least 3 characters")) {
          newErrors.username = "Username must be at least 3 characters";
        } else if (errorMessage.includes("Password must be at least 6 characters")) {
          newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
      } else {
        toast.error("❌ An error occurred. Please try again.");
      }
      console.error("Registration error:", err);
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <label>Account Type:</label>
          <select
            name="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="clinicAdmin">Clinic Admin</option>
            <option value="trainer">Trainer</option>
          </select>
          {errors.userType && <span className="error">{errors.userType}</span>}

          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          {errors.username && <span className="error">{errors.username}</span>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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

           
            <input 
            type="file"
            name="userPhoto"
            />

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-text">
          Yes, I have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

        <button className="google-signup" disabled={isLoading}>
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