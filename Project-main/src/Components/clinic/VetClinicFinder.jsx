import React, { useState, useEffect } from "react";
import "./VetClinicFinder.css";
import cl from "../../assets/clinic1.png";
import { BiSearchAlt } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { RiFirstAidKitLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const VetClinicFinder = () => {
  const defaultCenter = {
    lat: 30.0333,
    lng: 31.2333,
  };


  const clinics = [
    { name: 'Pet Health', address: 'Sohag - Alshahed', contact: '01211901946', lat: 26.5569, lng: 31.6948 },
    { name: 'Healthy dogs', address: 'Sohag - ALgmhoria', contact: '01090297636', lat: 26.5569, lng: 31.6948 },
    { name: 'Friends', address: 'Sohag - AL mraha', contact: '01090297636', lat: 30.0333, lng: 31.2333 },
  ];

  
  const [userLocation, setUserLocation] = useState(null);
  const [nearestClinics, setNearestClinics] = useState([]);


  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  const findNearbyClinics = (loc) => {
    const filtered = clinics
      .map((clinic) => ({
        ...clinic,
        distance: getDistance(loc.lat, loc.lng, clinic.lat, clinic.lng),
      }))
      .filter((clinic) => clinic.distance <= 50)
      .sort((a, b) => a.distance - b.distance);
    setNearestClinics(filtered);
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          findNearbyClinics(loc);
        },
        (error) => {
          console.error("Error getting user location:", error);

          setNearestClinics(clinics);
        }
      );
    } else {

      setNearestClinics(clinics);
    }
  }, []);

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
              <BiSearchAlt className="icon-10" />
              <div className="description-text">
                <h3 className="sub-des">Fast & Easy Search</h3>
                <p>Find the closest vet clinics instantly.</p>
              </div>
            </li>
            <li>
              <FaClock className="icon-10" />
              <div className="description-text">
                <h3 className="sub-des">24/7 Emergency Care</h3>
                <p>Get urgent help when your pet needs it most.</p>
              </div>
            </li>
            <li>
              <FaUserDoctor className="icon-10" />
              <div className="description-text">
                <h3 className="sub-des">Expert Veterinarians</h3>
                <p>Connect with certified professionals.</p>
              </div>
            </li>
            <li>
              <RiFirstAidKitLine className="icon-10" />
              <div className="description-text">
                <h3 className="sub-des">Comprehensive Services</h3>
                <p>From routine check-ups to advanced treatments.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Map */}
      <div className="bottom-section">
        <h2>
          Find Your Closest Vet
          <IoIosArrowForward/>
        </h2>
        <div className="map-container" style={{ height: "400px", width: "100%" }}>
          <APIProvider apiKey="AIzaSyC075u2Ez5JTfefMMxHadHQFZYELsVSPDc">
            <Map
              defaultZoom={6}
              center={userLocation || defaultCenter}
              gestureHandling={"greedy"}
              disableDefaultUI={false}
              style={{ width: "100%", height: "100%" }}
            >
              
              {userLocation && (
                <Marker
                  position={userLocation}
                  title="Your Location"
                />
              )}

              {nearestClinics.map((clinic, index) => (
                <Marker
                  key={index}
                  position={{ lat: clinic.lat, lng: clinic.lng }}
                  title={`${clinic.name} - ${clinic.address}`}
                />
              ))}
            </Map>
          </APIProvider>
        </div>
      </div>

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
            {nearestClinics.map((clinic, index) => (
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
