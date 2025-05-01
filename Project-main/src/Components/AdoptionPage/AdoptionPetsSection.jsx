import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AdoptionPetsSection.css";

const AdoptionPetsSection = () => {
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // جلب المفضلة من localStorage عند التحميل
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const petsPerPage = 8;

  // حفظ المفضلة في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // جلب البيانات من API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(
          `https://api.example.com/pets?page=${page}&limit=${petsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();

        if (data.length < petsPerPage) {
          setHasMore(false);
        }

        setPets((prevPets) => [...prevPets, ...data]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // محاكاة البيانات مؤقتًا
    const mockPets = [
      { id: 1, name: "Kitty", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=60" },
      { id: 2, name: "Sokar", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=500&q=60" },
      { id: 3, name: "Bosy", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=60" },
      { id: 4, name: "Soud", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60" },
      { id: 5, name: "Kitty", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=60" },
      { id: 6, name: "Mshmsh", image: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=500&q=60" },
      { id: 7, name: "Zoro", image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=500&q=60" },
      { id: 8, name: "Zoro", image: "https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&w=500&q=60" },
      { id: 9, name: "Kitty", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=60" },
      { id: 10, name: "Sokar", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=500&q=60" },
      { id: 11, name: "Bosy", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=60" },
      { id: 12, name: "Soud", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60" },
      { id: 13, name: "Kitty", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=60" },
      { id: 14, name: "Mshmsh", image: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=500&q=60" },
      { id: 15, name: "Zoro", image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=500&q=60" },
      { id: 16, name: "Zoro", image: "https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&w=500&q=60" },
      { id: 17, name: "Kitty", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=60" },
      { id: 18, name: "Sokar", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=500&q=60" },
      { id: 19, name: "Bosy", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=60" },
      { id: 20, name: "Soud", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60" },
    ];

    const start = (page - 1) * petsPerPage;
    const end = start + petsPerPage;
    const paginatedPets = mockPets.slice(start, end);

    if (paginatedPets.length === 0 || end >= mockPets.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setPets((prevPets) => [...prevPets, ...paginatedPets]);
      setLoading(false);
    }, 1000);
  }, [page]);

  const toggleFavorite = (petId) => {
    if (favorites.includes(petId)) {
      setFavorites(favorites.filter((id) => id !== petId));
    } else {
      setFavorites([...favorites, petId]);
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setLoading(true);
  };

  return (
    <div className="adoption-pets-section-2">
      {/* رابط لصفحة المفضلة */}
      <div className="favorites-link-container">
        <Link to="/favorites" className="favorites-link">
          View Favorites ({favorites.length})
        </Link> 
        <Link to="/AddPet" className="add-link">
          Add Pet For Adoption
        </Link> 

      </div>

      <h2 className="section-title-2">Pets Available for Adoption</h2>

      {loading && pets.length === 0 ? (
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
      ) : pets.length === 0 ? (
        <p className="status-message">No pets found.</p>
      ) : (
        <div className="pets-grid-2">
          {pets.map((pet) => (
            <Link to={`/pet/${pet.id}`} key={pet.id} className="pet-card-2">
              <div className="pet-image-container-2">
                <img src={pet.image} alt={pet.name} className="pet-image-2" />
                <button
                  className="heart-btn-2"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(pet.id);
                  }}
                >
                  {favorites.includes(pet.id) ? (
                    <FaHeart className="heart-icon-2 favorited" />
                  ) : (
                    <FaRegHeart className="heart-icon-2" />
                  )}
                </button>
              </div>
              <h3 className="pet-name-2">{pet.name}</h3>
            </Link>
          ))}
        </div>
      )}

      <div className="more-button-container">
        {hasMore ? (
          <button
            className="more-button"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "More"}
          </button>
        ) : (
          pets.length > 0 && (
            <p className="status-message">No more pets to load.</p>
          )
        )}
      </div>
    </div>
  );
};

export default AdoptionPetsSection;