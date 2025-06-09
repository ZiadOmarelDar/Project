import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PetChecker.css';
import HealthChecker from '../../assets/HealthChecker.png';
import Select from "react-select";
import { symptoms1, symptoms2, symptoms3, symptoms4, symptoms5 } from './SymptomsData';
const PetChecker = () => {
	const AnimalNameOptions = [
	{ value: "Dog", label: "Dog"},
	{ value: "Cat", label: "Cat"},
	{ value: "Rabbit", label: "Rabbit"},
	{ value: "Horse", label: "Horse"},
	{ value: "Hamster", label: "Hamster"},
];
const symptoms1Options = symptoms1.map(s => ({value: s, label: s}) );
const symptoms2Options = symptoms2.map(s => ({value: s, label: s}) );
const symptoms3Options = symptoms3.map(s => ({value: s, label: s}) );
const symptoms4Options = symptoms4.map(s => ({value: s, label: s}) );
const symptoms5Options = symptoms5.map(s => ({value: s, label: s}) );
	const [formData, setFormData] = useState({
   "AnimalName":"Dog",
   "symptoms1":"Fever",
   "symptoms2":"Diarrhea",
   "symptoms3":"Vomiting",
   "symptoms4":"Weight loss",
   "symptoms5":"Pains"
	});
	const [result, setResult] = useState(null);
	const [choices, setChoices] = useState([]);
	const handleChange = (selected, actionMeta) => {
		setFormData({ ...formData, [actionMeta.name]: selected.value });
		setChoices([...choices, selected.value]);
		console.log("Selected:", choices.length);
	};

const handleCheckHealth = async (e) => {
	e.preventDefault();
	if(choices.length < 2)alert("Please select at least 2 symptoms and pet name");
	else if (choices.length > 2) {
	console.log('Form Data:', formData);
		try {
			const response = await fetch('http://localhost:5003/predict', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
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
		}}
	};


	const closeModal = () => {
		setResult(null);
	};

	const handleChangee = (selectedOption) => {
   console.log("Selected:", selectedOption);
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
				<Select
				options={AnimalNameOptions}
				onChange={handleChange}
				placeholder="Select an animal..."
				isSearchable={true}
				name='AnimalName'
				/>
				</div>
				
				<div className='symptoms-container-checker'>
					<div className='symptom-pair-checker'>
						<div className='form-group-checker'>
							<label>Symptom 1</label>
							<Select
								options={symptoms1Options}
								onChange={handleChange}
								className='dropdown-checker'
								placeholder="Select Symptom"
								name='symptoms1'
								isSearchable={true} />
						</div>
						<div className='form-group-checker'>
							<label>Symptom 2</label>
							<Select
								options={symptoms2Options}
								onChange={handleChange}
								className='dropdown-checker'
								placeholder="Select Symptom"
								name='symptoms2'
								isSearchable={true} />
						</div>
					</div>
					<div className='symptom-pair-checker'>
						<div className='form-group-checker'>
							<label>Symptom 3</label>
							<Select
								options={symptoms3Options}
								onChange={handleChange}
								className='dropdown-checker'
								placeholder="Select Symptom"
								name='symptoms3'
								isSearchable={true} />
						</div>
						<div className='form-group-checker'>
							<label>Symptom 4</label>
							<Select
								options={symptoms4Options}
								onChange={handleChange}
								className='dropdown-checker'
								placeholder="Select Symptom"
								name='symptoms4'
								isSearchable={true} />
						</div>
					</div>
					<div className='form-group-checker'>
						<label>Symptom 5</label>
						<Select
							options={symptoms5Options}
							onChange={handleChange}
							className='dropdown-checker'
							placeholder="Select Symptom"
							name='symptoms5'
							isSearchable={true} />
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
const options = [
	{ value: "dog", label: "Dog" },
	{ value: "cat", label: "Cat" },
	{ value: "rabbit", label: "Rabbit" },
	{ value: "horse", label: "Horse" },
	{ value: "hamster", label: "Hamster" },
];
export default PetChecker;
