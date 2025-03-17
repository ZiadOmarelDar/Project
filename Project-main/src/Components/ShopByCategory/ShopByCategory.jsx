import React from "react";
import "./ShopByCategory.css";
import Dogs from "../../assets/Dogs.png";
import Cats from "../../assets/Cats.png";

const ShopByCategory = () => {
  return (
    <div className="container-2">
      <div className="shop-by-category">
        <h2>Shop by Category</h2>
        <div className="category-container">
          <div className="category">
            <div className="image-wrapper-sec large">
              <img src={Dogs} alt="Dogs" />
            </div>
            <p>Dogs</p>
          </div>
          <div className="category">
            <div className="image-wrapper-sec large">
              <img src={Cats} alt="Cats" />
            </div>
            <p>Cats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
