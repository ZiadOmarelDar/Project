import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "./TrainerDetails.css";

const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const TrainerDetails = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    addGoogleFonts();
  }, []);

  useEffect(() => {
    const fetchTrainerData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view trainer details.");
        navigate("/login");
        return;
      }

      try {
        const trainerResponse = await axios.get(`http://localhost:3001/user/${trainerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainerData(trainerResponse.data.user);

        const serviceResponse = await axios.get(`http://localhost:3001/user/services/${trainerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServiceData(serviceResponse.data.service);

        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching trainer details. Please try again.");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [trainerId, navigate]);

  if (loading) return <p>Loading trainer details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!trainerData || !serviceData) return <p>No trainer service data available.</p>;

  return (
    <div className="trainer-details-container">
      <h2>Trainer Service Details</h2>
      <div className="trainer-header">
        <div className="trainer-image-container">
          {trainerData.userPhoto && trainerData.userPhoto !== "not found" ? (
            <img src={`http://localhost:3001${trainerData.userPhoto}`} alt="Trainer" className="trainer-image" />
          ) : (
            <FaUserCircle className="trainer-icon" />
          )}
        </div>
      </div>
      <div className="trainer-details">
        <p><strong>Email:</strong> {serviceData.email || "Not provided"}</p>
        <p><strong>Mobile:</strong> {serviceData.mobile || "Not provided"}</p>
        <p><strong>Specialty:</strong> {serviceData.specialty || "Not provided"}</p>
        <p>
          <strong>Available Programs:</strong>{" "}
          {serviceData.availablePrograms && serviceData.availablePrograms.length > 0
            ? serviceData.availablePrograms.join(", ")
            : "Not provided"}
        </p>
      </div>
      <div className="trainer-actions">
        <a href={`mailto:${serviceData.email}`} className="contact-link">Contact via Email</a>
        <a href={`tel:${serviceData.mobile}`} className="contact-link">Contact via Phone</a>
      </div>
    </div>
  );
};

export default TrainerDetails;