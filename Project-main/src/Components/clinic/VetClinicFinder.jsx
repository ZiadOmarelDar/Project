import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VetClinicFinder.css";
import cl from "../../assets/clinic1.png";

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
        console.log("API Response:", response.data);
        setClinics(response.data.clinics || []);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };
    fetchClinics();
  }, []);

  const openLargerMap = () => {
    window.open(`https://www.google.com/maps/@${userLocation?.lat || defaultCenter.lat},${userLocation?.lng || defaultCenter.lng},10z`, "_blank");
  };

  return (
    <ErrorBoundary>
      <div className="mainContainer">
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

        <div className="mapArea">
          <h2>
            Find Your Closest Vet
            <IoIosArrowForward className="arrowIcon" />
          </h2>
          <div className="mapContainer">
            <div className="mapWrapper">
              <APIProvider apiKey="AIzaSyC075u2Ez5JTfefMMxHadHQFZYELsVSPDc">
                <Map
                  defaultZoom={6}
                  center={userLocation || defaultCenter}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  style={{ width: "100%", height: "100%" }}
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
        </div>

        <div className="clinicList">
          <h2>Nearest Clinics</h2>
          <div className="clinicCards">
            {nearestClinics.map((clinic, index) => (
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
          <button className="viewAllButton" onClick={() => navigate("/all-clinics")}>
            View All Clinics
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VetClinicFinder;