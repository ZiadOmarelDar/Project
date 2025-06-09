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
  const [success, setSuccess] = useState("");
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    location: { governorate: "", specificLocation: "" },
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
    availablePrograms: [],
    clinicPhotos: [],
    specialties: [],
  });
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const timeOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const specialties = ["Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"];
  const programOptions = ["Private Sessions", "Online Training"];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
            location: service.location || { governorate: "", specificLocation: "" },
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
            specialties: service.specialties || [],
          });
        }
      } catch (err) {
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
      setErrors((prev) => ({ ...prev, clinicPhotos: "Some files are not images or exceed 5MB. Only valid images will be added." }));
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
    setErrors((prev) => ({ ...prev, clinicPhotos: "" }));
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
    } catch (err) {
      setUploadMessage(err.response?.data?.message || "Error uploading photo. Please try again.");
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
    } catch (err) {
      setUploadMessage(err.response?.data?.message || "Error removing photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "location.governorate" || name === "location.specificLocation") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" })); // مسح الخطأ عند التعديل
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedArray = [...formData[e.target.name]];
    if (checked) {
      updatedArray.push(value);
    } else {
      updatedArray = updatedArray.filter((item) => item !== value);
    }
    setFormData({ ...formData, [e.target.name]: updatedArray });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // مسح الخطأ عند التعديل
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanedMobile = formData.mobile.replace(/[\s\-()]/g, '');

    if (!cleanedMobile.match(/^\+201[0-2,5]\d{8}$/)) {
      newErrors.mobile = "Please enter a valid Egyptian mobile number starting with +20 (e.g., +2010xxxxxxxx).";
    }

    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (userData.userType === "trainer" && formData.availablePrograms.length === 0) {
      newErrors.availablePrograms = "Please select at least one available program.";
    }

    if (userData.userType === "clinicAdmin" && formData.specialties.length === 0) {
      newErrors.specialties = "Please select at least one specialty.";
    }

    if (userData.userType === "clinicAdmin") {
      if (!formData.clinicName) newErrors.clinicName = "Clinic name is required.";
      if (!formData.doctorName) newErrors.doctorName = "Doctor name is required.";
      if (!formData.location.governorate) newErrors.location = "Governorate is required.";
      if (!formData.location.specificLocation) newErrors.location = "Specific location is required.";
      if (!formData.workingHoursFrom || !formData.workingHoursTo) newErrors.workingHours = "Working hours are required.";
      if (!formData.servicePriceValue) newErrors.servicePriceValue = "Service price is required.";
      if (!formData.serviceType) newErrors.serviceType = "Service type is required.";
      if (!formData.doctorDescription) newErrors.doctorDescription = "Doctor description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      formData.specialties.forEach((spec) => formDataToSend.append("specialties", spec));
      formData.clinicPhotos.forEach((photo) => formDataToSend.append("clinicPhotos", photo));
    } else if (userData.userType === "trainer") {
      formDataToSend.append("specialty", formData.specialty);
      formData.availablePrograms.forEach((program) => formDataToSend.append("availablePrograms", program));
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

      setErrors({});
      setShowAddServiceForm(false);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Error saving service. Please try again." });
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
          location: { governorate: "", specificLocation: "" },
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
          specialties: [],
        });
        setSuccess("Service deleted successfully!");
      } else {
        setErrors({ general: "No service available to delete." });
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Error deleting service. Please try again." });
      setSuccess("");
    }
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "Not available";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="x7k9p2m4-q1w3e5r7">
      <h2>Welcome, {userData.name}!</h2>
      <div className="v3b6n9j2-l5h8k1p4">
        <div className="z9m2k6p1-j4n7h3e5">
          {userData.userPhoto && userData.userPhoto !== "not found" ? (
            <img src={`http://localhost:3001${userData.userPhoto}`} alt="Profile" className="q2w4e6r8-t5y7u9i0" />
          ) : (
            <FaUserCircle className="m1n3b5v7-x9j0k2l4" />
          )}
          <div className="c5v8k2p9-h3j6n1m4">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="f7d9j2k5-l1m3p6v8"
              id="profile-photo-input"
              style={{ display: "none" }}
            />
            <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("profile-photo-input").click(); }} className="r4t6y8u0-p2j5m7n9">
              Choose Photo
            </a>
            {userData.userPhoto && userData.userPhoto !== "not found" && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleRemovePhoto(); }} className="k9p1m3j5-v7n2h4e6">
                Remove Photo
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); handleUpload(); }} className="b3n6k9p2-j5m8v1h4" style={{ display: file ? "inline" : "none" }}>
              Upload
            </a>
          </div>
        </div>
        {uploadMessage && <p className={`y5k8p2m9-${uploadMessage.includes("successfully") ? "s1j4n7h0" : "e3v6k9p2"}`}>{uploadMessage}</p>}
      </div>
      <div className="n4j7h1m3-p6k9v2e5">
        <p><strong>Full Name:</strong> {userData.name || "Not provided"}</p>
        <p><strong>Username:</strong> {userData.username || "Not provided"}</p>
        <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
        <p><strong>User Type:</strong> {userData.userType || "Not provided"}</p>
        <p><strong>Account Created:</strong> {formatDate(userData.createdAt)}</p>
        <p><strong>Last Updated:</strong> {formatDate(userData.updatedAt)}</p>
      </div>

      {(userData.userType === "trainer" || userData.userType === "clinicAdmin") && (
        <div className="h2j5m8v1-k9p3n6e4">
          {success && <p className="s7j2k5m9">{success}</p>}
          {errors.general && <p className="e1v4k7p0">{errors.general}</p>}
          <h3>Services Offered</h3>
          {services.length > 0 ? (
            <ul className="l3n6p9j2-m5k8v1h4">
              {services.map((service) => (
                <li key={service._id} className="j7m2k5v8-p1n4h6e9">
                  <div className="t9y2u5i8-k3p6n1m4">
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
                          <div className="v6k9p2m5-j1n4h7e3">
                            <h4>Clinic Photos</h4>
                            <div className="p3n6k9v2-h5j1m8e4">
                              {service.clinicPhotos.map((photo, index) => (
                                <img key={index} src={`http://localhost:3001${photo}`} alt={`Clinic ${index + 1}`} className="q8y1u4k7-p2m5n9j0" />
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
                  <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteService(); }} className="d5j8n2k6-v1m4p7h9">
                    Delete Service
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="n8k2m5p1">No services available</p>
          )}

          <a href="#" onClick={(e) => { e.preventDefault(); setShowAddServiceForm(true); }} className="x1j4k7p9-m2n5v8h3">
            {services.length > 0 ? "Edit Service" : "Add Service"}
          </a>

          {showAddServiceForm && (
            <div className="k3p6n9v2-j5m8h1e4">
              <h3>{services.length > 0 ? "Edit Service" : "Add New Service"}</h3>
              <form onSubmit={handleServiceAction}>
                {userData.userType === "clinicAdmin" ? (
                  <>
                    <div className="z7m2k5p9-j1n4h6e3">
                      <label>Clinic Name:</label>
                      <input type="text" name="clinicName" value={formData.clinicName} onChange={handleInputChange} required />
                      {errors.clinicName && <p className="e9v2k5m8">{errors.clinicName}</p>}
                    </div>
                    <div className="v4k7p1m3-j9n2h5e8">
                      <label>Doctor Name:</label>
                      <input type="text" name="doctorName" value={formData.doctorName} onChange={handleInputChange} required />
                      {errors.doctorName && <p className="e9v2k5m8">{errors.doctorName}</p>}
                    </div>
                    <div className="p6n9k2m5-j1h4v7e3">
                      <label>Governorate:</label>
                      <select
                        name="location.governorate"
                        value={formData.location.governorate}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Governorate</option>
                        {governorates.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                      {errors.location && <p className="e9v2k5m8">{errors.location}</p>}
                    </div>
                    <div className="h3j6n9k2-m5p1v4e7">
                      <label>Specific Location:</label>
                      <input
                        type="text"
                        name="location.specificLocation"
                        value={formData.location.specificLocation}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Street Name, Building Number"
                      />
                      {errors.location && <p className="e9v2k5m8">{errors.location}</p>}
                    </div>
                    <div className="m8k2p5n1-j4h7v9e3">
                      <label>Mobile Number:</label>
                      <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                      {errors.mobile && <p className="e9v2k5m8">{errors.mobile}</p>}
                    </div>
                    <div className="j5n8k1p4-m7h2v9e3">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                      {errors.email && <p className="e9v2k5m8">{errors.email}</p>}
                    </div>
                    <div className="n2k5p8m1-j4h7v9e3">
                      <label>Clinic Photos (up to 5):</label>
                      <input type="file"  name="clinicPhotos" accept="image/jpeg,image/png" onChange={handleClinicPhotosChange} multiple />
                      {errors.clinicPhotos && <p className="e9v2k5m8">{errors.clinicPhotos}</p>}
                    </div>
                    {formData.clinicPhotos.length > 0 && (
                      <div className="k9p2m5v8-j1n4h7e3">
                        <h4>Preview Photos</h4>
                        <div className="v3k6p9n2-h5j1m8e4">
                          {formData.clinicPhotos.map((photo, index) => (
                            <div key={index} className="p7m2k5v9-j1n4h6e3">
                              <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} className="q8y1u4k7-p2m5n9j0" />
                              <FaTrash
                                className="r9t2y5u8-k1m4p7n0"
                                onClick={() => handleRemovePhotoFromPreview(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="t6y9u2k5-m1p4n7h3">
                      <label>Working Hours:</label>
                      <div className="y3k6p9n2-j5m8v1h4">
                        <div className="u8k2p5m9-j1n4h6e3">
                          <select name="workingHoursFrom" value={formData.workingHoursFrom} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursFromPeriod" value={formData.workingHoursFromPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                        <span className="i4k7p2m9">to</span>
                        <div className="o9k1m4p7-j2n5h8e3">
                          <select name="workingHoursTo" value={formData.workingHoursTo} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursToPeriod" value={formData.workingHoursToPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                      {errors.workingHours && <p className="e9v2k5m8">{errors.workingHours}</p>}
                    </div>
                    <div className="p2m5n8k1-j4h7v9e3">
                      <label>Service Price:</label>
                      <div className="k9p2m5v8-h3j6n1e4">
                        <input type="number" name="servicePriceValue" value={formData.servicePriceValue} onChange={handleInputChange} required min="0" />
                        <select name="servicePriceCurrency" value={formData.servicePriceCurrency} onChange={handleInputChange}>
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                      {errors.servicePriceValue && <p className="e9v2k5m8">{errors.servicePriceValue}</p>}
                    </div>
                    <div className="m1n4h7p2-j5k8v9e3">
                      <label>Service Type:</label>
                      <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} required />
                      {errors.serviceType && <p className="e9v2k5m8">{errors.serviceType}</p>}
                    </div>
                    <div className="h6j9k2m5-p1n4v7e3">
                      <label>Doctor Description (Education, Experience, etc.):</label>
                      <textarea name="doctorDescription" value={formData.doctorDescription} onChange={handleInputChange} required />
                      {errors.doctorDescription && <p className="e9v2k5m8">{errors.doctorDescription}</p>}
                    </div>
                    <div className="v8k1m4p7-j2n5h9e3">
                      <label>Specialties:</label>
                      <div className="n3k6p9v2-j5m8h1e4">
                        {specialties.map((spec) => (
                          <label key={spec}>
                            <input
                              type="checkbox"
                              name="specialties"
                              value={spec}
                              checked={formData.specialties.includes(spec)}
                              onChange={handleCheckboxChange}
                            />
                            {spec}
                          </label>
                        ))}
                      </div>
                      {errors.specialties && <p className="e9v2k5m8">{errors.specialties}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="k9p2m5v8-j1n4h7e3">
                      <label>Mobile Number:</label>
                      <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                      {errors.mobile && <p className="e9v2k5m8">{errors.mobile}</p>}
                    </div>
                    <div className="j5n8k1p4-m7h2v9e3">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                      {errors.email && <p className="e9v2k5m8">{errors.email}</p>}
                    </div>
                    <div className="m1n4h7p2-j5k8v9e3">
                      <label>Specialty:</label>
                      <select name="specialty" value={formData.specialty} onChange={handleInputChange} required>
                        {specialties.map((spec) => <option key={spec} value={spec}>{spec}</option>)}
                      </select>
                    </div>
                    <div className="h6j9k2m5-p1n4v7e3">
                      <label>Available Programs:</label>
                      <div className="n3k6p9v2-j5m8h1e4">
                        {programOptions.map((program) => (
                          <label key={program}>
                            <input
                              type="checkbox"
                              name="availablePrograms"
                              value={program}
                              checked={formData.availablePrograms.includes(program)}
                              onChange={handleCheckboxChange}
                            />
                            {program}
                          </label>
                        ))}
                      </div>
                      {errors.availablePrograms && <p className="e9v2k5m8">{errors.availablePrograms}</p>}
                    </div>
                  </>
                )}
                <div className="x9j2k5m8-p1n4v7h3">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleServiceAction(e); }} className="s7k2m9p4-j1n5v8h3">Save Service</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowAddServiceForm(false); setErrors({}); }} className="c3v6k9p2-j5m8h1n4">Cancel</a>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="p7m2k5v9-j1n4h6e3">
        <a href="/profile/edit" className="u8k2p5m9-j1n4h6e3">Update Profile</a>
      </div>
    </div>
  );
};

export default Profile;