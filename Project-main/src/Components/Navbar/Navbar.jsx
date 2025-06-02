import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // استبدل Link بـ NavLink
import { FaChevronDown } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	const fetchUserData = useCallback(() => {
		const token = localStorage.getItem('token');
		if (token) {
			axios
				.get('http://localhost:3001/user', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setUsername(response.data.user.username);
					setIsLoggedIn(true);
				})
				.catch((err) => {
					console.error('Error fetching user data:', err);
					localStorage.removeItem('token');
					localStorage.removeItem('cart');
					setIsLoggedIn(false);
					setUsername('');
					navigate('/login');
				});
		} else {
			setIsLoggedIn(false);
			setUsername('');
			localStorage.removeItem('cart');
		}
	}, [navigate]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData, location]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('cart');
		setIsLoggedIn(false);
		setUsername('');
		navigate('/login');
		window.location.reload();
	};

	return (
		<nav className='navbar'>
			<NavLink
				to='/'
				className='logo-1'>
				PET CARE
			</NavLink>
			<button
				className='menu-btn'
				onClick={toggleMenu}>
				☰
			</button>
			<ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
				<li>
					<NavLink
						to='/'
						end>
						{' '}
						{/* استخدم end للمطابقة الدقيقة للمسار الرئيسي */}
						Home
					</NavLink>
				</li>
				<li>
					<NavLink to='/AdoptionPage'>Adopt a Pet</NavLink>
				</li>
				<li>
					<NavLink to='/VetClinicFinder'>Find a Clinic</NavLink>
				</li>
				<li>
					<NavLink to='/shop'>Shop Supplies</NavLink>
				</li>
				<li className='dropdown'>
					<button className='dropbtn'>
						Other <FaChevronDown className='icon' />
					</button>
					<ul className='dropdown-content'>
						<li>
							<NavLink to='/trainHome'>Training</NavLink>
						</li>
						<li>
							<NavLink to='/community'>Community</NavLink>
						</li>
						<li>
							<NavLink to='/PetTravelRequirements'>Pet Travel Guide</NavLink>
						</li>
						<li>
							<NavLink to='/contact'>Contact</NavLink>
						</li>
					</ul>
				</li>
			</ul>
			<NavLink
				to='/cart'
				className='cart-icon'>
				<MdOutlineShoppingCart />
			</NavLink>
			<div className='auth-buttons'>
				{isLoggedIn ? (
					<>
						<NavLink
							to='/profile'
							className='username'>
							Welcome , {username}
						</NavLink>
						<button
							onClick={handleLogout}
							className='logout-btn'>
							Logout
						</button>
					</>
				) : (
					<>
						<NavLink
							to='/login'
							className='sign-in'>
							Sign In
						</NavLink>
						<NavLink
							to='/register'
							className='join-now'>
							Join Now
						</NavLink>
					</>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
