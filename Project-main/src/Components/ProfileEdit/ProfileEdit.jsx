import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileEdit.css";

const ProfileEdit = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to edit your profile.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.user);
        setName(response.data.user.name);
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching profile data. Please try again."
        );
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/user/update",
        { name, username, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setError("");
      setTimeout(() => {
        navigate("/profile");
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || "Error updating profile. Please try again."
      );
      setSuccess("");
    }
  };

  if (!userData) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleUpdate} className="profile-edit-form">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>User Type:</label>
          <input type="text" value={userData.userType} disabled />
        </div>
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;