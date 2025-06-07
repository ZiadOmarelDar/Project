import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PetPricePredictor.css';

const PetPricePredictor = () => {
  const [formData, setFormData] = useState({
    animalType: 'Dog',
    gender: 'Male',
    breed: '',
    size: 'small',
    age: '',
    location: 'Egypt',
    health: 'Vaccinated',
    training: 'Basic Training',
    color: 'Mixed',
    popularity: 'High',
  });
  const [price, setPrice] = useState('');
  const [showPrice, setShowPrice] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple encoding based on the form values (adjust according to your model's training)
    const encodedData = [
      formData.animalType === 'Dog' ? 0 : 1, // Example: 0 for Dog, 1 for other
      formData.breed ? 3 : 0, // Placeholder, replace with real encoding
      parseInt(formData.age) || 0,
      formData.color === 'Mixed' ? 4 : 0, // Placeholder
      formData.size === 'small' ? 1 : formData.size === 'medium' ? 2 : 3, // Example
      parseFloat(formData.gender === 'Male' ? 0 : 1) || 0, // Example
      formData.location === 'Egypt' ? 0 : 1, // Placeholder
      formData.health === 'Vaccinated' ? 1 : 0,
      formData.training === 'Basic Training' ? 0 : 1, // Placeholder
      formData.popularity === 'High' ? 1 : 0, // Example
    ];

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: encodedData }),
      });
      const data = await response.json();
      setPrice(data.predicted_price);
      setShowPrice(true);
    } catch (error) {
      setPrice('Error predicting price');
      setShowPrice(true);
    }
  };

  const handleClosePrice = () => {
    setShowPrice(false);
    setPrice('');
  };

  return (
    <div className="page-container-100">
      {/* Navigation Bar */}
      <nav className="navbar-50">
        <ul className="nav-list-50">
          <li>
            <Link to="/AdoptionPredictor">Adoption Likelihood Predictor</Link>
          </li>
          <li>
            <Link to="/pet-health-checker">Pet Health Checker</Link>
          </li>
          <li>
            <Link to="/pawcost">PawCost</Link>
          </li>
        </ul>
      </nav>
      <form onSubmit={handleSubmit} className="form-container-100">
        <h2>Pet Price Predictor</h2>
        <div className="form-row-100">
          <div className="form-group-100">
            <label>Animal Type</label>
            <select name="animalType" value={formData.animalType} onChange={handleChange}>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
          <div className="form-group-100">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-row-100">
          <div className="form-group-100">
            <label>Breed</label>
            <input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="ex. Dwarf" />
          </div>
          <div className="form-group-100">
            <label>Size</label>
            <select name="size" value={formData.size} onChange={handleChange}>
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large">large</option>
            </select>
          </div>
        </div>
        <div className="form-row-100">
          <div className="form-group-100">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="ex. 2" />
          </div>
          <div className="form-group-100">
            <label>Location</label>
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="Egypt">Egypt</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-row-100">
          <div className="form-group-100">
            <label>Health</label>
            <select name="health" value={formData.health} onChange={handleChange}>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Unvaccinated">Unvaccinated</option>
            </select>
          </div>
          <div className="form-group-100">
            <label>Training</label>
            <select name="training" value={formData.training} onChange={handleChange}>
              <option value="Basic Training">Basic Training</option>
              <option value="No Training">No Training</option>
            </select>
          </div>
        </div>
        <div className="form-row-100">
          <div className="form-group-100">
            <label>Color</label>
            <select name="color" value={formData.color} onChange={handleChange}>
              <option value="Mixed">Mixed</option>
              <option value="Solid">Solid</option>
            </select>
          </div>
          <div className="form-group-100">
            <label>Popularity</label>
            <select name="popularity" value={formData.popularity} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <button className='price-btn' type="submit">Predict Price</button>
      </form>
      {showPrice && (
        <div className="result-100">
          Estimated Price: {price}
          <button className="ok-btn" onClick={handleClosePrice}>Ok</button>
        </div>
      )}
    </div>
  );
};

export default PetPricePredictor;