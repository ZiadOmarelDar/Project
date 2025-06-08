// src/components/ClinicAdmin.jsx
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
        setAdmin(response.data.admin);
      } catch (err) {
        console.error("Error fetching admin details:", err.response ? err.response.data : err.message);
      }
    };
    fetchAdminDetails();
  }, [adminId]);

  if (!admin) return <div>Loading...</div>;

  const handleImageClick = (photoUrl) => {
    window.open(photoUrl.startsWith('http') ? photoUrl : `http://localhost:3001${photoUrl}`, "_blank");
  };

  return (
    <div className="adminContainer">
      <div className="adminCard">
        <h2 className="adminTitle">Admin Profile</h2>
        <div className="adminProfile">
          <img
            src={admin.image || "/default-image.png"} // استبدل /default-image.png بمسار صورة افتراضية
            alt={`${admin.name || "Admin"} photo`}
            className="adminImage"
            onClick={() => handleImageClick(admin.image || "/default-image.png")}
          />
          <div className="adminText">
            <h3>{admin.name || "Unknown Admin"}</h3>
            <p>{admin.description || "No description available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicAdmin;