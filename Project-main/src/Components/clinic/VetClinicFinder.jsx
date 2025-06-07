import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VetClinicFinder.css";
import cl from "../../assets/clinic1.png";
import { BiSearchAlt } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { RiFirstAidKitLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

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
  const defaultCenter = { lat: 30.0333, lng: 31.2333 };
  const [clinics, setClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestClinics, setNearestClinics] = useState([]);
  const navigate = useNavigate();

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearbyClinics = (loc) => {
    const filtered = clinics
      .map((clinic) => ({
        ...clinic,
        distance: getDistance(loc.lat, loc.lng, clinic.location.lat || 30.0333, clinic.location.lng || 31.2333),
      }))
      .filter((clinic) => clinic.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    setNearestClinics(filtered);
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/user/all-clinics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // للتحقق من البيانات
        setClinics(response.data.clinics || []);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };
    fetchClinics();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          findNearbyClinics(loc);
        },
        (error) => {
          console.error("Error getting user location:", error);
          findNearbyClinics(defaultCenter);
        }
      );
    } else {
      findNearbyClinics(defaultCenter);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="vetFinderContainer">
        <div className="vetTopSection">
          <div className="vetTitleContainer">
            <h2 className="vetTitle">
              Why Choose<br />
              Our Vet<br />
              Clinic<br />
              Finder?
            </h2>
          </div>
          <div className="vetIllustration">
            <img src={cl} alt="clinic illustration" />
          </div>
          <div className="vetContent">
            <ul className="vetFeaturesList">
              <li>
                <BiSearchAlt className="vetIcon" />
                <div className="vetDescriptionText">
                  <h3 className="vetSubDes">Fast & Easy Search</h3>
                  <p>Find the closest vet clinics instantly.</p>
                </div>
              </li>
              <li>
                <FaClock className="vetIcon" />
                <div className="vetDescriptionText">
                  <h3 className="vetSubDes">24/7 Emergency Care</h3>
                  <p>Get urgent help when your pet needs it most.</p>
                </div>
              </li>
              <li>
                <FaUserDoctor className="vetIcon" />
                <div className="vetDescriptionText">
                  <h3 className="vetSubDes">Expert Veterinarians</h3>
                  <p>Connect with certified professionals.</p>
                </div>
              </li>
              <li>
                <RiFirstAidKitLine className="vetIcon" />
                <div className="vetDescriptionText">
                  <h3 className="vetSubDes">Comprehensive Services</h3>
                  <p>From routine check-ups to advanced treatments.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="vetMapSection">
          <h2>
            Find Your Closest Vet
            <IoIosArrowForward />
          </h2>
          <div className="vetMapWrapper">
            <APIProvider apiKey="AIzaSyC075u2Ez5JTfefMMxHadHQFZYELsVSPDc">
              <Map
                defaultZoom={6}
                center={userLocation || defaultCenter}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: "100%", height: "400px" }}
              >
                {userLocation && <Marker position={userLocation} title="Your Location" />}
                {nearestClinics.map((clinic, index) => (
                  <Marker
                    key={index}
                    position={{ lat: clinic.location.lat || 30.0333, lng: clinic.location.lng || 31.2333 }}
                    title={`${clinic.clinicName} - ${clinic.location.governorate}`}
                  />
                ))}
              </Map>
            </APIProvider>
          </div>
        </div>

        <div className="vetClinicCardsSection">
          <h2>Nearest Clinics</h2>
          <div className="vetClinicCards trainerStyle">
            {nearestClinics.map((clinic, index) => (
              <div key={index} className="vetClinicCard" onClick={() => navigate(`/clinic/${clinic._id}`)}>
                <img
                  src={clinic.clinicPhotos && clinic.clinicPhotos[0] ? `http://localhost:3001${clinic.clinicPhotos[0]}` : cl}
                  alt={`${clinic.clinicName} photo`}
                  className="vetClinicImage trainerImage"
                  onError={(e) => { e.target.src = cl; console.log("Image load error:", e); }}
                />
                <div className="vetClinicInfo">
                  <h3 className="vetClinicName">{clinic.clinicName || "Unknown Clinic"}</h3>
                  <p className="vetClinicSpecialty">{clinic.specialties && clinic.specialties[0] || "General Care"}</p>
                  <p className="vetClinicAddress">{clinic.location.governorate || "Unknown Location"}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="vetViewAllButton" onClick={() => navigate("/all-clinics")}>
            View All Clinics
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VetClinicFinder;