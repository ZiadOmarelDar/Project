import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrainersList.css";

function TrainersList() {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view trainers.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/user/trainers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainers(response.data.trainers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching trainers.");
        console.error("Error fetching trainers:", err);
      }
    };
    fetchTrainers();
  }, [navigate]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="trainers-list-container">
      <h2>All Trainers</h2>
      <div className="trainers-grid">
        {trainers.map((trainer) => (
          <div className="trainer-card" key={trainer._id}>
            <Link to={`/trainer/${trainer._id}`}>
              <img
                src={
                  trainer.userPhoto && trainer.userPhoto !== "not found"
                    ? `http://localhost:3001${trainer.userPhoto}`
                    : "https://via.placeholder.com/150"
                }
                alt={trainer.name}
                className="trainer-image"
              />
              <div className="trainer-details">
                <p className="trainer-name">{trainer.name}</p>
                <p className="trainer-specialty">{trainer.services[0]?.specialty || "Not provided"}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainersList;