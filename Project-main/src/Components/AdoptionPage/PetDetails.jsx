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
      try {
        const response = await fetch(`https://api.example.com/pets/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pet details");
        }
        const data = await response.json();
        setPet(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // محاكاة البيانات مؤقتًا مع 4 صور
    const mockPet = {
      id: 1,
      name: "Baha",
      images: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60",
      ],
      age: "11 months",
      location: "Cairo, Giza, Egypt",
      breed: "German Shepherd",
      sex: "Female",
      vaccinations: "Almost fully vaccinated",
      healthStatus: "Good",
      notes:
        "Baha is an 11-month-old German Shepherd. He is playful, loyal, and friendly with people. Baha is in great health and fully vaccinated. He loves to run and would do best in a home with space to play and someone who can give him time and care.",
    };

    setTimeout(() => {
      setPet(mockPet);
      setLoading(false);
    }, 1000);
  }, [id]);

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
      {/* الصور */}
      <div className="pet-images">
        <img
          src={pet.images[0]}
          alt={`${pet.name}-1`}
          className="pet-image-large"
        />
        <div className="pet-images-middle">
          <img
            src={pet.images[1]}
            alt={`${pet.name}-2`}
            className="pet-image-middle"
          />
          <img
            src={pet.images[2]}
            alt={`${pet.name}-3`}
            className="pet-image-middle"
          />
        </div>
        <img
          src={pet.images[3]}
          alt={`${pet.name}-4`}
          className="pet-image-large"
        />
      </div>

      <hr className="hr" />
      {/* اسم الحيوان */}
      <h2 className="pet-name">{pet.name}</h2>

      {/* المعلومات الأساسية */}
      <div className="pet-info-box">
        <div className="pet-info-row">
          <p className="pet-info-label">Name:</p>
          <p className="pet-info-value">{pet.name}</p>
          <p className="pet-info-label">Breed:</p>
          <p className="pet-info-value">{pet.breed}</p>
        </div>
        <div className="pet-info-row">
          <p className="pet-info-label">Age:</p>
          <p className="pet-info-value">{pet.age}</p>
          <p className="pet-info-label">Sex:</p>
          <p className="pet-info-value">{pet.sex}</p>
        </div>
        <div className="pet-info-row">
          <p className="pet-info-label">Location:</p>
          <p className="pet-info-value">{pet.location}</p>
        </div>
      </div>

      {/* المعلومات الصحية */}
      <div className="pet-info-box">
      <div className="pet-info-box-1">
        <p className="pet-info-label">Vaccinations:</p>
        <p className="pet-info-value">{pet.vaccinations}</p>
        <p className="pet-info-label">Health Status:</p>
        <p className="pet-info-value">{pet.healthStatus}</p>
      </div>
      </div>

      {/* الملاحظات */}
      <div className="pet-info-box">
        <p className="pet-info-label">Notes:</p>
        <p className="pet-info-value">{pet.notes}</p>
      </div>

      {/* زر "Take Me" */}
      <div className="take-me-button-container">
        <button className="take-me-button">Take Me</button>
      </div>
    </div>
  );
};

export default PetDetails;