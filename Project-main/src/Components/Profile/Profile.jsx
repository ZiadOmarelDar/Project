import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import "./Profile.css";

const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";
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
    doctorName: "",
    location: "",
    mobile: "",
    email: "",
    workingHoursFrom: "1",
    workingHoursFromPeriod: "AM",
    workingHoursTo: "12",
    workingHoursToPeriod: "PM",
    servicePriceValue: "",
    servicePriceCurrency: "EGP",
    serviceType: "",
    doctorDescription: "",
    specialty: "Obedience Training",
    availablePrograms: [], // تغيير ليكون مصفوفة
    clinicPhotos: [],
    specialties: [], // إضافة حقل specialties كمصفوفة
  });
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const timeOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const specialties = ["Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"];
  const programOptions = ["Private Sessions", "Online Training"];

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
            mobile: service.mobile || "",
            email: service.email || "",
            workingHoursFrom,
            workingHoursFromPeriod,
            workingHoursTo,
            workingHoursToPeriod,
            servicePriceValue,
            servicePriceCurrency,
            serviceType: service.serviceType || "",
            doctorDescription: service.doctorDescription || "",
            specialty: service.specialty || "Obedience Training",
            availablePrograms: service.availablePrograms || [], // تحديث ليكون مصفوفة
            clinicPhotos: service.clinicPhotos || [],
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const getFileHash = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleClinicPhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setError("Some files are not images or exceed 5MB. Only valid images will be added.");
    }

    const fileHashes = await Promise.all(validFiles.map(file => getFileHash(file)));
    const uniqueFiles = validFiles.filter((file, index) => 
      fileHashes.indexOf(fileHashes[index]) === index
    );

    setFormData((prev) => {
      const updatedPhotos = [...prev.clinicPhotos.filter(p => typeof p === 'object'), ...uniqueFiles].slice(0, 5);
      console.log("Updated clinicPhotos state:", updatedPhotos.map(f => f.name || f));
      return { ...prev, clinicPhotos: updatedPhotos };
    });
    setError("");
  };

  const handleRemovePhotoFromPreview = (indexToRemove) => {
    setFormData((prev) => {
      const newPhotos = prev.clinicPhotos.filter((_, index) => index !== indexToRemove);
      console.log("After remove, clinicPhotos state:", newPhotos.map(f => f.name || f));
      return { ...prev, clinicPhotos: newPhotos };
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3001/user/upload-photo", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUploadMessage(response.data.message);
      setUserData({ ...userData, userPhoto: response.data.imageUrl });
      setFile(null);
      setSuccess("Profile photo updated successfully!");
      setError("");
    } catch (err) {
      setUploadMessage(err.response?.data?.message || "Error uploading photo. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete("http://localhost:3001/user/remove-photo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData({ ...userData, userPhoto: "not found" });
      setUploadMessage(response.data.message);
      setSuccess("Profile photo removed successfully!");
      setError("");
    } catch (err) {
      setUploadMessage(err.response?.data?.message || "Error removing photo. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedPrograms = [...formData.availablePrograms];
    if (checked) {
      updatedPrograms.push(value);
    } else {
      updatedPrograms = updatedPrograms.filter((program) => program !== value);
    }
    setFormData({ ...formData, availablePrograms: updatedPrograms });
  };

  const validateForm = () => {
    if (!formData.mobile.match(/^\d{10,15}$/)) {
      setError("Please enter a valid mobile number (10-15 digits).");
      return false;
    }
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (userData.userType === "trainer" && formData.availablePrograms.length === 0) {
      setError("Please select at least one available program.");
      return false;
    }
    setError("");
    return true;
  };

  const handleServiceAction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("email", formData.email);

    if (userData.userType === "clinicAdmin") {
      formDataToSend.append("clinicName", formData.clinicName);
      formDataToSend.append("doctorName", formData.doctorName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("workingHours", `${formData.workingHoursFrom} ${formData.workingHoursFromPeriod} - ${formData.workingHoursTo} ${formData.workingHoursToPeriod}`);
      formDataToSend.append("servicePrice", Number(formData.servicePriceValue) || 0);
      formDataToSend.append("currency", formData.servicePriceCurrency);
      formDataToSend.append("serviceType", formData.serviceType);
      formDataToSend.append("doctorDescription", formData.doctorDescription);

      const uniquePhotos = [...new Set(formData.clinicPhotos.map(file => file.name + file.size + file.lastModified))]
        .map(key => formData.clinicPhotos.find(file => file.name + file.size + file.lastModified === key));
      uniquePhotos.forEach((photo) => {
        formDataToSend.append("clinicPhotos", photo);
      });
      console.log("Sending photos:", uniquePhotos.map(f => f.name));
    } else if (userData.userType === "trainer") {
      formDataToSend.append("specialty", formData.specialty);
      // إرسال availablePrograms كمصفوفة
      formData.availablePrograms.forEach((program) => {
        formDataToSend.append("availablePrograms", program);
      });
    }

    let response;
    try {
      if (services.length > 0) {
        response = await axios.put(`http://localhost:3001/user/services/${services[0]._id}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        setServices([response.data.service]);
        setSuccess("Service updated successfully!");
      } else {
        response = await axios.post("http://localhost:3001/user/services", formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
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

  const handleDeleteService = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (services.length > 0 && services[0]._id) {
        await axios.delete(`http://localhost:3001/user/services/${services[0]._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices([]);
        setFormData({
          clinicName: "",
          doctorName: "",
          location: "",
          mobile: "",
          email: "",
          workingHoursFrom: "1",
          workingHoursFromPeriod: "AM",
          workingHoursTo: "12",
          workingHoursToPeriod: "PM",
          servicePriceValue: "",
          servicePriceCurrency: "EGP",
          serviceType: "",
          doctorDescription: "",
          specialty: "Obedience Training",
          availablePrograms: [], // إعادة تعيين كمصفوفة فارغة
          clinicPhotos: [],
        });
        setSuccess("Service deleted successfully!");
      } else {
        setError("No service available to delete.");
      }
      setError("");
      setShowAddServiceForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting service. Please try again.");
      setSuccess("");
    }
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "Not available";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (!userData) return <p>Loading profile...</p>;
  if (error && !success) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {userData.name}!</h2>
      <div className="profile-header">
        <div className="profile-image-container">
          {userData.userPhoto && userData.userPhoto !== "not found" ? (
            <img src={`http://localhost:3001${userData.userPhoto}`} alt="Profile" className="profile-image" />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}
          <div className="upload-section">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="file-input"
              id="profile-photo-input"
              style={{ display: "none" }}
            />
            <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("profile-photo-input").click(); }} className="choose-photo-link">
              Choose Photo
            </a>
            {userData.userPhoto && userData.userPhoto !== "not found" && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleRemovePhoto(); }} className="remove-photo-link">
                Remove Photo
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); handleUpload(); }} className="upload-photo-link" style={{ display: file ? "inline" : "none" }}>
              Upload
            </a>
          </div>
        </div>
        {uploadMessage && <p className={`upload-message ${uploadMessage.includes("successfully") ? "success" : "error"}`}>{uploadMessage}</p>}
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
              {services.map((service) => (
                <li key={service._id} className="service-item">
                  <div className="service-content">
                    {service.type === "clinic" ? (
                      <>
                        <p><strong>Clinic Name:</strong> {service.clinicName}</p>
                        <p><strong>Doctor Name:</strong> {service.doctorName}</p>
                        <p><strong>Location:</strong> {service.location}</p>
                        <p><strong>Mobile:</strong> {service.mobile}</p>
                        <p><strong>Email:</strong> {service.email}</p>
                        <p><strong>Working Hours:</strong> {service.workingHours}</p>
                        <p><strong>Service Price:</strong> {service.servicePrice} {service.currency}</p>
                        <p><strong>Service Type:</strong> {service.serviceType}</p>
                        <p><strong>Doctor Description:</strong> {service.doctorDescription}</p>
                        {service.clinicPhotos && service.clinicPhotos.length > 0 && (
                          <div className="clinic-photos-section">
                            <h4>Clinic Photos</h4>
                            <div className="clinic-photos">
                              {service.clinicPhotos.map((photo, index) => (
                                <img key={index} src={`http://localhost:3001${photo}`} alt={`Clinic ${index + 1}`} className="clinic-photo-thumbnail" />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p><strong>Trainer Name:</strong> {service.trainerName || userData.name}</p>
                        <p><strong>Specialty:</strong> {service.specialty}</p>
                        <p><strong>Mobile:</strong> {service.mobile}</p>
                        <p><strong>Email:</strong> {service.email}</p>
                        <p>
                          <strong>Available Programs:</strong>{" "}
                          {service.availablePrograms && service.availablePrograms.length > 0
                            ? service.availablePrograms.join(", ")
                            : "Not provided"}
                        </p>
                      </>
                    )}
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteService(); }} className="delete-service-link">
                    Delete Service
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-services">No services available</p>
          )}

          <a href="#" onClick={(e) => { e.preventDefault(); setShowAddServiceForm(true); }} className="add-service-link">
            {services.length > 0 ? "Edit Service" : "Add Service"}
          </a>

          {showAddServiceForm && (
            <div className="add-service-form">
              <h3>{services.length > 0 ? "Edit Service" : "Add New Service"}</h3>
              <form onSubmit={handleServiceAction}>
                {userData.userType === "clinicAdmin" ? (
                  <>
                    <div className="form-group">
                      <label>Clinic Name:</label>
                      <input type="text" name="clinicName" value={formData.clinicName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Doctor Name:</label>
                      <input type="text" name="doctorName" value={formData.doctorName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Location:</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number:</label>
                      <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Clinic Photos (up to 5):</label>
                      <input type="file" name="clinicPhotos" accept="image/jpeg,image/png" onChange={handleClinicPhotosChange} multiple />
                    </div>
                    {formData.clinicPhotos.length > 0 && (
                      <div className="preview-photos-section">
                        <h4>Preview Photos</h4>
                        <div className="preview-photos">
                          {formData.clinicPhotos.map((photo, index) => (
                            <div key={index} className="preview-photo-container">
                              <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} className="preview-photo-thumbnail" />
                              <FaTrash
                                className="remove-photo-icon"
                                onClick={() => handleRemovePhotoFromPreview(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="form-group time-group">
                      <label>Working Hours:</label>
                      <div className="time-inputs">
                        <div className="time-field">
                          <select name="workingHoursFrom" value={formData.workingHoursFrom} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursFromPeriod" value={formData.workingHoursFromPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                        <span className="time-separator">to</span>
                        <div className="time-field">
                          <select name="workingHoursTo" value={formData.workingHoursTo} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursToPeriod" value={formData.workingHoursToPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group price-group">
                      <label>Service Price:</label>
                      <div className="price-inputs">
                        <input type="number" name="servicePriceValue" value={formData.servicePriceValue} onChange={handleInputChange} required min="0" />
                        <select name="servicePriceCurrency" value={formData.servicePriceCurrency} onChange={handleInputChange}>
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Service Type:</label>
                      <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Doctor Description (Education, Experience, etc.):</label>
                      <textarea name="doctorDescription" value={formData.doctorDescription} onChange={handleInputChange} required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Mobile Number:</label>
                      <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Specialty:</label>
                      <select name="specialty" value={formData.specialty} onChange={handleInputChange} required>
                        {specialties.map((spec) => <option key={spec} value={spec}>{spec}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Available Programs:</label>
                      <div className="checkbox-group">
                        {programOptions.map((program) => (
                          <label key={program}>
                            <input
                              type="checkbox"
                              value={program}
                              checked={formData.availablePrograms.includes(program)}
                              onChange={handleCheckboxChange}
                            />
                            {program}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="form-actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleServiceAction(e); }} className="save-service-link">Save Service</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowAddServiceForm(false); }} className="cancel-link">Cancel</a>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="profile-actions">
        <a href="/profile/edit" className="update-link">Update Profile</a>
      </div>
    </div>
  );
};

export default Profile;