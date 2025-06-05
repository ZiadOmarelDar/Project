import React, { useState } from 'react';
import './PetAgeCalculator.css';

const PetAgeCalculator = () => {
  const [petType, setPetType] = useState('Dog');
  const [petAge, setPetAge] = useState(2);

  const calculateHumanAge = (age) => {
    if (age <= 0) return 0;
    if (age === 1) return 15;
    if (age === 2) return 15 + 9;
    return 15 + 9 + (age - 2) * 5;
  };

  const humanAge = calculateHumanAge(petAge);

  return (
    <div className="pet-age-calculator">
      <div className="header">
        <h1>How Old Is Your Pet in Human Years?</h1>
        <p>A 1-year-old dog is like a teenager!</p>
      </div>

      <div className="form-container">
        <label>Choose your pet:</label>
        <select
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
          className="pet-select"
        >
          <option value="Dog">Dog</option>
        </select>

        <label>Select the pet's age in years (1-20):</label>
        <input
          type="range"
          min="1"
          max="20"
          value={petAge}
          onChange={(e) => setPetAge(Number(e.target.value))}
          className="age-slider"
        />

        <p className="pet-age">Pet Age: {petAge} year{petAge > 1 ? 's' : ''}</p>

        <p className="result">
          Your {petType.toLowerCase()} is about {humanAge} human years old.
        </p>

        <p className="note">Based on standard veterinary conversion charts.</p>
      </div>
    </div>
  );
};

export default PetAgeCalculator;