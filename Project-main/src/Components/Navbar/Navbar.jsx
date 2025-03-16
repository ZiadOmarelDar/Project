import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import './Navbar.css';
import { MdOutlineShoppingCart } from 'react-icons/md';

function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className='navbar'>
			{/* Logo (Link to Home) */}
			<Link
				to='/'
				className='logo-1'>
				PET CARE
			</Link>

			{/* Button to toggle menu in small screens */}
			<button
				className='menu-btn'
				onClick={toggleMenu}>
				&#9776; {/* Hamburger menu icon */}
			</button>

      {/* Navigation Links */}
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li><Link to="/" className="active">Home</Link></li>
        <li><Link to="/adopt">Adopt a Pet</Link></li>
        <li><Link to="/clinics">Find a Clinic</Link></li>
        <li><Link to="/supplies">Shop Supplies</Link></li>
        
        {/* Dropdown Menu */}
        <li className="dropdown">
          <button className="dropbtn">Other <FaChevronDown className="icon" /></button>
          <ul className="dropdown-content">
            <li><Link to="/services">Training</Link></li>
            <li><Link to="/services">Community</Link></li>
            <li><Link to="/services">Pet Travel Guide</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </li>
      </ul>
      
      {/* Authentication Buttons */}
      <div className="auth-buttons">
        <Link to="/login" className="sign-in">Sign In</Link>
        <Link to="/register" className="join-now">Join Now</Link>
      </div>
    </nav>
  );
}

export default Navbar;
