import React, { useState, useEffect, Component } from "react";
import { useParams, Link } from "react-router-dom";
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
        console.log("Clinic Data:", response.data.clinic); // للتحقق من البيانات
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
    window.open(photoUrl.startsWith('http') ? photoUrl : `http://localhost:3001${photoUrl}`, "_blank");
  };

  const whatsappLink = clinic.mobile
    ? `https://wa.me/${clinic.mobile.replace(/[^\d]/g, '')}`
    : "#";
  const emailLink = clinic.email ? `mailto:${clinic.email}` : "#";

  // استخراج adminId مع خيارات متعددة
  const adminId = clinic.admin?._id || clinic.admin?.id || clinic.admin?.userId; // عدّل حسب الحقل الفعلي

  return (
    <ErrorBoundary>
      <div className="clinicDetailsContainer">
        <div className="clinicDetailsTopSection">
          <h2 className="clinicDetailsTitle">
            {clinic.clinicName || "Unknown Clinic"}<br />
            Details
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
              {imageCount >= 1 && clinicPhotos.slice(0, 2).map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001${photo}`}
                  alt={`${clinic.clinicName || "Clinic"} photo ${index + 1}`}
                  className={index === 0 && imageCount === 1 ? "clinicImage singleImage" : "clinicImage doubleImage"}
                  onClick={() => handleImageClick(`http://localhost:3001${photo}`)}
                  onError={(e) => { e.target.src = cl; }}
                />
              ))}
            </div>

            <div className="clinicDetailsInfo">
              <h3 className="clinicDetailsName">{clinic.clinicName || "No name available"}</h3>
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
                <FaWhatsapp size={20} />
                <span className="contactText">Contact via WhatsApp</span>
              </a>
            )}
            {clinic.email && (
              <a href={emailLink} className="contactLink">
                <MdEmail size={20} />
                <span className="contactText">Contact via Email</span>
              </a>
            )}
          </div>

          {clinic && clinic.admin && adminId && (
            <div className="adminInfoBox">
              <h4 className="adminTitle">Admin Information</h4>
              <div className="adminDetails">
                <p><span className="detailLabel">Admin Name:</span> {clinic.admin.name || "Not specified"}</p>
                <p><span className="detailLabel">Admin Email:</span> {clinic.admin.email || "Not specified"}</p>
              </div>
              <Link to={`/clinic-admin/${adminId}`} className="adminLink">
                View Doctor Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClinicDetails;