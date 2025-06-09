import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/cart/add",
        { productId: id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPopup(true); // Show popup on successful addition
      // Hide popup after 5 seconds
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      // Cleanup timer on unmount or re-render
      return () => clearTimeout(timer);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error adding to cart. Please try again."
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        navigate("/login");
      }
    }
  };

  if (loading) return <h2>Loading product details...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="product-page-1">
      <div className="product-container-1">
        <img src={product.image} alt={product.productName} className="product-image-1" />
        <div className="product-info-1">
          <h1 className="product-title-1">{product.productName}</h1>
          <div className="pr">
          <h2>Price : </h2>
          <h2 className="product-price-1">{product.price} LE</h2>
          </div>

          <div className="product-description-1">
            <p><strong>Description</strong></p>
            <p>{product.description}</p>
            <p>Stock: {product.stockQuantity} pieces</p>
          </div>

          <div className="quantity-container-1">
            <p>Quantity</p>
            <br />
            <div className="quantity-controls-1">
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              <button className="add-to-cart-1" onClick={addToCart}>
                ADD TO CART
              </button>
            </div>
          </div>

          <div className="buttons-container-1">
            <Link to="/CheckoutPage">
              <button className="buy-now-1">BUY IT NOW</button>
            </Link>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Product added to cart!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;