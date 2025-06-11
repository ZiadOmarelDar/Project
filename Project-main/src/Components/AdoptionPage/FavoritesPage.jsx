import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3001/pets");
        if (!response.ok) throw new Error("Failed to fetch pets");
        const data = await response.json();
        // تصفية الحيوانات بناءً على favorites باستخدام _id
        const filteredPets = data.filter((pet) => favorites.includes(pet._id));
        setFavoritePets(filteredPets);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPets();
  }, [favorites]); // إعادة التحميل عند تغيير favorites

  const removeFromFavorites = (petId) => {
    const updatedFavorites = favorites.filter((id) => id !== petId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites-page">
      <div className="back-link-container">
        <Link to="/AdoptionPetsSection" className="back-link">
          Back to Pets List
        </Link>
      </div>

      <h2 className="section-title-4">Favorite Pets</h2>

      {loading ? (
        <div className="pets-grid-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="pet-card-4 skeleton">
              <div className="pet-image-container-4">
                <div className="pet-image-4 skeleton-image"></div>
              </div>
              <h3 className="pet-name-4 skeleton-text"></h3>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="status-message error">Error: {error}</p>
      ) : favoritePets.length === 0 ? (
        <p className="status-message">No favorite pets yet.</p>
      ) : (
        <div className="pets-grid-4">
          {favoritePets.map((pet) => (
            <Link to={`/pet/${pet._id}`} key={pet._id} className="pet-card-4">
              <div className="pet-image-container-4">
                <img src={pet.images[0]} alt={pet.petName} className="pet-image-4" />
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromFavorites(pet._id);
                  }}
                >
                  <FaTrash className="remove-icon" />
                </button>
              </div>
              <h3 className="pet-name-4">{pet.petName}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;