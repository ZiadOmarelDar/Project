import React from 'react';
import { Link } from 'react-router-dom';
import phone from '../../assets/Icons/bxs_phone-call.png';
import envelope from '../../assets/Icons/Vector.png';
import gps from '../../assets/Icons/carbon_location-filled.png';
import './Footer.css';

const Footer = () => {
	return (
		<footer
			style={{ padding: '100px 40px 40px' }}
			className='footer'>
			<div className='container'>
				<div className='box'>
					<h3
						style={{ marginBottom: '30px' }}
						className='font-semibold text-xl'>
						Reach us
					</h3>
					<a
						style={{ marginBottom: '20px' }}
						className='flex items-center gap-2.5'
						href='mailto:pet_care@gmail.com'>
						<img
							src={envelope}
							alt=''
							width={20}
						/>
						pet_care@gmail.com
					</a>
					<a
						style={{ marginBottom: '20px' }}
						className='flex items-center gap-2.5'
						href='whatsapp:+201273349622'>
						<img
							src={phone}
							alt=''
							width={20}
						/>
						201273349622
					</a>
					<a
						className='flex items-center gap-2.5'
						href='https://www.google.com/maps/place/Your+Location'>
						<img
							src={gps}
							alt=''
							width={20}
						/>
						Your Location
					</a>
					<div className='logo-2'>Pet Care</div>
				</div>
				<div className='box'>
					<h3
						style={{ marginBottom: '30px' }}
						className='font-semibold text-xl'>
						Company
					</h3>
					<Link
						className='block link'
						style={{ marginBottom: '20px' }}
						to='/AboutUs'>
						About
					</Link>
					<Link
						className='block link'
						style={{ marginBottom: '30px' }}
						to='/ContactUs'>
						Contact
					</Link>
				</div>
				<div className='box'>
					<h3
						style={{ marginBottom: '20px' }}
						className='font-semibold text-xl'>
						Services
					</h3>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/AdoptionPage'>
						Adoption
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/Shop'>
						Shop
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/Community'>
						Forum
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/AllClinics'>
						Clinics
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/TrainHome'>
						Training
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '40px' }}
						to='/AIHomePage'>
						AI Consultant
					</Link>
				</div>
				<div className='box'>
					<h3
						style={{ marginBottom: '30px' }}
						className='font-semibold text-xl'>
						Legal
					</h3>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						Privacy Policy
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						Terms & Services
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						Terms of Use
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '40px' }}
						to='/'>
						Refund Policy
					</Link>
				</div>
				<div className='box'>
					<h3
						style={{ marginBottom: '20px' }}
						className='font-semibold text-xl'>
						Social Media
					</h3>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						Facbook
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						Instagram
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '20px' }}
						to='/'>
						X
					</Link>
					<Link
						className='block'
						style={{ marginBottom: '40px' }}
						to='/'>
						Linkedin
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
