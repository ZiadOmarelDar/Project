import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PetPricePredictor.css';

const PetPricePredictor = () => {
	const [formData, setFormData] = useState({
		Animal: 'Dog',
		Breed: 'Golden Retriever',
		Gender: 'Male',
		"Health Condition": 'Vaccinated',
		Size: 'Small',
		Color: 'Mixed',
		Location: 'India',
		Training: 'Basic Training',
		Popularity: 'High',
		Age: 6,
	});
	const [price, setPrice] = useState('');
	const [showPrice, setShowPrice] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

const handleSubmit = async (e) => {
   e.preventDefault();
	console.log(JSON.stringify(formData))

	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const raw = JSON.stringify({
		"Breed": formData.Breed,
		"Gender": formData.Gender,
		"Health Condition": formData['Health Condition'],
		"Animal": formData.Animal,
		"Training": formData.Training,
		"Size": formData.Size,
		"Color": formData.Color,
		"Location": formData.Location,
		"Popularity": formData.Popularity,
		"Age": formData.Age
	});

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow"
	};

	fetch("http://127.0.0.1:5001/predict", requestOptions)
		.then((response) => response.json())
		.then((result) => setPrice(result.predicted_price))
		.then((result) => setShowPrice(true));
	};

	const handleClosePrice = () => {
		setShowPrice(false);
		setPrice('');
	};

	return (
		<div className='page-container-100'>
			{/* Navigation Bar */}
			<nav className='navbar-50'>
				<ul className='nav-list-50'>
					<li>
						<Link to='/AdoptionPredictor'>Adoption Likelihood Predictor</Link>
					</li>
					<li>
						<Link to='/PetChecker'>Pet Health Checker</Link>
					</li>
					<li>
						<Link to='/pawcost'>PawCost</Link>
					</li>
				</ul>
			</nav>
			<form
				onSubmit={handleSubmit}
				className='form-container-100'>
				<h2>Pet Price Predictor</h2>
				<div className='form-row-100'>
					<div className='form-group-100'>
						<label>Animal Type</label>
						<select
							name='Animal'
							value={formData.animalType}
							onChange={handleChange}>
							<option value='Dog'>Dog</option>
							<option value='Cat'>Cat</option>
							<option value='Bird'>Bird</option>
							<option value='Hamster'>Hamster</option>
							<option value='Rabbit'>Rabbit</option>
						</select>
					</div>
					<div className='form-group-100'>
						<label>Gender</label>
						<select
							name='Gender'
							value={formData.gender}
							onChange={handleChange}>
							<option value='Male'>Male</option>
							<option value='Female'>Female</option>
						</select>
					</div>
				</div>
				<div className='form-row-100'>
					<div className='form-group-100'>
						<label>Breed</label>
						<select
							name='Breed'
							value={formData.Breed}
							onChange={handleChange}
						>
							<optgroup label="Dog">
								<option value="Beagle">Beagle</option>
								<option value="Bulldog">Bulldog</option>
								<option value="Golden Retriever">Golden Retriever</option>
								<option value="Labrador">Labrador</option>
								<option value="Poodle">Poodle</option>
							</optgroup>
							
							<optgroup label="Cat">
								<option value="Bengal">Bengal</option>
								<option value="Maine Coon">Maine Coon</option>
								<option value="Persian">Persian</option>
								<option value="Siamese">Siamese</option>
								<option value="Sphynx">Sphynx</option>
							</optgroup>
							
							<optgroup label="Bird">
								<option value="Canary">Canary</option>
								<option value="Cockatiel">Cockatiel</option>
								<option value="Finch">Finch</option>
								<option value="Macaw">Macaw</option>
								<option value="Parrot">Parrot</option>
							</optgroup>

							<optgroup label="Hamster">
								<option value="Campbell's">Campbell's</option>
								<option value="Chinese">Chinese</option>
								<option value="Roborovski">Roborovski</option>
								<option value="Syrian">Syrian</option>
							</optgroup>

						<optgroup label="Rabbit">
							<option value="Angora">Angora</option>
							<option value="Dwarf">Dwarf</option>
							<option value="Flemish Giant">Flemish Giant</option>
							<option value="Holland Lop">Holland Lop</option>
							<option value="Mini Rex">Mini Rex</option>
							<option value="Netherland Dwarf">Netherland Dwarf</option>
						</optgroup>

						</select>
					</div>
					<div className='form-group-100'>
						<label>Size</label>
						<select
							name='Size'
							value={formData.size}
							onChange={handleChange}>
							<option value='Small'>small</option>
							<option value='Medium'>medium</option>
							<option value='Large'>large</option>
						</select>
					</div>
				</div>
				<div className='form-row-100'>
					<div className='form-group-100'>
						<label>Age</label>
						<input
							type='number'
							name='Age'
							value={formData.age}
							onChange={handleChange}
							placeholder='In Monthes'
						/>
					</div>
					<div className='form-group-100'>
						<label>Location</label>
						<select
							name='location'
							value={formData.location}
							onChange={handleChange}>
							<option value='Australia'>Australia</option>
							<option value='Canada'>Canada</option>
							<option value='France'>France</option>
							<option value='Germany'>Germany</option>
							<option value='India'>India</option>
							<option value='UK'>UK</option>
							<option value='USA'>USA</option>
							<option value='Egypt'>Egypt</option>
						</select>
					</div>
				</div>
				<div className='form-row-100'>
					<div className='form-group-100'>
						<label>Health Condition</label>
						<select
							name='Health Condition'
							value={formData.health}
							onChange={handleChange}>
							<option value='Healthy'>Healthy</option>
							<option value='Sick'>Sick</option>
							<option value='Special Needs'>Special Needs</option>
							<option value='Vaccinated'>Vaccinated</option>
						</select>
					</div>
					<div className='form-group-100'>
						<label>Training</label>
						<select
							name='training'
							value={formData.training}
							onChange={handleChange}>
							<option value='Basic Training'>Basic Training</option>
							<option value='Highly Trained'>Highly Trained</option>
							<option value='Untrained'>Untrained</option>
							<option value='Well Trained'>Well Trained</option>
						</select>
					</div>
				</div>
				<div className='form-row-100'>
					<div className='form-group-100'>
						<label>Color</label>
						<select
							name='color'
							value={formData.color}
							onChange={handleChange}>
							<option value='Mixed'>Mixed</option>
							<option value='Black'>Black</option>
							<option value='Brown'>Brown</option>
							<option value='Golden'>Golden</option>
							<option value='Grey'>Grey</option>
							<option value='Spotted'>Spotted</option>
							<option value='White'>White</option>
						</select>
					</div>
					<div className='form-group-100'>
						<label>Popularity</label>
						<select
							name='popularity'
							value={formData.popularity}
							onChange={handleChange}>
							<option value='High'>High</option>
							<option value='Low'>Low</option>
							<option value='Medium'>Medium</option>
						</select>
					</div>
				</div>
				<button
					className='price-btn'
					type='submit'>
					Predict Price
				</button>
			</form>
			{showPrice && (
				<div className='result-100'>
					Estimated Price: {price}
					<button
						className='ok-btn'
						onClick={handleClosePrice}>
						Ok
					</button>
				</div>
			)}
		</div>
	);
};

export default PetPricePredictor;
