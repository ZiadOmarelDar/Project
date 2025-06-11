import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ClinicAdmin.css";

const ClinicAdmin = () => {
  const { adminId } = useParams();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/api/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Admin Data:", response.data.admin); // Debug the response
        setAdmin(response.data.admin);
      } catch (err) {
        console.error("Error fetching admin details:", err.response ? err.response.data : err.message);
      }
    };
    fetchAdminDetails();
  }, [adminId]);

  if (!admin) return <div>Loading...</div>;

  const handleImageClick = (photoUrl) => {
    const fullUrl = photoUrl.startsWith('http') ? photoUrl : `http://localhost:3001${photoUrl}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="adminContainer">
      <div className="adminCard">
        <h2 className="adminTitle">Admin Profile</h2>
        <div className="adminProfile">
          <img
            src={admin.image || "/default-image.png"} // Default image if none provided
            alt={`${admin.name || "Admin"} photo`}
            className="adminImage"
            onClick={() => handleImageClick(admin.image || "/default-image.png")}
            onError={(e) => { e.target.src = "/default-image.png"; }} // Fallback on error
          />
          <div className="adminText">
            <h3>{admin.name || "Unknown Admin"}</h3>
            <p><strong>Email:</strong> {admin.email || "Not provided"}</p>
            <p><strong>Description:</strong> {admin.description || "No description available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicAdmin;