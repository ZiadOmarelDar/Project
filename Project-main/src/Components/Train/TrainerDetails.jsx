import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './TrainerDetails.css';

const addGoogleFonts = () => {
	const link = document.createElement('link');
	link.href =
		'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap';
	link.rel = 'stylesheet';
	document.head.appendChild(link);
};

const TrainerDetails = () => {
	const { trainerId } = useParams();
	const navigate = useNavigate();
	const [trainerData, setTrainerData] = useState(null);
	const [serviceData, setServiceData] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		addGoogleFonts();
	}, []);

	useEffect(() => {
		const fetchTrainerData = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setError('Please log in to view trainer details.');
				navigate('/login');
				return;
			}

			try {
				const trainerResponse = await axios.get(
					`http://localhost:3001/user/${trainerId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setTrainerData(trainerResponse.data.user);

				const serviceResponse = await axios.get(
					`http://localhost:3001/user/services/${trainerId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setServiceData(serviceResponse.data.service);

				setError('');
			} catch (err) {
				setError(
					err.response?.data?.message ||
						'Error fetching trainer details. Please try again.'
				);
				if (err.response?.status === 401) {
					localStorage.removeItem('token');
					navigate('/login');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchTrainerData();
	}, [trainerId, navigate]);

	if (loading) return <p>Loading trainer details...</p>;
	if (error) return <p className='error-2777'>{error}</p>;
	if (!trainerData || !serviceData)
		return <p>No trainer service data available.</p>;

	return (
		<div className='trainer-details-container-2777'>
			<h2>Trainer Information:</h2>
			<div className='trainer-content-2777'>
				<div className='trainer-image-container-2777'>
					{trainerData.userPhoto && trainerData.userPhoto !== 'not found' ? (
						<img
							src={`http://localhost:3001${trainerData.userPhoto}`}
							alt='Trainer'
							className='trainer-image-2777'
						/>
					) : (
						<FaUserCircle className='trainer-icon-2777' />
					)}
				</div>
				<div className='trainer-info-2777'>
					<p>
						<strong>Trainer Name:</strong> {trainerData.name || 'John Doe'}
					</p>
					<p>
						<strong>Specialty:</strong>
						{trainerData.specialty || 'Obedience Training'}
					</p>
					<p>
						<strong>Contact Info:</strong>
					</p>
					<p>
						<strong>▪ Email:</strong>
						<a href={`mailto:${trainerData.email}`}>
							{trainerData.email || 'john.doe@example.com'}
						</a>
						<strong>
							<br />▪ Phone:
						</strong>
						{trainerData.mobile || '0121901846'}
					</p>
					<p>
						<strong>Breed Suitability:</strong>
						{trainerData.breedSuitability ||
							'Small Breeds, Medium Breeds, Large Breeds'}
					</p>
					<p>
						<strong>Available Programs:</strong>
						{trainerData.availablePrograms ||
							'Private Sessions, Online Training'}
					</p>
					<div className='contactLinks-2777'>
						<a
							href={`https://wa.me/${trainerData.mobile}`}
							className='contactLink-2777 whatsapp-2777'>
							<FaWhatsapp /> Connect via WhatsApp
						</a>
						<a
							href={`mailto:${trainerData.email}`}
							className='contactLink-2777 email-2777'>
							<FaEnvelope /> Connect via Mail
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrainerDetails;
