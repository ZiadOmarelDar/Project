import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FcRemoveImage } from "react-icons/fc";
import { TbUpload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";




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
  const governorates = [
    "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Asyut", "Beheira", "Beni Suef", "Dakahlia", "Damietta",
    "Faiyum", "Gharbia", "Ismailia", "Kafr El Sheikh", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai",
    "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"
  ];
  const clinicSpecialties = [
    "Basic Medical Services", "Vaccinations", "Preventive Care", "Diagnostic Services",
    "Surgical Procedures", "Dental Care", "Grooming and Hygiene", "Boarding Services"
  ];
  const trainerSpecialties = [
    "Obedience Training", "Agility Training", "Behavioral Correction", "Puppy Training", "Trick Training"
  ];
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
          let servicePriceValue = service.servicePrice || "";
          let servicePriceCurrency = service.currency || "EGP";

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
            availablePrograms: service.availablePrograms || [],
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
      return { ...prev, clinicPhotos: updatedPhotos };
    });
    setErrors((prev) => ({ ...prev, clinicPhotos: "" }));
  };

  const handleRemovePhotoFromPreview = (indexToRemove) => {
    setFormData((prev) => {
      const newPhotos = prev.clinicPhotos.filter((_, index) => index !== indexToRemove);
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
    } else if (name === "mobile") {
      const sanitizedValue = value.replace(/[^0-9+]/g, '').replace(/^([^+]*\+?[^+]*).*$/, '$1');
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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

    if (userData?.userType === "trainer" && !formData.specialty) {
      newErrors.specialty = "Specialty is required for trainers.";
    }

    if (userData?.userType === "trainer" && formData.availablePrograms.length === 0) {
      newErrors.availablePrograms = "Please select at least one available program.";
    }

    if (userData?.userType === "clinicAdmin" && formData.specialties.length === 0) {
      newErrors.specialties = "Please select at least one specialty.";
    }

    if (userData?.userType === "clinicAdmin") {
      if (!formData.clinicName) newErrors.clinicName = "Clinic name is required.";
      if (!formData.doctorName) newErrors.doctorName = "Doctor name is required.";
      if (!formData.location.governorate) newErrors.location = "Governorate is required.";
      if (!formData.location.specificLocation) newErrors.location = "Specific location is required.";
      if (!formData.workingHoursFrom || !formData.workingHoursTo) newErrors.workingHours = "Working hours are required.";
      if (!formData.servicePriceValue) newErrors.servicePriceValue = "Service price is required.";
      else if (isNaN(Number(formData.servicePriceValue)) || Number(formData.servicePriceValue) < 0) {
        newErrors.servicePriceValue = "Please enter a valid positive number for service price.";
      }
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
    formDataToSend.append("type", userData.userType === "clinicAdmin" ? "clinic" : "trainer");

    if (userData.userType === "clinicAdmin") {
      formDataToSend.append("clinicName", formData.clinicName);
      formDataToSend.append("doctorName", formData.doctorName);
      formDataToSend.append("location[governorate]", formData.location.governorate);
      formDataToSend.append("location[specificLocation]", formData.location.specificLocation);
      formDataToSend.append("workingHours", `${formData.workingHoursFrom} ${formData.workingHoursFromPeriod} - ${formData.workingHoursTo} ${formData.workingHoursToPeriod}`);
      formDataToSend.append("servicePrice", formData.servicePriceValue);
      formDataToSend.append("currency", formData.servicePriceCurrency);
      formDataToSend.append("serviceType", formData.serviceType);
      formDataToSend.append("doctorDescription", formData.doctorDescription);
      formData.specialties.forEach((spec) => formDataToSend.append("specialties", spec));
      formData.clinicPhotos.forEach((photo) => {
        if (photo instanceof File) formDataToSend.append("clinicPhotos", photo);
      });
    } else if (userData.userType === "trainer") {
      formDataToSend.append("trainerName", userData.name);
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
      console.error("Error saving service:", err.response?.data || err.message);
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
          availablePrograms: [],
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
    <div className="containerBox123">
      <h2 className="welcomeHeader456">{userData.name}</h2>
      <div className="userProfileSection789">
        <div className="profileImageWrapper012">
          {userData.userPhoto && userData.userPhoto !== "not found" ? (
            <img src={`http://localhost:3001${userData.userPhoto}`} alt="Profile" className="profileImage345" />
          ) : (
            <FaUserCircle className="defaultUserIcon678" />
          )}
          <div className="photoActionButtons901">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="fileInput234"
              id="profile-photo-input"
              style={{ display: "none" }}
            />
            <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById("profile-photo-input").click(); }} className="choosePhotoLink567">
              <MdAddPhotoAlternate />
            </a>
            {userData.userPhoto && userData.userPhoto !== "not found" && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleRemovePhoto(); }} className="removePhotoLink890">
                <FcRemoveImage />
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); handleUpload(); }} className="uploadPhotoLink123" style={{ display: file ? "inline" : "none" }}>
              <TbUpload />
            </a>
          </div>
        </div>
        {uploadMessage && <p className={`messageDisplay${uploadMessage.includes("successfully") ? "Success456" : "Error789"}`}>{uploadMessage}</p>}
      </div>
      <div className="userInfoBox012">
        <p><strong>Username:</strong> {userData.username || "Not provided"}</p>
        <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
        <p><strong>User Type:</strong> {userData.userType || "Not provided"}</p>
      </div>

      {(userData.userType === "trainer" || userData.userType === "clinicAdmin") && (
        <div className="servicesSection345">
          {success && <p className="successMessage678">{success}</p>}
          {errors.general && <p className="errorMessage901">{errors.general}</p>}
          <h3 className="servicesHeader234">Services Offered</h3>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className="serviceCard567">
                <div className="serviceContent890">
                  {service.type === "clinic" && (
                    <div className="clinicService123">
                      {service.clinicPhotos && service.clinicPhotos.length > 0 && (
                        <img
                          src={`http://localhost:3001${service.clinicPhotos[0]}`}
                          alt="Clinic"
                          className="serviceImage456"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                        />
                      )}
                      <div className="serviceDetails789">
                        <p className="p-services2145" ><strong>Clinic Name:</strong> {service.clinicName}</p>
                        <p className="p-services2145" ><strong>Doctor Name:</strong> {service.doctorName}</p>
                        <p className="p-services2145" ><strong>Location:</strong> {service.location.governorate} - {service.location.specificLocation}</p>
                        <p className="p-services2145" ><strong>Phone:</strong> {service.mobile}</p>
                        <p className="p-services2145" ><strong>Email:</strong> {service.email}</p>
                        <p className="p-services2145" ><strong>Working Hours:</strong> {service.workingHours}</p>
                        <p className="p-services2145" ><strong>Service Price:</strong> {service.servicePrice} {service.currency}</p>
                        <p className="p-services2145" ><strong>Service Type:</strong> {service.serviceType}</p>
                        <p className="p-services2145" ><strong>Specialties:</strong> {service.specialties.join(", ") || "Not provided"}</p>
                        <p className="p-services2145" ><strong>Doctor Description:</strong> {service.doctorDescription}</p>
                      </div>
                    </div>
                  )}
                  {service.type === "trainer" && (
                    <div className="trainerService012">
                      <p className="p-services2145"><strong>Trainer Name:</strong> {service.trainerName || userData.name}</p>
                      <p className="p-services2145"><strong>Specialty:</strong> {service.specialty}</p>
                      <p className="p-services2145"><strong>Mobile:</strong> {service.mobile}</p>
                      <p className="p-services2145"><strong>Email:</strong> {service.email}</p>
                      <p className="p-services2145"><strong>Available Programs:</strong> {service.availablePrograms.join(", ") || "Not provided"}</p>
                    </div>
                  )}
                </div>
                <div className="serviceActions345">
                  {services.length === 1 && (
                    <>
                      <button
                        onClick={(e) => { e.preventDefault(); setShowAddServiceForm(true); }}
                        className="editServiceButton789"
                      >
                        Edit Service
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDeleteService(); }}
                        className="deleteButton901"
                      >
                        <span className="deleteServiceButton325">Delete Service<MdDelete /></span>

                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="noServicesMessage123">No services available</p>
          )}

          {services.length === 0 && (
            <button
              onClick={(e) => { e.preventDefault(); setShowAddServiceForm(true); }}
              className="addServiceButton456"
            >
              Add Service
            </button>
          )}

          {showAddServiceForm && (
            <div className="formContainer012">
              <h3 className="formHeader345">{services.length > 0 ? "Edit Service" : "Add New Service"}</h3>
              <form className="serv-form" onSubmit={handleServiceAction}>
                {userData.userType === "clinicAdmin" ? (
                  <>
                    <div className="clinicNameInput678">
                      <label>Clinic Name:</label>
                      <input type="text" name="clinicName" value={formData.clinicName} onChange={handleInputChange}  />
                      {errors.clinicName && <p className="errorDisplay901">{errors.clinicName}</p>}
                    </div>
                    <div className="doctorNameInput123">
                      <label>Doctor Name:</label>
                      <input type="text" name="doctorName" value={formData.doctorName} onChange={handleInputChange}  />
                      {errors.doctorName && <p className="errorDisplay456">{errors.doctorName}</p>}
                    </div>
                    <div className="governorateSelect789">
                      <label>Governorate:</label>
                      <select
                        name="location.governorate"
                        value={formData.location.governorate}
                        onChange={handleInputChange}
                        
                      >
                        <option value="">Select Governorate</option>
                        {governorates.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                      {errors.location && <p className="errorDisplay012">{errors.location}</p>}
                    </div>
                    <div className="specificLocationInput345">
                      <label>Specific Location:</label>
                      <input
                        type="text"
                        name="location.specificLocation"
                        value={formData.location.specificLocation}
                        onChange={handleInputChange}
                        
                        placeholder="e.g., Street Name, Building Number"
                      />
                      {errors.location && <p className="errorDisplay678">{errors.location}</p>}
                    </div>
                    <div className="mobileInput901">
                      <label>Mobile Number:</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        
                        placeholder="+201012345678"
                      />
                      {errors.mobile && <p className="errorDisplay123">{errors.mobile}</p>}
                    </div>
                    <div className="emailInput456">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}  />
                      {errors.email && <p className="errorDisplay789">{errors.email}</p>}
                    </div>
                    <div className="photoInput012">
                      <label>Clinic Photos (up to 5):</label>
                      <input type="file" name="clinicPhotos" accept="image/jpeg,image/png" onChange={handleClinicPhotosChange} multiple />
                      {errors.clinicPhotos && <p className="errorDisplay345">{errors.clinicPhotos}</p>}
                    </div>
                    
                    <div className="workingHoursInput345">
                      <label>Working Hours:</label>
                      <div className="hoursSelection678">
                        <div className="fromTimeSelect901">
                          <select name="workingHoursFrom" value={formData.workingHoursFrom} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursFromPeriod" value={formData.workingHoursFromPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                        <span className="toLabel123">to</span>
                        <div className="toTimeSelect456">
                          <select name="workingHoursTo" value={formData.workingHoursTo} onChange={handleInputChange} required>
                            {timeOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                          </select>
                          <select name="workingHoursToPeriod" value={formData.workingHoursToPeriod} onChange={handleInputChange}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                      {errors.workingHours && <p className="errorDisplay789">{errors.workingHours}</p>}
                    </div>
                    <div className="priceInput012">
                      <label>Service Price:</label>
                      <div className="priceInputFields345">
                        <input
                          type="number"
                          name="servicePriceValue"
                          value={formData.servicePriceValue}
                          onChange={handleInputChange}
                          
                          min="0"
                          step="0.01"
                        />
                        <select name="servicePriceCurrency" value={formData.servicePriceCurrency} onChange={handleInputChange}>
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                      {errors.servicePriceValue && <p className="errorDisplay678">{errors.servicePriceValue}</p>}
                    </div>
                    <div className="serviceTypeInput901">
                      <label>Service Type:</label>
                      <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange}  />
                      {errors.serviceType && <p className="errorDisplay123">{errors.serviceType}</p>}
                    </div>
                    <div className="descriptionInput456">
                      <label>Doctor Description (Education, Experience, etc.):</label>
                      <textarea name="doctorDescription" value={formData.doctorDescription} onChange={handleInputChange}  />
                      {errors.doctorDescription && <p className="errorDisplay789">{errors.doctorDescription}</p>}
                    </div>
                    {formData.clinicPhotos.length > 0 && (
                      <div className="photoPreviewSection678">
                        <h4 className="previewHeader901">Preview Photos</h4>
                        <div className="previewImagesBox123">
                          {formData.clinicPhotos.map((photo, index) => (
                            <div key={index} className="previewImageWrapper456">
                              <img
                                src={
                                  photo instanceof File
                                    ? URL.createObjectURL(photo)
                                    : `http://localhost:3001${photo}`
                                }
                                alt={`Preview ${index + 1}`}
                                className="previewImage789"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                              />
                              <FaTrash
                                className="removePhotoIcon012"
                                onClick={() => handleRemovePhotoFromPreview(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="specialtiesInput012">
                      <label>Specialties:</label>
                      <div className="checkboxGroup345">
                        {clinicSpecialties.map((spec) => (
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
                      {errors.specialties && <p className="errorDisplay678">{errors.specialties}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="trainerMobileInput789">
                      <label>Mobile Number:</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        placeholder="+201012345678"
                      />
                      {errors.mobile && <p className="errorDisplay901">{errors.mobile}</p>}
                    </div>
                    <div className="trainerEmailInput123">
                      <label>Email Address:</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                      {errors.email && <p className="errorDisplay456">{errors.email}</p>}
                    </div>
                    <div className="trainerSpecialtySelect789">
                      <label>Specialty:</label>
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                      >
                        {trainerSpecialties.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      {errors.specialty && <p className="errorDisplay012">{errors.specialty}</p>}
                    </div>
                    <div className="trainerProgramsInput345">
                      <label>Available Programs:</label>
                      <div className="checkboxGroup678">
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
                      {errors.availablePrograms && <p className="errorDisplay901">{errors.availablePrograms}</p>}
                    </div>
                  </>
                )}
                
              </form>
              <div className="formButtons012">
                  <button type="submit" className="saveButton345">Save Service</button>
                  <button type="button" onClick={(e) => { e.preventDefault(); setShowAddServiceForm(false); setErrors({}); }} className="cancelButton678">
                    Cancel
                  </button>
                </div>
            </div>
          )}
        </div>
      )}

      <div className="updateLinkSection901">
        <a href="/profile/edit" className="updateProfileLink123">Update Profile</a>
      </div>
    </div>
  );
};

export default Profile;

