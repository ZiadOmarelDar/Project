import React from "react";
import "./ChecklistComponent.css";
import chick from "../../assets/chicklist1.png";

const ChecklistComponent = () => {
  return (
    <div className="checklist-container">
      <div className="header">
        <div>
          <h1>
            Checklist <br /> for New Adopters
          </h1>
          <p>Make sure you're ready to bring your new furry friend home.</p>
        </div>
        <div className="image-container">
          <img src={chick} alt="header-image" />
        </div>
      </div>

      <Section
        title="Before You Adopt"
        items={[
          "Research the breed or species you're adopting",
          "Ensure everyone in the household is on board",
          "Check pet regulations in your area or housing",
          "Consider your lifestyle (time, travel, budget)",
          "Plan for veterinary care and emergencies",
        ]}
      />

      <Section
        title="Home Preparation"
        items={[
          "Pet-proof your home (remove hazards)",
          "Set up a designated pet area",
          "Purchase essentials: bed, food, leash, litter box, etc.",
          "Secure fences/gates (for dogs)",
          "Set up food and water stations",
        ]}
      />

      <Section
        title="Health & Safety"
        items={[
          "Find a local veterinarian",
          "Schedule a first vet visit",
          "Have emergency contacts ready",
          "Learn basic pet first aid",
          "Consider pet insurance",
        ]}
      />

      <Section
        title="Training & Socialization"
        items={[
          "Research training methods",
          "Set rules and routines from day one",
          "Introduce slowly to other pets",
          "Allow time for adjustment",
          "Start socialization early",
        ]}
      />

      <Section
        title="Ongoing Commitment"
        items={[
          "Schedule regular vet checkups",
          "Spend quality time daily",
          "Keep ID tags updated",
          "Monitor health & behavior",
          "Be patient and consistent",
        ]}
        isLast={true}
      />

      <p className="footer-text">
        Ready to adopt? Start your application today!
      </p>
    </div>
  );
};

const Section = ({ title, items, isLast }) => (
  <div className="section">
    <h2>{title}</h2>
    <div className="items">
      {items.map((item, index) => (
        <div className="item" key={index}>
          {item}
        </div>
      ))}
    </div>
    {!isLast && <div className="divider"></div>}
  </div>
);

export default ChecklistComponent;
