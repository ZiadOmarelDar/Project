import React, { useState, useEffect, Component } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ClinicDetails.css";
import cl from "../../assets/clinic1.png";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

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

const ClinicDetails = () => {
  const { clinicId } = useParams();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/user/all-clinics/${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinic(response.data.clinic || null);
      } catch (err) {
        console.error("Error fetching clinic details:", err.response ? err.response.data : err.message);
      }
    };
    fetchClinicDetails();
  }, [clinicId]);

  if (!clinic) return <div>Loading...</div>;

  const clinicPhotos = clinic.clinicPhotos || [];
  const imageCount = clinicPhotos.length;

  const handleImageClick = (photoUrl) => {
    window.open(`http://localhost:3001${photoUrl}`, "_blank");
  };

  const whatsappLink = clinic.mobile
    ? `https://wa.me/${clinic.mobile.replace(/[^\d]/g, '')}`
    : "#";
  const emailLink = clinic.email ? `mailto:${clinic.email}` : "#";

  return (
    <ErrorBoundary>
      <div className="clinicDetailsContainer">
        <div className="clinicDetailsTopSection">
          <h2 className="clinicDetailsTitle">
            {clinic.clinicName || "Unknown Clinic"}<br />
          </h2>
        </div>

        <div className="clinicDetailsCardSection">
          <div className="clinicDetailsCard">
            <div className="clinicImages">
              {imageCount === 0 && (
                <img
                  src={cl}
                  alt={`${clinic.clinicName || "Clinic"} photo`}
                  className="clinicImage singleImage"
                  onClick={() => handleImageClick(cl)}
                />
              )}
              {imageCount === 1 && clinicPhotos[0] && (
                <img
                  src={`http://localhost:3001${clinicPhotos[0]}`}
                  alt={`${clinic.clinicName || "Clinic"} photo`}
                  className="clinicImage singleImage"
                  onClick={() => handleImageClick(clinicPhotos[0])}
                  onError={(e) => { e.target.src = cl; }}
                />
              )}
              {imageCount === 2 && clinicPhotos.slice(0, 2).map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001${photo}`}
                  alt={`${clinic.clinicName || "Clinic"} photo ${index + 1}`}
                  className="clinicImage doubleImage"
                  onClick={() => handleImageClick(photo)}
                  onError={(e) => { e.target.src = cl; }}
                />
              ))}
              {imageCount >= 3 && clinicPhotos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001${photo}`}
                  alt={`${clinic.clinicName || "Clinic"} photo ${index + 1}`}
                  className="clinicImage tripleImage"
                  onClick={() => handleImageClick(photo)}
                  onError={(e) => { e.target.src = cl; }}
                />
              ))}
            </div>

            <div className="clinicDetailsInfo">
              <div className="clinicDetailsDetails">
                <p><span className="detailLabel">Clinic Name:</span> {clinic.clinicName || "Not specified"}</p>
                <p><span className="detailLabel">Governorate:</span> {clinic.location?.governorate || "Not specified"}</p>
                <p><span className="detailLabel">Email Address:</span> {clinic.email || "Not specified"}</p>
                <p><span className="detailLabel">Working Hours:</span> {clinic.workingHours || "Not specified"}</p>
                <p><span className="detailLabel">Service Price:</span> {clinic.servicePrice ? `${clinic.servicePrice} ${clinic.currency || "EGP"}` : "Not specified"}</p>
                <p><span className="detailLabel">Service Type:</span> {clinic.serviceType || "Not specified"}</p>
                <p><span className="detailLabel">Specialties:</span> {Array.isArray(clinic.specialties) ? clinic.specialties.join(", ") : clinic.specialties || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="contactLinks">
            {clinic.mobile && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contactLink">
                <FaWhatsapp size={24} />
                <span className="contactText">Contact via WhatsApp</span>
              </a>
            )}
            {clinic.email && (
              <a href={emailLink} className="contactLink">
                <MdEmail size={24} />
                <span className="contactText">Contact via Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClinicDetails;