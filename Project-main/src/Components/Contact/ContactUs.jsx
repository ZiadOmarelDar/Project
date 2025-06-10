import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry", // Default value as per image
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First Name should contain only letters.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last Name should contain only letters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else if (!/^\+20[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Egyptian phone number (e.g., +201012345678).";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="contacttt">
    <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Any question or remarks? Just write us a message!</p>
      </div>
    <div className="contact-container">
     
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Say something to start a live chat!</p>
          <div className="info-item">
            <FaPhone /> <span>+2012 1901946</span>
          </div>
          <div className="info-item">
            <FaEnvelope /> <span>pet.care@gmail.com</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt /> <span>132 Dartmouth Street Boston, Massachusetts 02156 United States</span>
          </div>
          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaWhatsapp />
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
          </div>
          <div className="form-group">
            <label>Select Subject?</label>
            <br />
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name="subject" value="General Inquiry" checked={formData.subject === "General Inquiry"} onChange={handleChange} /> General Inquiry
              </label>
              <label className="radio-option">
                <input type="radio" name="subject" value="Pet Adoption" checked={formData.subject === "Pet Adoption"} onChange={handleChange} /> Pet Adoption
              </label>
              <label className="radio-option">
                <input type="radio" name="subject" value="About a Clinic" checked={formData.subject === "About a Clinic"} onChange={handleChange} /> About a Clinic
              </label>
              <label className="radio-option">
                <input type="radio" name="subject" value="About a Product" checked={formData.subject === "About a Product"} onChange={handleChange} /> About a Product
              </label>
            </div>
            {errors.subject && <p className="error-message">{errors.subject}</p>}
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..."></textarea>
          </div>
          <button type="submit" className="submit-btn-88">Send Message</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ContactUs;