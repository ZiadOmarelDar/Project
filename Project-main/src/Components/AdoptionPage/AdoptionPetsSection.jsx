import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AdoptionPetsSection.css";

const AdoptionPetsSection = () => {
  const [allPets, setAllPets] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const petsPerPage = 8;

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3001/pets");
        if (!response.ok) throw new Error("Failed to fetch pets");
        const data = await response.json();
        setAllPets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const toggleFavorite = (petId) => {
    setFavorites((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const displayedPets = allPets.slice(0, page * petsPerPage);
  const hasMore = displayedPets.length < allPets.length;

  return (
    <div className="adoption-pets-section-2">
      <div className="favorites-link-container">
        <Link to="/favorites" className="favorites-link">
          View Favorites ({favorites.length-5})
        </Link>
        <Link to="/UploadPet" className="add-link">
          Add Pet For Adoption
        </Link>
      </div>

      <h2 className="section-title-2">Pets Available for Adoption</h2>

      {loading ? (
        <div className="pets-grid-2">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="pet-card-2 skeleton">
              <div className="pet-image-container-2">
                <div className="pet-image-2 skeleton-image"></div>
              </div>
              <h3 className="pet-name-2 skeleton-text"></h3>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="status-message error">Error: {error}</p>
      ) : displayedPets.length === 0 ? (
        <p className="status-message">No pets found.</p>
      ) : (
        <div className="pets-grid-2">
          {displayedPets.map((pet) => (
            <Link to={`/pet/${pet._id}`} key={pet._id} className="pet-card-2">
              <div className="pet-image-container-2">
                <img
                  src={pet.images[0]}
                  alt={pet.petName}
                  className="pet-image-2"
                />
                <button
                  className="heart-btn-2"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(pet._id);
                  }}
                >
                  {favorites.includes(pet._id) ? (
                    <FaHeart className="heart-icon-2 favorited" />
                  ) : (
                    <FaRegHeart className="heart-icon-2" />
                  )}
                </button>
              </div>
              <h3 className="pet-name-2">{pet.petName}</h3>
            </Link>
          ))}
        </div>
      )}

      <div className="more-button-container">
        {hasMore && !loading && (
          <button className="more-button" onClick={loadMore}>
            More
          </button>
        )}
      </div>
    </div>
  );
};

export default AdoptionPetsSection;