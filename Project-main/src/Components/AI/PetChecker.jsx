import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PetChecker.css';
import HealthChecker from '../../assets/HealthChecker.png';

const PetChecker = () => {
	const [animalType, setAnimalType] = useState('Dog');
	const [symptoms, setSymptoms] = useState(['', '', '', '', '']);
	const [result, setResult] = useState(null);

	const symptomOptions = [
		'Fever',
		'Diarrhea',
		'Vomiting',
		'Weight Loss',
		'Pains',
		'Cough',
		'Lethargy',
	];

	const handleAnimalChange = (e) => {
		setAnimalType(e.target.value);
	};

	const handleSymptomChange = (index, e) => {
		const newSymptoms = [...symptoms];
		newSymptoms[index] = e.target.value;
		setSymptoms(newSymptoms);
	};

	const handleCheckHealth = async () => {
		const data = {
			animalType,
			symptoms: symptoms.filter((symptom) => symptom !== ''),
		};

		try {
			const response = await fetch('http://localhost:5000/predict', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('API Response:', result);
			setResult(result);
		} catch (error) {
			console.error('Error fetching health check:', error);
			setResult({
				prediction: 'Error',
				message: `Failed to check health: ${error.message}`,
			});
		}
	};

	const closeModal = () => {
		setResult(null);
	};

	return (
		<div className='health-checker-container'>
			<nav className='navbar-50'>
				<ul className='nav-list-50'>
					<li>
						<Link to='/AdoptionPredictor'>Adoption Likelihood Predictor</Link>
					</li>
					<li>
						<Link to='/PetChecker'>Pet Health Checker</Link>
					</li>
					<li>
						<Link to='/PetPricePredictor'>PawCost</Link>
					</li>
				</ul>
			</nav>
			<div className='header-section-checker'>
				<h1>
					Pet <br /> Health <br /> Checker
				</h1>
				<p>
					Worried about your pet?
					<br /> Let's sniff out the symptoms and see if it's just a sneeze or a
					furry emergency!
				</p>
				<img
					src={HealthChecker}
					alt='Pet with owner'
					className='header-image-checker'
				/>
			</div>
			<div className='form-section-checker'>
				<div className='form-group-checker'>
					<label>Animal Type</label>
					<select
						value={animalType}
						onChange={handleAnimalChange}
						className='dropdown-checker'>
						<option value='Dog'>Dog</option>
						<option value='Cat'>Cat</option>
						<option value='Bird'>Bird</option>
						<option value='Other'>Other</option>
					</select>
				</div>
				<div className='symptoms-container-checker'>
					<div className='symptom-pair-checker'>
						<div className='form-group-checker'>
							<label>Symptom 1</label>
							<select
								value={symptoms[0]}
								onChange={(e) => handleSymptomChange(0, e)}
								className='dropdown-checker'>
								<option value=''>Select Symptom</option>
								{symptomOptions.map((option) => (
									<option
										key={option}
										value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
						<div className='form-group-checker'>
							<label>Symptom 2</label>
							<select
								value={symptoms[1]}
								onChange={(e) => handleSymptomChange(1, e)}
								className='dropdown-checker'>
								<option value=''>Select Symptom</option>
								{symptomOptions.map((option) => (
									<option
										key={option}
										value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className='symptom-pair-checker'>
						<div className='form-group-checker'>
							<label>Symptom 3</label>
							<select
								value={symptoms[2]}
								onChange={(e) => handleSymptomChange(2, e)}
								className='dropdown-checker'>
								<option value=''>Select Symptom</option>
								{symptomOptions.map((option) => (
									<option
										key={option}
										value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
						<div className='form-group-checker'>
							<label>Symptom 4</label>
							<select
								value={symptoms[3]}
								onChange={(e) => handleSymptomChange(3, e)}
								className='dropdown-checker'>
								<option value=''>Select Symptom</option>
								{symptomOptions.map((option) => (
									<option
										key={option}
										value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className='form-group-checker'>
						<label>Symptom 5</label>
						<select
							value={symptoms[4]}
							onChange={(e) => handleSymptomChange(4, e)}
							className='dropdown-checker'>
							<option value=''>Select Symptom</option>
							{symptomOptions.map((option) => (
								<option
									key={option}
									value={option}>
									{option}
								</option>
							))}
						</select>
					</div>
				</div>
				<button
					className='check-button-checker'
					onClick={handleCheckHealth}>
					Check Health Status
				</button>
			</div>

			{result && (
				<div
					className='modal-overlay'
					onClick={closeModal}>
					<div
						className='modal-content'
						onClick={(e) => e.stopPropagation()}>
						{result.prediction === 'Dangerous' ? (
							<div className='warning-modal'>
								<h2>Warning!!</h2>
								<p>
									This pet may be in danger. Please see a vet as soon as
									possible
								</p>
								<button
									className='close-button'
									onClick={closeModal}>
									×
								</button>
							</div>
						) : result.prediction === 'Not Dangerous' ? (
							<div className='good-news-modal'>
								<h2>Good news!</h2>
								<p>This pet seems to be okay. No urgent signs detected</p>
								<button
									className='close-button'
									onClick={closeModal}>
									×
								</button>
							</div>
						) : (
							<div className='error-modal'>
								<h2>Error</h2>
								<p>{result.message}</p>
								<button
									className='close-button'
									onClick={closeModal}>
									×
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default PetChecker;
