import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import dogImage from "../../assets/dog-home.png";
import adoptionImg from "../../assets/cat.png";
import suppliesImg from "../../assets/two-dog.png";
import forumImg from "../../assets/bird.png";
import careImg1 from "../../assets/pet1.png";
import careImg2 from "../../assets/pet2.png";
import careImg3 from "../../assets/pet3.png";
import careImg4 from "../../assets/pet4.png";
import careImg5 from "../../assets/pet5.png";
import forumPhone from "../../assets/phone.png";
import aiImage from "../../assets/ai.png";
import trainingImg from "../../assets/trainer.png";
import clinicImg from "../../assets/map.png";
import doctorImg from "../../assets/doctor.png";
import { GiDogHouse, GiJumpingDog } from "react-icons/gi";
import { MdShoppingCart, MdPets } from "react-icons/md";
import { FaMobile, FaBrain } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import TrainHome from "../Train/TrainHome";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Your Animal, <br /> Our Priority
          </h1>
          <p>
            Connecting you with trusted services and loving companions to make
            pet care and adoption easier than ever.
          </p>
          <div className="hero-buttons">
            <Link to="/AdoptionPage" className="hero-btn">
              <GiDogHouse />
              Adoption
            </Link>
            <Link to="/Shop" className="hero-btn">
              <MdShoppingCart />
              Supplies
            </Link>
            <Link to="/community" className="hero-btn">
              <FaMobile />
              Forum
            </Link>
            <Link to="/VetClinicFinder" className="hero-btn">
              <FaUserDoctor />
              Clinics
            </Link>
            <Link to="/TrainHome" className="hero-btn">
              <GiJumpingDog />
              Training
            </Link>
            <Link to="/AIHomePage" className="hero-btn">
              <FaBrain />
              AI
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={dogImage} alt="Dog" />
        </div>
      </section>

      <section className="adopt-section section">
        <h2>Give Them a Home</h2>
        <div className="adopt-gallery">
          <img src={adoptionImg} alt="Adopt a Cat" />
          <img src={suppliesImg} alt="Adopt a Dog" />
          <img src={forumImg} alt="Adopt a Bird" />
        </div>
        <Link to="/AdoptionPage">
          <button className="show-more">Show more</button>
        </Link>
      </section>

      <section className="care-section section">
        <div className="care-text">
          <h2>Provide your pet with the best care</h2>
          <p>
            Explore our high-quality food, toys, and accessories to keep them
            happy and healthy.
          </p>
          <div className="postionbtn">
            <Link to="/Shop" className="explore-btn">
              Explore
            </Link>
          </div>
        </div>
        <div className="care-gallery">
          <img src={careImg2} alt="Care 2" className="image" id="one" />
          <img src={careImg3} alt="Care 3" className="image" id="two" />
          <img src={careImg1} alt="Care 1" className="image" id="three" />
          <img src={careImg4} alt="Care 4" className="image" id="four" />
          <img src={careImg5} alt="Care 5" className="image" id="five" />
        </div>
      </section>

      <section className="forum-section">
        <div className="forum-text">
          <h2>Connect with Our Pet Care Forum</h2>
          <div className="postionbtn2">
            <Link to="/Community" className="explore-btn-2">
              Explore
            </Link>
          </div>
        </div>
        <div className="forum-image">
          <img src={forumPhone} alt="Forum App" />
        </div>
      </section>

      <section className="clinic-section section">
        <div className="clinic-text">
          <h2>Find the <br/> Nearest Pet <br/> Clinic Fast</h2>
          <p>
            Find the nearest vet clinic easily. Get quick access to trusted care
            for check-ups, vaccinations, and emergencies
          </p>

            <Link to="/VetClinicFinder">
              <button className="explore-btn-66">Find Clinic</button>
            </Link>

        </div>
        <div className="clinic-image">
          <img src={clinicImg} alt="Clinic" />
        </div>
      </section>

      <section className="training-section">
        <div className="training-text">
          <h2>Train Your Pet the Right Way</h2>
          <div className="training-cards">
            <button>Basic Obedience</button>
            <button>House Training</button>
            <button>Leash Training</button>
            <button>Training Videos</button>
            <button>Behavior Correction</button>
            <button>Advanced Tricks</button>
          </div>
          <Link to="/trainHome">
            <button className="explore-btn">Learn More</button>
          </Link>
        </div>
        <div className="training-image">
          <img src={trainingImg} alt="Pet Training" />
        </div>
      </section>

      <section className="ai-section section">
        <div className="ai-text">
          <h2>AI-Powered Pet Care</h2>
          <p className="ai-text-p">
            Our AI Pet Care Section brings the latest in smart technology to
            help you take care of your furry friends with ease. Discover
            innovative AI solutions for training, health tracking, and pet
            well-being!
          </p>
          <div className="ai-ptn">
            <Link to="/AIHomePage">
              <button className="explore-btn-77">Discover AI</button>
            </Link>
          </div>
        </div>
        <div className="ai-image">
          <img src={aiImage} alt="AI Pet Care" />
        </div>
      </section>
    </div>
  );
};

export default Home;
