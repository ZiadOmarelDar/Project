// src/components/PetTravelRequirements/PetTravelRequirements.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import dogWithBage from "../../assets/dogWithBage.png"; 
import "./PetTravelRequirements.css";
import { CgFileDocument } from "react-icons/cg";
import { GiMiracleMedecine } from "react-icons/gi";
import { SiPinboard } from "react-icons/si";


const PetTravelRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [selectedType, setSelectedType] = useState("Dog");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredRequirement, setFilteredRequirement] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get("http://localhost:3001/travel-requirements");
        setRequirements(response.data);
        if (response.data.length > 0) {
          setSelectedCountry(response.data[0].country);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching travel requirements");
      }
    };
    fetchRequirements();
  }, []);

  useEffect(() => {
    const requirement = requirements.find(
      (req) => req.type === selectedType && req.country === selectedCountry
    );
    setFilteredRequirement(requirement || null);
  }, [selectedType, selectedCountry, requirements]);

  const countries = [...new Set(requirements.map((req) => req.country))];

  return (
    <div className="travel-requirements-container">
      <div className="travel-hero">
      <h1>Pet Travel Requirements</h1>
      <pre className="subtitle-5">Travel with Your Pet with Ease!</pre>
      <img src={dogWithBage} alt="Dog with Baggage" className="travel-image" />
      </div>

      <div className="selectors">
        <div className="selector-group">
          <label>Select Your Animal Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </div>
        <div className="selector-group">
          <label>Select Your Destination Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={!countries.length}
          >
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredRequirement ? (
        <div className="requirements-content">
          <div className="section1 documents">
            <h2 className="doc-1"><CgFileDocument/>Documents Required</h2>
            <ul>
              {filteredRequirement.documentsRequired.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
            <p className="make"><SiPinboard className="pin" /> Make sure all documents are valid and issued within the correct timeframe</p>
          </div>

          <div className="section1 vaccinations">
            
            <h2 className="doc-2"><GiMiracleMedecine />Vaccinations Required</h2>
            <pre className="keep" >Keep your pet healthy and compliant with entry laws:</pre>
            <ul>
              {filteredRequirement.vaccinationsRequired.map((vac, index) => (
                <li key={index}>{vac}</li>
              ))}
            </ul>
          </div>

          <div className="section1 comfort-tips">
            <h2>Comfort Tips for Your Pet</h2>
            <div className="tips-grid">
              {filteredRequirement.comfortTips.map((tip, index) => (
                <div key={index} className="tip-card">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No requirements found for the selected type and country.</p>
      )}
    </div>
  );
};

export default PetTravelRequirements;