import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./VetClinicFinder.css";
import cl from "../../assets/clinic1.png";
import { BiSearchAlt } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { RiFirstAidKitLine } from "react-icons/ri";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
    return this.props.children;
  }
}

const VetClinicFinder = () => {
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/user/all-clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        setClinics(response.data.clinics || []);
      } catch (err) {
        console.error("Error fetching all clinics:", err.response ? err.response.data : err.message);
      }
    };
    fetchAllClinics();
  }, []);

  const filteredClinics = clinics.filter((clinic) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = clinic.clinicName?.toLowerCase().includes(searchLower) || false;
    const governorateMatch = clinic.location?.governorate?.toLowerCase().includes(searchLower) || false;
    const specialtyMatch =
      clinic.specialties?.some((spec) => spec.toLowerCase().includes(searchLower)) || false;
    return nameMatch || governorateMatch || specialtyMatch;
  });

  return (
    <ErrorBoundary>
      <div className="vetClinicFinderContainer">
        <div className="headerArea">
          <div className="titleBlock">
            <h2 className="mainHeading">
              Why Choose<br />
              Our Vet<br />
              Clinic<br />
              Finder?
            </h2>
          </div>
          <div className="imageDisplay">
            <img src={cl} alt="clinic illustration" />
          </div>
          <div className="infoSection">
            <ul className="featureItems">
              <li>
                <BiSearchAlt className="featureIcon" />
                <div className="textDetails">
                  <h3 className="subTitle">Fast & Easy Search</h3>
                  <p>Find the closest vet clinics instantly.</p>
                </div>
              </li>
              <li>
                <FaClock className="featureIcon" />
                <div className="textDetails">
                  <h3 className="subTitle">24/7 Emergency Care</h3>
                  <p>Get urgent help when your pet needs it most.</p>
                </div>
              </li>
              <li>
                <FaUserDoctor className="featureIcon" />
                <div className="textDetails">
                  <h3 className="subTitle">Expert Veterinarians</h3>
                  <p>Connect with certified professionals.</p>
                </div>
              </li>
              <li>
                <RiFirstAidKitLine className="featureIcon" />
                <div className="textDetails">
                  <h3 className="subTitle">Comprehensive Services</h3>
                  <p>From routine check-ups to advanced treatments.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="vetClinicFinderCardsSection">
          <h2 className="sectionTitle-33">Our Clinics</h2>
          <div className="vetClinicFinderCards trainerStyle">
            {filteredClinics.slice(0, 3).map((clinic, index) => (
              <div key={index} className="clinicCard" onClick={() => navigate(`/clinic/${clinic._id}`)}>
                <img
                  src={clinic.clinicPhotos && clinic.clinicPhotos[0] ? `http://localhost:3001${clinic.clinicPhotos[0]}` : cl}
                  alt={`${clinic.clinicName} photo`}
                  className="clinicImage"
                  onError={(e) => { e.target.src = cl; console.log("Image load error:", e); }}
                />
                <div className="clinicInfo">
                  <h3 className="clinicName">{clinic.clinicName || "Unknown Clinic"}</h3>
                  <p className="clinicSpecialty">{clinic.specialties && clinic.specialties[0] || "General Care"}</p>
                  <p className="clinicLocation">{clinic.location.governorate || "Unknown Location"}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredClinics.length === 0 && <p className="noResults">No clinics found matching your search.</p>}
          <Link to="/AllClinics">
            <button className="seeMoreButton">See Our Clinics</button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VetClinicFinder;