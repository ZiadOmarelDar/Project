import React from "react";
import "./VetClinicFinder.css";
import cl from "../../assets/clinik1.png";
import { BiSearchAlt } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";

const VetClinicFinder = () => {
  return (
    <div className="container">
      {/* الجزء العلوي: العنوان والمميزات */}
      <div className="top-section">
        <div className="title-container-10">
          <h2 className="title-10">Why Choose Our Vet Clinic Finder?</h2>
        </div>
        <div className="illustration">
          <img src={cl} alt="clinic illustration" />
        </div>

        {/* النصوص والمميزات */}
        <div className="content">
          <ul className="features-list">
            <li>
              {/* <BiSearchAlt className="icon-10"/> */}
              <div>
                <h3>Fast & Easy Search</h3>
                <p>Find the closest vet clinics instantly.</p>
              </div>
            </li>
            <li>
              <FaClock className="icon-10"/>
              <div>
                <h3>24/7 Emergency Care</h3>
                <p>Get urgent help when your pet needs it most.</p>
              </div>
            </li>
            <li>
              <span className="icon">👩‍⚕️</span>
              <div>
                <h3>Expert Veterinarians</h3>
                <p>Connect with certified professionals.</p>
              </div>
            </li>
            <li>
              <span className="icon">🏥</span>
              <div>
                <h3>Comprehensive Services</h3>
                <p>From routine check-ups to advanced treatments.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* الجزء السفلي: الخريطة */}
      <div className="bottom-section">
        <h2>
          Find Your Closest Vet
          <span className="arrow">→</span>
        </h2>
        <div className="map-container">
          <div className="map-placeholder">
            خريطة لتحديد أقرب عيادة بيطرية (Placeholder)
          </div>
          <button className="view-larger-map">View Larger Map</button>
        </div>
      </div>
    </div>
  );
};

export default VetClinicFinder;
