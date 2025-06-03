import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
	return (
		<footer className='footer'>
			<div className='footer-container'>
				{/* Section 1: Logo & About */}
				<div className='footer-section'>
					<Link
						to='/'
						className='logo-2'>
						PET CARE
					</Link>
					<p className='about-text'>
						Smart pet care powered by AI – health tracking, training, nutrition,
						and virtual vet support for happy, healthy pets.
					</p>
					
				</div>

				{/* Section 2: Services */}
				<div className='footer-section'>
					<h3 className='section-title-1'>Services</h3>
					<ul>
						<li>
							<Link to='/AdoptionPage'>Adoption</Link>
						</li>
						<li>
							<Link to='/shop'>Supplies</Link>
						</li>
						<li>
							<Link to='/community'>Forum</Link>
						</li>
						<li>
							<Link to='/VetClinicFinder'>Clinics</Link>
						</li>
						<li>
							<Link to='/trainHome'>Training</Link>
						</li>
						<li>
							<Link to='/PetTravelRequirements'>Traveling </Link>
						</li>
						<li>
							<Link to='/ai'>AI</Link>
						</li>
					</ul>
				</div>

				{/* Section 3: Social Media */}
				<div className='footer-section'>
					<h3 className='section-title-1'>Follow us</h3>
					<ul>
						<li>
							<a href='#'>Facebook</a>
						</li>
						<li>
							<a href='#'>Twitter</a>
						</li>
						<li>
							<a href='#'>Instagram</a>
						</li>
						<li>
							<a href='#'>LinkedIn</a>
						</li>
					</ul>
				</div>

				{/* Section 4: Contact */}
				<div className='footer-section'>
					<h3 className='section-title-1'>Contact us</h3>
					<div className='contact-info'>
						<p>
							<FaEnvelope className='icon' /> <a href='#'>bet_care@gmail.com</a>
						</p>
						<p>
							<FaPhone className='icon' /> <a href="tel:+201273349622"> &nbsp; 201273349622</a>
						</p>
					</div>
				</div>
			</div>

			{/* Bottom Footer */}
			<div className='footer-bottom'>
				© <span>2025 </span> All rights reserved | Design by{' '}
				<a href='#'> Pet Care Team.</a>
			</div>
		</footer>
	);
};

export default Footer;
