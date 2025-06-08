import React, { useState, useEffect } from "react";
import { FaPaw, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { LuDog } from "react-icons/lu";
import { TbCat } from "react-icons/tb";
import { ImPaste } from "react-icons/im";
import { MdQuestionAnswer } from "react-icons/md";
import { PiDogBold } from "react-icons/pi";
import "./AdoptionPage.css";
import dog1 from "../../assets/adoption/1.png";
import dog2 from "../../assets/adoption/2.png";
import dog3 from "../../assets/adoption/3.png";
import dog4 from "../../assets/adoption/4.png";
import dog5 from "../../assets/adoption/5.png";
import dog6 from "../../assets/adoption/6.png";
import dog7 from "../../assets/adoption/7.png";
import dogArticleImage from "../../assets/adoption/dog-article.png";

import { Link } from "react-router-dom";

// const pets = [
//   { id: 1, name: "Baha", image: dog1, type: "dog" },
//   { id: 2, name: "hamada", image: dog2, type: "dog" },
//   { id: 3, name: "Bosy", image: dog3, type: "cat" },
//   { id: 4, name: "Soud", image: dog4, type: "cat" },
//   { id: 5, name: "Kitty", image: dog5, type: "cat" },
//   { id: 6, name: "hamoo", image: dog6, type: "cat" },
//   { id: 7, name: "Zoro", image: dog7, type: "dog" },
// ];

// const planningCards = [
//   {
//     icon: <ImPaste />,
//     title: "CHECKLIST FOR NEW ADOPTERS",
//     description: "Make the adoption transition as smooth as possible",
//   },
//   {
//     icon: <PiDogBold />,
//     title: "HOW OLD IS A DOG IN HUMAN YEARS?",
//     description: "Learn to translate dog years to human years for fun, and we might slip",
//   },
//   {
//     icon: <MdQuestionAnswer />,
//     title: "PET ADOPTION FAQS",
//     description: "Get answer to all of the questions you haven’t thought for yet",
//   },
// ];

// const articles = [
//   {
//     title: "You Have A Pet For Adoption",
//     image: dogArticleImage,
//   },

// ];


// const filterCards = [
//   { icon: <LuDog />, label: "Dog" },
//   { icon: <TbCat />, label: "Cat" },
//   { icon: <FaPaw />, label: "Paw" },
// ];

const AdoptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [pets, setPets] = useState([]);

  const cntr = pets.length
  useEffect(() => {
      fetch("http://localhost:3001/pets")
      .then(response => response.json())
      .then(data => {
        setPets(data)
      })
    }, [cntr]);
    console.log(pets[0])

  // const filteredPets = pets
  //   .filter((pet) => pet.petName.toLowerCase().includes(searchTerm.toLowerCase()))
  //   .slice(0, 7);

  // const toggleFavorite = (petId) => {
  //   if (favorites.includes(petId)) {
  //     setFavorites(favorites.filter((id) => id !== petId));
  //   } else {
  //     setFavorites([...favorites, petId]);
  //   }
  // };

  return (<>
    {/*// <div className="adoption-page">
    
    //   <div className="header-1">
    //     <div className="search-container-5 ">
    //       <BiSearchAlt className="search-icon-5 bg-amber-200" />
    //       <input
    //         type="text"
    //         placeholder="Search"
    //         value={searchTerm}
    //       />
    //     </div>
    //   </div>*/}

      
  {/* //     <div className="category-icons"> */}
  {/* //       {filterCards.map((card, index) => ( */}
  {/* //         <div key={index} className="icon-box">
  //           <div className="flip-card-inner">
  //             <div className="flip-card-front">{card.icon}</div>
  //             <div className="flip-card-back">
  //               <span className="filter-label">{card.label}</span>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div> */}

    
      <h2 className="section-title-2">Pets Available for Adoption</h2>
      {/* <div className="pets-grid"> */}
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card">
            <div className="pet-image-container">
              <img src="../../../../server/uploads/Pets/dani.jpeg" alt={pet.petName} className="pet-image" />
              <button
                className="heart-btn"
                onClick={() => toggleFavorite(pet._id)}
              >
                {favorites.includes(pet.id) ? (
                  <FaHeart className="heart-icon favorited" />
                ) : (
                  <FaRegHeart className="heart-icon" />
                )}
              </button>
            </div>
            <h3 className="pet-name-1">{pet.petName}</h3>
          </div>
        ))}
        {console.log(pets)}
      {/* </div> */}
        
  {/*
  //         <Link to='/AdoptionPetsSection' className="see-them-card">
  //         <div className="see-them-card">
  //         <div className="see-them-content">
  //           <FaPaw className="paw-icon" />
  //           <p>More Pets available in Pet care</p>
  //           <h3>See Them</h3>
  //         </div>
  //         </div>
  //         </Link>
        
        
  //     </div>

    
  //     <div className="planning-section">
  //       <h2 className="planning-section-title">Planning to adopt a pet?</h2>
  //       <div className="planning-grid">
  //         {planningCards.map((card, index) => (
  //           <div key={index} className="planning-card">
  //             <div className="planning-icon">{card.icon}</div>
  //             <h3 className="planning-title">{card.title}</h3>
  //             <p className="planning-description">{card.description}</p>
  //             <a href="/PetAgeCalculator" className="explore-link-9" data-disabled="true">
  //               <button className="explore-btn-9">Explore</button>
  //             </a>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

      
  //     <div className="articles-section">
  //       <div className="articles-grid">
  //         {articles.map((article, index) => (
  //           <div key={index} className="article-card">
  //             <img
  //               src={article.image}
  //               alt={article.title}
  //               className="article-image"
  //             />
  //             <h3 className="article-title">{article.title}</h3>
  //             <a href="/PetFaqs" className="read-more-link-9" data-disabled="true"> 
  //             <button className="read-more-btn-9">Add Pet</button>
  //             </a>
  //           </div>
  //         ))}
  //       </div>
  //     </div> */}
    </>
  );
};

export default AdoptionPage;