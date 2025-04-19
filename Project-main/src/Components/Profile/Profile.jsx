import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "./Profile.css";

// إضافة Google Fonts لخط Poppins
const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const Profile = () => {
  useEffect(() => {
    addGoogleFonts();
  }, []);

  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "", // غيرنا الاسم من doctorNameConfirmation لـ doctorName
    location: "",
    contactInfo: "",
    workingHoursFrom: "1",
    workingHoursFromPeriod: "AM",
    workingHoursTo: "12",
    workingHoursToPeriod: "PM",
    servicePriceValue: "",
    servicePriceCurrency: "EGP",
    serviceType: "",
    doctorDescription: "",
    specialty: "",
    availablePrograms: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your profile.");
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get("http://localhost:3001/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data.user);

        const servicesResponse = await axios.get("http://localhost:3001/user/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(servicesResponse.data.services);

        if (servicesResponse.data.services.length > 0) {
          const service = servicesResponse.data.services[0];
          let workingHoursFrom = "1";
          let workingHoursFromPeriod = "AM";
          let workingHoursTo = "12";
          let workingHoursToPeriod = "PM";
          let servicePriceValue = "";
          let servicePriceCurrency = "EGP";

          if (service.workingHours) {
            const [fromPart, toPart] = service.workingHours.split(" - ");
            if (fromPart) {
              const [time, period] = fromPart.split(" ");
              workingHoursFrom = time || "1";
              workingHoursFromPeriod = period || "AM";
            }
            if (toPart) {
              const [time, period] = toPart.split(" ");
              workingHoursTo = time || "12";
              workingHoursToPeriod = period || "PM";
            }
          }

          if (service.servicePrice && service.currency) {
            servicePriceValue = service.servicePrice || "";
            servicePriceCurrency = service.currency || "EGP";
          }

          setFormData({
            clinicName: service.clinicName || "",
            doctorName: service.doctorName || "",
            location: service.location || "",
            contactInfo: service.contactInfo || "",
            workingHoursFrom: workingHoursFrom,
            workingHoursFromPeriod: workingHoursFromPeriod,
            workingHoursTo: workingHoursTo,
            workingHoursToPeriod: workingHoursToPeriod,
            servicePriceValue: servicePriceValue,
            servicePriceCurrency: servicePriceCurrency,
            serviceType: service.serviceType || "",
            doctorDescription: service.doctorDescription || "",
            specialty: service.specialty || "",
            availablePrograms: service.availablePrograms || "",
          });
        }

        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile data. Please try again.");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceAction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const serviceData = { contactInfo: formData.contactInfo };

      if (userData.userType === "clinicAdmin") {
        serviceData.clinicName = formData.clinicName;
        serviceData.doctorName = formData.doctorName;
        serviceData.location = formData.location;
        serviceData.workingHours = `${formData.workingHoursFrom} ${formData.workingHoursFromPeriod} - ${formData.workingHoursTo} ${formData.workingHoursToPeriod}`;
        serviceData.servicePrice = Number(formData.servicePriceValue);
        serviceData.currency = formData.servicePriceCurrency;
        serviceData.serviceType = formData.serviceType;
        serviceData.doctorDescription = formData.doctorDescription;
        serviceData.type = "clinic";
      } else if (userData.userType === "trainer") {
        serviceData.specialty = formData.specialty;
        serviceData.availablePrograms = formData.availablePrograms;
        serviceData.type = "trainer";
      }

      let response;
      if (services.length > 0) {
        response = await axios.put("http://localhost:3001/user/services/0", serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices([response.data.service]);
        setSuccess("Service updated successfully!");
      } else {
        response = await axios.post("http://localhost:3001/user/services", serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices([response.data.service]);
        setSuccess("Service added successfully!");
      }

      setError("");
      setShowAddServiceForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving service. Please try again.");
      setSuccess("");
    }
  };

  const handleDeleteService = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/user/services/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices([]);
      setFormData({
        clinicName: "",
        doctorName: "",
        location: "",
        contactInfo: "",
        workingHoursFrom: "1",
        workingHoursFromPeriod: "AM",
        workingHoursTo: "12",
        workingHoursToPeriod: "PM",
        servicePriceValue: "",
        servicePriceCurrency: "EGP",
        serviceType: "",
        doctorDescription: "",
        specialty: "",
        availablePrograms: "",
      });
      setSuccess("Service deleted successfully!");
      setError("");
      setShowAddServiceForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting service. Please try again.");
      setSuccess("");
    }
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "Not available";
    }
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const timeOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  if (!userData) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-icon">
        <FaUserCircle size={80} />
      </div>
      <div className="profile-details">
        <p><strong>Full Name:</strong> {userData.name || "Not provided"}</p>
        <p><strong>Username:</strong> {userData.username || "Not provided"}</p>
        <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
        <p><strong>User Type:</strong> {userData.userType || "Not provided"}</p>
        <p><strong>Account Created:</strong> {formatDate(userData.createdAt)}</p>
        <p><strong>Last Updated:</strong> {formatDate(userData.updatedAt)}</p>
      </div>

      {(userData.userType === "trainer" || userData.userType === "clinicAdmin") && (
        <div className="services-section">
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
          <h3>Services Offered</h3>
          {services.length > 0 ? (
            <ul className="services-list">
              {services.map((service, index) => (
                <li key={index} className="service-item">
                  <div className="service-content">
                    {service.type === "clinic" ? (
                      <>
                        <p><strong>Clinic Name:</strong> {service.clinicName}</p>
                        <p><strong>Doctor Name:</strong> {service.doctorName}</p>
                        <p><strong>Location:</strong> {service.location}</p>
                        <p><strong>Contact Info:</strong> {service.contactInfo}</p>
                        <p><strong>Working Hours:</strong> {service.workingHours}</p>
                        <p><strong>Service Price:</strong> {service.servicePrice} {service.currency}</p>
                        <p><strong>Service Type:</strong> {service.serviceType}</p>
                        <p><strong>Doctor Description:</strong> {service.doctorDescription}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Trainer Name:</strong> {service.trainerName || userData.name}</p>
                        <p><strong>Specialty:</strong> {service.specialty}</p>
                        <p><strong>Contact Info:</strong> {service.contactInfo}</p>
                        <p><strong>Available Programs:</strong> {service.availablePrograms}</p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteService(index)}
                    className="delete-service-btn"
                  >
                    Delete Service
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-services">No services available</p>
          )}

          <button
            onClick={() => setShowAddServiceForm(true)}
            className={services.length > 0 ? "edit-service-btn" : "add-service-btn"}
          >
            {services.length > 0 ? "Edit Service" : "Add Service"}
          </button>

          {showAddServiceForm && (
            <div className="add-service-form">
              <h3>{services.length > 0 ? "Edit Service" : "Add New Service"}</h3>
              <form onSubmit={handleServiceAction}>
                {userData.userType === "clinicAdmin" ? (
                  <>
                    <div className="form-group">
                      <label>Clinic Name:</label>
                      <input
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Doctor Name:</label>
                      <input
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Location:</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Info (Number or Email):</label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group time-group">
                      <label>Working Hours:</label>
                      <div className="time-inputs">
                        <div className="time-field">
                          <select
                            name="workingHoursFrom"
                            value={formData.workingHoursFrom}
                            onChange={handleInputChange}
                            required
                          >
                            {timeOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <select
                            name="workingHoursFromPeriod"
                            value={formData.workingHoursFromPeriod}
                            onChange={handleInputChange}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                        <span className="time-separator">to</span>
                        <div className="time-field">
                          <select
                            name="workingHoursTo"
                            value={formData.workingHoursTo}
                            onChange={handleInputChange}
                            required
                          >
                            {timeOptions.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <select
                            name="workingHoursToPeriod"
                            value={formData.workingHoursToPeriod}
                            onChange={handleInputChange}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group price-group">
                      <label>Service Price:</label>
                      <div className="price-inputs">
                        <input
                          type="number"
                          name="servicePriceValue"
                          value={formData.servicePriceValue}
                          onChange={handleInputChange}
                          required
                          min="0"
                        />
                        <select
                          name="servicePriceCurrency"
                          value={formData.servicePriceCurrency}
                          onChange={handleInputChange}
                        >
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Service Type:</label>
                      <input
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Doctor Description (Education, Experience, etc.):</label>
                      <textarea
                        name="doctorDescription"
                        value={formData.doctorDescription}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Contact Info (Number or Email):</label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Specialty:</label>
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Available Programs:</label>
                      <textarea
                        name="availablePrograms"
                        value={formData.availablePrograms}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="form-actions">
                  <button type="submit" className="save-service-btn">
                    Save Service
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddServiceForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="profile-actions">
        <button onClick={() => navigate("/profile/edit")} className="update-btn">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;