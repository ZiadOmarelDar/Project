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

  // جلب بيانات الحيوانات المفضلة
  useEffect(() => {
    const fetchPets = async () => {
      try {
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

        // تصفية الحيوانات المفضلة بناءً على favorites
        const filteredPets = mockPets.filter((pet) =>
          favorites.includes(pet.id)
        );
        setFavoritePets(filteredPets);
        setLoading(false);

        // عندما يصبح الـ API جاهزًا، يمكنك استبدال الكود أعلاه بجلب البيانات من الـ API:
        /*
        const response = await fetch("https://api.example.com/pets");
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        const filteredPets = data.filter((pet) => favorites.includes(pet.id));
        setFavoritePets(filteredPets);
        setLoading(false);
        */
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPets();
  }, [favorites]);

  const removeFromFavorites = (petId) => {
    const updatedFavorites = favorites.filter((id) => id !== petId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites-page">
      {/* رابط للعودة إلى القائمة */}
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
            <Link to={`/pet/${pet.id}`} key={pet.id} className="pet-card-4">
              <div className="pet-image-container-4">
                <img src={pet.image} alt={pet.name} className="pet-image-4" />
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromFavorites(pet.id);
                  }}
                >
                  <FaTrash className="remove-icon" />
                </button>
              </div>
              <h3 className="pet-name-4">{pet.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;