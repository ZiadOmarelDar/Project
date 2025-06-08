import React, { useState, useEffect } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import trainDog from "../../assets/Train/TrainingDog.png";
import Training1 from "../../assets/Train/Training1.png";
import Training2 from "../../assets/Train/Training2.png";
import Training3 from "../../assets/Train/Training3.png";
import "./TrainHome.css";

function TrainHome() {
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

  return (
    <>
  
      {/* Section 1: Hero */}
      <section className="train-section1">
        <div className="section1-text">
          <h1>
            Make your pet understand you, <br /> it's enough!
          </h1>
          <p>
            Learn how to train your pet effectively and provide the best care to
            ensure they thrive. From basic commands to advanced training
            techniques, we guide you every step of the way.
          </p>
        </div>
        <div className="image-train">
          <img src={trainDog} alt="Dog" />
        </div>
      </section>

      {/* Section 2: Our Pet Trainers */}
      <section className="train-section2">
        <h2 className="section2-title">Our Pet Trainers</h2>
        {error && <p className="error">{error}</p>}
        <div className="trainers-container">
          {trainers.slice(0, 4).map((trainer) => (
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
        <Link to="/trainers" className="view-all-btn">View All Trainers</Link>
      </section>

      {/* Section 3: Training Videos */}
      <section className="train-section3">
        <h2 className="section3-title">Training Videos</h2>
        <svg width="0" height="0">
          <defs>
            <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1,1 V0.45 Q0.99,0.99 0.6,0.85 Q0.15,0.65 0,0.95 V0 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="videos-container">
          <div className="video-card">
            <img src={Training1} alt="Training 1" className="video-image" />
            <div className="video-info">
              <Link to="/dogTrain">
                <FaPlayCircle className="play-icon" />
              </Link>
              <div>
                <p className="video-title">Train DOG</p>
                <p className="video-subtitle">4 free Available</p>
              </div>
            </div>
          </div>
          <div className="video-card">
            <img src={Training2} alt="Training 2" className="video-image" />
            <div className="video-info">
              <Link to="/catTrain">
                <FaPlayCircle className="play-icon" />
              </Link>
              <div>
                <p className="video-title">Train cat</p>
                <p className="video-subtitle">4 free Available</p>
              </div>
            </div>
          </div>
          <div className="video-card">
            <img src={Training3} alt="Training 3" className="video-image" />
            <div className="video-info">
              <Link to="/tips">
                <FaPlayCircle className="play-icon" />
              </Link>
              <div>
                <p className="video-title">Tips</p>
                <p className="video-subtitle">4 free Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TrainHome;