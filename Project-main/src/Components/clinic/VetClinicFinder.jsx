import React from "react";
import "./VetClinicFinder.css";
import cl from "../../assets/clinic1.png";
import { BiSearchAlt } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { RiFirstAidKitLine } from "react-icons/ri";


const VetClinicFinder = () => {

  const defaultCenter = {
    lat: 37.78825, // خط العرض
    lng: -122.4324, // خط الطول
  };

  // بيانات العيادات
  const clinics = [
    { name: 'Pet Health', address: 'Sohag - Alshahed', contact: '01211901946' },
    { name: 'Healthy dogs', address: 'Sohag - ALgmhoria', contact: '01090297636' },
    { name: 'Friends', address: 'Sohag - AL mraha', contact: '01090297636' },
  ];
  
  return (
    <div className="container">
      <div className="top-section">
        <div className="title-container-10">
          <h2 className="title-10">Why Choose Our Vet Clinic Finder?</h2>
        </div>
        <div className="illustration">
          <img src={cl} alt="clinic illustration" />
        </div>

        <div className="content">
          <ul className="features-list">
            <li>
              <BiSearchAlt className="icon-10"/>
              <div className="description-text">
                <h3 className="sub-des">Fast & Easy Search</h3>
                <p>Find the closest vet clinics instantly.</p>
              </div>
            </li>
            <li>
              <FaClock className="icon-10"/>
              <div className="description-text">
                <h3 className="sub-des">24/7 Emergency Care</h3>
                <p>Get urgent help when your pet needs it most.</p>
              </div>
            </li>
            <li>
              <FaUserDoctor className="icon-10"/>
              <div className="description-text">
                <h3 className="sub-des">Expert Veterinarians</h3>
                <p>Connect with certified professionals.</p>
              </div>
            </li>
            <li>
              <RiFirstAidKitLine className="icon-10"/>
              <div className="description-text">
                <h3 className="sub-des">Comprehensive Services</h3>
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
            
          </div>
          <button className="view-larger-map">View Larger Map</button>
        </div>
      </div>
      {/* الجزء الجديد: قائمة العيادات */}
      <div className="clinics-section">
        <table className="clinics-table">
          <thead>
            <tr>
              <th>Clinic Name</th>
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic, index) => (
              <tr key={index}>
                <td>{clinic.name}</td>
                <td>{clinic.address}</td>
                <td>{clinic.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VetClinicFinder;
