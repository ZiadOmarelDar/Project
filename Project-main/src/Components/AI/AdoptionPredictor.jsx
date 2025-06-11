import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdoptionPredictor.css';

const AdoptionPredictor = () => {
	const [formData, setFormData] = useState({
		PetType: 'Dog',
		Breed: 'Labrador',
		AgeMonths: '5',
		Color: 'Black',
		Size: 'Large',
		WeightKg: '5.5',
		Vaccinated: '1',
		HealthCondition: '0',
		TimeInShelterDays: '45',
		AdoptionFee: '100',
		PreviousOwner: '1',
	});
	const [result, setResult] = useState('');
	const [showResult, setShowResult] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData)
		try {
			const response = await fetch('http://localhost:5002/predict', {
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
							<option value='Bird'>Bird</option>
							<option value='Rabbit'>Rabbit</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Breed</label>
						<select
							name='Breed'
							value={formData.Breed}
							onChange={handleChange}>
							<optgroup label="Dogs">
								<option value="Golden Retriever">Golden Retriever</option>
								<option value="Labrador">Labrador</option>
								<option value="Poodle">Poodle</option>
							</optgroup>
							<optgroup label="Cats">
								<option value="Persian">Persian</option>
								<option value="Siamese">Siamese</option>
							</optgroup>
							<optgroup label="Birds">
								<option value="Golden Retriever">Parakeet</option>
							</optgroup>
							<optgroup label="Rabbit">
								<option value="Golden Retriever">Rabbit</option>
							</optgroup>
						</select>
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
							placeholder='age by month'
						/>
					</div>
					<div className='form-group'>
						<label>Color</label>
						<select
							name='Color'
							value={formData.Color}
							onChange={handleChange}
						>
						<option value='Black'>Black</option>
						<option value='Brown'>Brown</option>
						<option value='White'>White</option>
						<option value='Gray'>Gray</option>
						<option value='Orange'>Orange</option>
						</select>
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
							placeholder='whight by kg'
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
							<option value='1'>Yes</option>
							<option value='0'>No</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Health Condition</label>
						<select
							name='HealthCondition'
							value={formData.HealthCondition}
							onChange={handleChange}>
							<option value='1'>have a disabled</option>
							<option value='0'>not have</option>
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
							placeholder='time in shelter by days'
						/>
					</div>
					<div className='form-group'>
						<label>Adoption Fee</label>
						<input
							type='number'
							name='AdoptionFee'
							value={formData.AdoptionFee}
							onChange={handleChange}
							placeholder='adoption fee by $'
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
							<option value='1'>Yes</option>
							<option value='0'>No</option>
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
							{result}
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
