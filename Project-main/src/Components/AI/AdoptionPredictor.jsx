import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdoptionPredictor.css';

const AdoptionPredictor = () => {
	const [formData, setFormData] = useState({
		PetType: 'Dog',
		Breed: '',
		AgeMonths: '',
		Color: '',
		Size: 'Larg',
		WeightKg: '',
		Vaccinated: 'Yes',
		HealthCondition: 'Healthy',
		TimeInShelterDays: '',
		AdoptionFee: '',
		PreviousOwner: 'Yes',
	});
	const [result, setResult] = useState('');
	const [showResult, setShowResult] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('http://localhost:5000/predict', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (data.adoption_likelihood === 1) {
				setResult('good for adopt');
			} else {
				setResult('not good for adopt');
			}
			setShowResult(true);
		} catch (error) {
			setResult('Error predicting adoption likelihood');
			setShowResult(true);
		}
	};

	const handleCloseResult = () => {
		setShowResult(false);
		setResult('');
	};

	return (
		<div className='page-container'>
			{/* Navigation Bar */}
			<nav className='navbar-50'>
				<ul className='nav-list-50'>
					<li>
						<Link to='/adoption-predictor'>Adoption Likelihood Predictor</Link>
					</li>
					<li>
						<Link to='/PetChecker'>Pet Health Checker</Link>
					</li>
					<li>
						<Link to='/PetPricePredictor'>PawCost</Link>
					</li>
				</ul>
			</nav>

			{/* Main Content */}
			<form
				onSubmit={handleSubmit}
				className='form-container-50'>
				<h2>Adoption Likelihood Predictor</h2>
				<div className='form-row'>
					<div className='form-group'>
						<label>Pet Type</label>
						<select
							name='PetType'
							value={formData.PetType}
							onChange={handleChange}>
							<option value='Dog'>Dog</option>
							<option value='Cat'>Cat</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Breed</label>
						<input
							type='text'
							name='Breed'
							value={formData.Breed}
							onChange={handleChange}
							placeholder='e.g., Labrador'
						/>
					</div>
				</div>
				<div className='form-row'>
					<div className='form-group'>
						<label>Age (Months)</label>
						<input
							type='number'
							name='AgeMonths'
							value={formData.AgeMonths}
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<label>Color</label>
						<input
							type='text'
							name='Color'
							value={formData.Color}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className='form-row'>
					<div className='form-group'>
						<label>Size</label>
						<select
							name='Size'
							value={formData.Size}
							onChange={handleChange}>
							<option value='Larg'>Larg</option>
							<option value='Medium'>Medium</option>
							<option value='Small'>Small</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Weight (Kg)</label>
						<input
							type='number'
							name='WeightKg'
							value={formData.WeightKg}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className='form-row'>
					<div className='form-group'>
						<label>Vaccinated</label>
						<select
							name='Vaccinated'
							value={formData.Vaccinated}
							onChange={handleChange}>
							<option value='Yes'>Yes</option>
							<option value='No'>No</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Health Condition</label>
						<select
							name='HealthCondition'
							value={formData.HealthCondition}
							onChange={handleChange}>
							<option value='Healthy'>Healthy</option>
							<option value='Unhealthy'>Unhealthy</option>
						</select>
					</div>
				</div>
				<div className='form-row'>
					<div className='form-group'>
						<label>Time in Shelter (Days)</label>
						<input
							type='number'
							name='TimeInShelterDays'
							value={formData.TimeInShelterDays}
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<label>Adoption Fee</label>
						<input
							type='number'
							name='AdoptionFee'
							value={formData.AdoptionFee}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className='form-row'>
					<div className='form-group'>
						<label>Previous Owner</label>
						<select
							name='PreviousOwner'
							value={formData.PreviousOwner}
							onChange={handleChange}>
							<option value='Yes'>Yes</option>
							<option value='No'>No</option>
						</select>
					</div>
				</div>
				<button
					className='pre-btn'
					type='submit'>
					Predict Adoption Likelihood
				</button>
			</form>
			{showResult && (
				<div className='result'>
					<h3>
						{result === 'good for adopt'
							? 'Likely to Be Adopted'
							: 'Not Likely to Be Adopted'}
					</h3>
					<p>
						{result === 'good for adopt'
							? 'Our friend might be packing their bags soon!'
							: 'Our friend might need more care.'}
					</p>
					<button
						className='ok-btn'
						onClick={handleCloseResult}>
						Ok
					</button>
				</div>
			)}
		</div>
	);
};

export default AdoptionPredictor;
