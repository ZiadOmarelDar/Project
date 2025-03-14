import React, { useState } from "react";
import { FaSearch, FaPaw, FaDog, FaCat, FaHeart } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { LuDog } from "react-icons/lu";
import { TbCat } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";

import "./AdoptionPage.css"; 
import dog1 from "../../assets/adoption/1.png";
import dog2 from "../../assets/adoption/2.png";
import dog3 from "../../assets/adoption/3.png";
import dog4 from "../../assets/adoption/4.png";
import dog5 from "../../assets/adoption/5.png";
import dog6 from "../../assets/adoption/6.png";
import dog7 from "../../assets/adoption/7.png";

const pets = [
  { name: "Baha", image: dog1 },
  { name: "Sokar", image: dog2 },
  { name: "Bosy", image: dog3},
  { name: "Soud", image: dog4 },
  { name: "Kitty", image: dog5 },
  { name: "Mshmsh", image: dog6 },
  { name: "Zoro", image: dog7 },
];

const AdoptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="adoption-page">
      
      <div className="header">
        <div className="search-container">
          <BiSearchAlt className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

     
      <div className="category-icons">
        <div className="icon-box"><LuDog /></div>
        <div className="icon-box"><TbCat /></div>
        <div className="icon-box"><FaPaw /></div>
      </div>

      
      <h2 className="section-title">Pets Available for Adoption</h2>
      <div className="pets-grid">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
            <div key={index} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <div className="pet-name">{pet.name}</div>
              <FaRegHeart className="heart-icon" />
            </div>
          ))
        ) : (
          <p className="no-results">No pets found.</p>
        )}
        <div className="see-more-card">
          <FaPaw className="paw-icon" />
          <p>More Pets available in Pet care</p>
          <h1>See Them</h1>
        </div>
      </div>

     
      <h2 className="section-title">Planning to adopt a pet?</h2>
      <div className="info-grid">
        <div className="info-box">
          <p>Checklist for New Adopters</p>
          <button>Explore</button>
        </div>
        <div className="info-box">
          <p>How to Care for a Dog</p>
          <button>Explore</button>
        </div>
        <div className="info-box">
          <p>Pet Adoption FAQs</p>
          <button>Explore</button>
        </div>
      </div>

     
      <div className="articles-grid">
        <div className="article-box">
          <h3>Dog Adoption Articles</h3>
          <button>Read More</button>
        </div>
        <div className="article-box">
          <h3>Cat Adoption Articles</h3>
          <button>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionPage;

