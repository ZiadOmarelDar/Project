import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3001/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsername(response.data.user.username);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("cart");
          setIsLoggedIn(false);
          setUsername("");
          navigate("/login");
        });
    } else {
      setIsLoggedIn(false);
      setUsername("");
      localStorage.removeItem("cart");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-1">
        PET CARE
      </Link>
      <button className="menu-btn" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" className="active">
            Home
          </Link>
        </li>
        <li>
          <Link to="/adopt">Adopt a Pet</Link>
        </li>
        <li>
          <Link to="/clinics">Find a Clinic</Link>
        </li>
        <li>
          <Link to="/shop">Shop Supplies</Link>
        </li>
        <li className="dropdown">
          <button className="dropbtn">
            Other <FaChevronDown className="icon" />
          </button>
          <ul className="dropdown-content">
            <li>
              <Link to="/services">Training</Link>
            </li>
            <li>
              <Link to="/services">Community</Link>
            </li>
            <li>
              <Link to="/services">Pet Travel Guide</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </li>
      </ul>
      <Link to="/cart" className="cart-icon">
        <MdOutlineShoppingCart />
      </Link>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="username">
              Welcome, {username}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="sign-in">
              Sign In
            </Link>
            <Link to="/register" className="join-now">
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;