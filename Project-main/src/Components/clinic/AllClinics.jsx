import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import axios from "axios";
import "./AllClinics.css";
import cl from "../../assets/doctor.png";

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

const AllClinics = () => {
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
      <div className="allClinicsContainer">
        <div className="allClinicsTopSection">
          <div className="allClinicsTitleContainer">
            <h2 className="allClinicsTitle">
              All Vet Clinics
            </h2>
          </div>
          <div className="searchContainer">
            <div className="searchBar">
              <BiSearchAlt className="searchIcon" />
              <input
                type="text"
                placeholder="Search For Your Nearest Clinic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchInput"
              />
            </div>
          </div>
        </div>

        <div className="allClinicsCardsSection">
          <h2>Available Clinics</h2>
          <div className="allClinicsCards trainerStyle">
            {filteredClinics.map((clinic, index) => (
              <div key={index} className="allClinicsCard" onClick={() => navigate(`/clinic/${clinic._id}`)}>
                <img
                  src={clinic.clinicPhotos && clinic.clinicPhotos[0] ? `http://localhost:3001${clinic.clinicPhotos[0]}` : cl}
                  alt={`${clinic.clinicName} photo`}
                  className="allClinicsImage trainerImage"
                  onError={(e) => { e.target.src = cl; console.log("Image load error:", e); }}
                />
                <div className="allClinicsInfo">
                  <h3 className="allClinicsName">{clinic.clinicName || "Unknown Clinic"}</h3>
                  <p className="allClinicsSpecialty">{clinic.specialties && clinic.specialties[0] || "General Care"}</p>
                  <p className="allClinicsAddress">{clinic.location.governorate || "Unknown Location"}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredClinics.length === 0 && <p className="noResults">No clinics found matching your search.</p>}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AllClinics;