// تم تحسين عرض البيانات في الصفحة، مع إضافة دوال لجعل الكود أنظف وأسهل في القراءة

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClinicDetails.css';
import {
	FaMapMarkerAlt,
	FaEnvelope,
	FaUserMd,
	FaWhatsapp,
} from 'react-icons/fa';
import { LuHeartHandshake } from 'react-icons/lu';
import { HiClock } from 'react-icons/hi2';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';

const ErrorBoundary = ({ children }) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const handleError = () => setHasError(true);
		window.addEventListener('error', handleError);
		return () => window.removeEventListener('error', handleError);
	}, []);

	if (hasError) {
		return <h2>Something went wrong. Please try again later.</h2>;
	}
	return children;
};

const displayValue = (value, fallback = 'Not specified') => {
	if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
	return value || fallback;
};

const ClinicDetails = () => {
	const { clinicId } = useParams();
	const [clinic, setClinic] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const fetchClinicDetails = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(
					`http://localhost:3001/user/all-clinics/${clinicId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setClinic(response.data.clinic || null);
			} catch (err) {
				console.error('Error fetching clinic details:', err);
			}
		};
		fetchClinicDetails();
	}, [clinicId]);

	useEffect(() => {
		let interval;
		if (clinic?.clinicPhotos?.length > 0) {
			interval = setInterval(() => {
				setCurrentSlide((prev) => (prev + 1) % clinic.clinicPhotos.length);
			}, 4000);
		}
		return () => clearInterval(interval);
	}, [clinic?.clinicPhotos]);

	if (!clinic) {
		return (
			<div className='loading-container'>
				<div className='spinner'></div>
				<p>Loading clinic details...</p>
			</div>
		);
	}

	const images = clinic.clinicPhotos || [];
	const whatsappLink = clinic.mobile
		? `https://wa.me/${clinic.mobile.replace(/[^\d]/g, '')}`
		: '#';
	const emailLink = clinic.email ? `mailto:${clinic.email}` : '#';

	return (
		<ErrorBoundary>
			<div className='clinicDetailsContainer'>
				<div className='container'>
					<div className='carousel'>
						{images.length > 0 ? (
							images.map((img, index) => (
								<div
									key={index}
									className={index === currentSlide ? 'active' : 'hidden'}>
									<img
										src={`http://localhost:3001${img}`}
										alt={`${clinic.clinicName || 'Clinic'} Slide ${index + 1}`}
										className='carousel-image'
										onError={(e) =>
											(e.target.src =
												'https://via.placeholder.com/800x600?text=No+Image')
										}
									/>
									<div className='carousel-text'>
										{clinic.clinicName || 'Unknown Clinic'}
									</div>
								</div>
							))
						) : (
							<div className='active'>
								<img
									src='https://via.placeholder.com/800x600?text=No+Image'
									alt='No images available'
									className='carousel-image'
								/>
								<div className='carousel-text'>
									{clinic.clinicName || 'Unknown Clinic'}
								</div>
							</div>
						)}
						<button
							className='prev'
							onClick={() =>
								setCurrentSlide(
									(currentSlide - 1 + images.length) % images.length
								)
							}
							aria-label='Previous slide'>
							❮
						</button>
						<button
							className='next'
							onClick={() =>
								setCurrentSlide((currentSlide + 1) % images.length)
							}
							aria-label='Next slide'>
							❯
						</button>
						<div className='dots'>
							{images.map((_, index) => (
								<span
									key={index}
									className={index === currentSlide ? 'dot active' : 'dot'}
									onClick={() => setCurrentSlide(index)}
									role='button'
									aria-label={`Go to slide ${index + 1}`}></span>
							))}
						</div>
					</div>
				</div>

				<div className='clinicDetailsCardSection'>
					<div className='clinicDetailsCard'>
						<div className='clinicDetailsInfo'>
							<h3 className='clinicDetailsName'>About the Clinic</h3>
							<div className='clinicDetailsDetails'>
								<div className='detail-row'>
									<p className='detail-item'>
										<FaMapMarkerAlt />{' '}
										{displayValue(clinic.location?.governorate)}
									</p>
									<p className='detail-item'>
										<LuHeartHandshake /> {displayValue(clinic.vacationStatus)}
									</p>
									<p className='detail-item'>
										<HiClock /> {displayValue(clinic.workingHours)}
									</p>
								</div>
								<div className='detail-row'>
									<p className='detail-item'>
										<RiMoneyDollarCircleFill />{' '}
										{clinic.servicePrice
											? `${clinic.servicePrice} ${clinic.currency || 'LE'}`
											: 'Not specified'}
									</p>
									<a
										href={emailLink}
										className='detail-item shifted-left'
										target='_blank'
										rel='noopener noreferrer'>
										<FaEnvelope /> {displayValue(clinic.email)}
									</a>
								</div>
								<p className='detail-item specialist'>
									<FaUserMd /> Specialist:{' '}
									<span className='specialist-text'>
										{displayValue(clinic.specialties)}
									</span>
								</p>
							</div>
						</div>
						<div className='contactLinks'>
							{clinic.mobile && (
								<a
									href={whatsappLink}
									target='_blank'
									rel='noopener noreferrer'
									className='contactLink whatsapp'>
									<FaWhatsapp size={20} /> Connect Via WhatsApp
								</a>
							)}
							{clinic.email && (
								<a
									href={emailLink}
									className='contactLink email'
									target='_blank'
									rel='noopener noreferrer'>
									<MdEmail size={20} /> Connect Via Mail
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default ClinicDetails;
