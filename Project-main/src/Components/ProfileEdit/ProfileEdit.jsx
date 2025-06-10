import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileEdit.css";

const ProfileEdit = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const defaultImage = "https://via.placeholder.com/250";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ general: "Please log in to edit your profile." });
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
        setErrors({});
      } catch (err) {
        setErrors({
          general:
            err.response?.data?.message ||
            "Error fetching profile data. Please try again.",
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format.";

    if (newPassword && !currentPassword)
      newErrors.currentPassword =
        "Current password is required to change password.";
    if (newPassword && newPassword.length < 6)
      newErrors.newPassword =
        "New password must be at least 6 characters long.";
    if (newPassword && newPassword !== confirmPassword)
      newErrors.confirmPassword = "New passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/user/update",
        { name, username, email, currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/profile");
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      const errorMessage =
        err.response?.data?.message ||
        "Error updating profile. Please try again.";
      setErrors({ general: errorMessage });
      setSuccess("");
    }
  };

  if (!userData) return <p>Loading profile...</p>;
  if (errors.general) return <p className="error">{errors.general}</p>;

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleUpdate} className="profile-edit-form">
        <div className="form-edit-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-edit-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="form-edit-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-edit-group">
          <label>User Type:</label>
          <input type="text" value={userData.userType} disabled />
        </div>

        {/* Profile picture preview + change photo - moved here */}
        <div className="profile-picture-section">
          <img src={profileImage || defaultImage} alt="Profile" />
          <label htmlFor="upload-photo" className="change-photo-btn">
            Change Photo
          </label>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        <div className="form-edit-group">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={isLoading}
          />
          {errors.currentPassword && (
            <p className="error">{errors.currentPassword}</p>
          )}
        </div>

        <div className="form-edit-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isLoading}
          />
          {errors.newPassword && <p className="error">{errors.newPassword}</p>}
        </div>

        <div className="form-edit-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
