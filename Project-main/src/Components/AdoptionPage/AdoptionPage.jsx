import React, { useState, useEffect } from "react";
import { FaPaw, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { LuDog } from "react-icons/lu";
import { TbCat } from "react-icons/tb";
import { ImPaste } from "react-icons/im";
import { MdQuestionAnswer } from "react-icons/md";
import { PiDogBold } from "react-icons/pi";
import "./AdoptionPage.css";
import adoptioncat from "../../assets/adoptioncatt.png";
import { Link } from "react-router-dom";

const planningCards = [
  {
    icon: <ImPaste />,
    title: "CHECKLIST FOR NEW ADOPTERS",
    description: "Make the adoption transition as smooth as possible",
    link: "/ChecklistComponent",
  },
  {
    icon: <PiDogBold />,
    title: "HOW OLD IS A DOG IN HUMAN YEARS?",
    description:
      "Learn to translate dog years to human years for fun, and we might slip",
    link: "/PetAgeCalculator",
  },
  {
    icon: <MdQuestionAnswer />,
    title: "PET ADOPTION FAQS",
    description: "Get answer to all of the questions you haven’t thought for yet",
    link: "/PetFaqs",
  },
];

const filterCards = [
  { icon: <LuDog />, label: "Dog" },
  { icon: <TbCat />, label: "Cat" },
  { icon: <FaPaw />, label: "Paw" },
];

const AdoptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [pets, setPets] = useState([]);

  const cntr = pets.length;

  useEffect(() => {
    fetch("http://localhost:3001/pets")
      .then((response) => response.json())
      .then((data) => {
        setPets(data);
      });
  }, [cntr]);

  const filteredPets = pets
    .filter((pet) =>
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 7);

  const toggleFavorite = (petId) => {
    if (favorites.includes(petId)) {
      setFavorites(favorites.filter((id) => id !== petId));
    } else {
      setFavorites([...favorites, petId]);
    }
  };

  return (
    <div className="adoption-page">
      <div className="header-1">
        <div className="search-container-5">
          <BiSearchAlt className="search-icon-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="category-icons">
        {filterCards.map((card, index) => (
          <div key={index} className="icon-box">
            <div className="flip-card-inner">
              <div className="flip-card-front">{card.icon}</div>
              <div className="flip-card-back">
                <span className="filter-label">{card.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title-2">Pets Available for Adoption</h2>
      <div className="pets-grid">
        {filteredPets.map((pet) => (
          <div key={pet._id} className="pet-card">
            <div className="pet-image-container">
              <img
                src={pet.images[0]}
                alt={pet.petName}
                className="pet-image"
              />
              <button
                className="heart-btn"
                onClick={() => toggleFavorite(pet._id)}
              >
                {favorites.includes(pet._id) ? (
                  <FaHeart className="heart-icon favorited" />
                ) : (
                  <FaRegHeart className="heart-icon" />
                )}
              </button>
            </div>
            <h3 className="pet-name-1">{pet.petName}</h3>
          </div>
        ))}

        <Link to="/AdoptionPetsSection" className="see-them-card">
          <div className="see-them-content">
            <FaPaw className="paw-icon" />
            <p>More Pets available in Pet care</p>
            <h3>See Them</h3>
          </div>
        </Link>
      </div>

      <div className="planning-section">
        <h2 className="planning-section-title">Planning to adopt a pet?</h2>
        <div className="planning-grid">
          {planningCards.map((card, index) => (
            <div key={index} className="planning-card">
              <div className="planning-icon">{card.icon}</div>
              <h3 className="planning-title">{card.title}</h3>
              <p className="planning-description">{card.description}</p>
              <Link to={card.link} className="explore-link-9">
                <button className="explore-btn-9">Explore</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="articles-section bottom-cta">
        <div className="bottom-cta-text">
          <h1>Got a Furry Friend Who Needs a New Couch to Destroy?</h1>
          <button className="bottom-cta-btn">Find a new Home</button>
        </div>
        <div className="bottom-cta-image">
          <img src={adoptioncat} alt="Cute Cat" />
        </div>
      </div>
    </div>
  );
};

export default AdoptionPage;
