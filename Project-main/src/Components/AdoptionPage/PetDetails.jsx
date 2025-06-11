import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PetDetails.css";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true); // إعادة تعيين الحالة عند كل تغيير في id
      try {
        const response = await fetch(`http://localhost:3001/pet/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pet details");
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPetDetails();
  }, [id]); // يعتمد على id فقط

  if (loading) {
    return <p className="status-message">Loading pet details...</p>;
  }

  if (error) {
    return <p className="status-message error">Error: {error}</p>;
  }

  if (!pet) {
    return <p className="status-message">Pet not found.</p>;
  }

  return (
    <div className="pet-details">
      <div className="pet-images">
        <img
          src={pet.images[0]}
          alt={`${pet.petName}-1`}
          className="pet-image-large"
        />
        <div className="pet-images-middle">
          {pet.images.length > 1 && (
            <img
              src={pet.images[1]}
              alt={`${pet.petName}-2`}
              className="pet-image-middle"
            />
          )}
          {pet.images.length > 2 && (
            <img
              src={pet.images[2]}
              alt={`${pet.petName}-3`}
              className="pet-image-middle"
            />
          )}
        </div>
        {pet.images.length > 3 && (
          <img
            src={pet.images[3]}
            alt={`${pet.petName}-4`}
            className="pet-image-large"
          />
        )}
      </div>

      <hr className="hr" />
      <h2 className="pet-name">{pet.petName}</h2>

      <div className="pet-info-box">
        <div className="pet-info-row">
          <p className="pet-info-label">Name:</p>
          <p className="pet-info-value">{pet.petName}</p>
          <p className="pet-info-label">Breed:</p>
          <p className="pet-info-value">{pet.breed}</p>
        </div>
        <div className="pet-info-row">
          <p className="pet-info-label">Age:</p>
          <p className="pet-info-value">{pet.age} months</p>
          <p className="pet-info-label">Type:</p>
          <p className="pet-info-value">{pet.type}</p>
        </div>
      </div>

      <div className="pet-info-box">
        <div className="pet-info-box-1">
          <div style={{ marginBottom: "15px" }} className="flex gap-[100px]">
            <p className="pet-info-label">Vaccinations:</p>
            <p className="pet-info-value">{pet.vaccinations}</p>
          </div>
          <div className="flex gap-[100px]">
            <p className="pet-info-label">Health Status:</p>
            <p className="pet-info-value">{pet.healthStatus}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "15px", marginTop: "10px", fontWeight: "600" }} className="pet-info-box">
        <p>Owner Info:</p>
        <div style={{ marginTop: "20px" }} className="flex justify-between">
          <div className="flex gap-[50px]">
            <p className="pet-info-label">Owner Name:</p>
            <p className="pet-info-value">{pet.owner.name}</p>
          </div>
          <div className="flex gap-[50px]">
            <p className="pet-info-label">Owner Phone:</p>
            <p className="pet-info-value">{pet.owner.phoneNumber}</p>
          </div>
        </div>
      </div>
      <div className="pet-info-box">
        <p className="pet-info-label">Notes:</p>
        <p className="pet-info-value">{pet.notes}</p>
      </div>
      <div className="take-me-button-container">
        <button className="take-me-button">Take Me</button>
      </div>
    </div>
  );
};

export default PetDetails;