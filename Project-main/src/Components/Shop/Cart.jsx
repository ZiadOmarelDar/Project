import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching cart. Please try again."
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, location]);

  const increaseQuantity = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const item = cartItems.find((item) => item.productId._id === productId);
    if (!item) return;

    try {
      await axios.post(
        "http://localhost:3001/cart/add",
        { productId, quantity: item.quantity + 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError("Error updating quantity. Please try again.");
    }
  };

  const decreaseQuantity = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const item = cartItems.find((item) => item.productId._id === productId);
    if (!item || item.quantity <= 1) return;

    try {
      await axios.post(
        "http://localhost:3001/cart/add",
        { productId, quantity: item.quantity - 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError("Error updating quantity. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (err) {
      setError("Error removing item from cart.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  return (
    <div className="cart-container">
      <div className="Sub-cart-container">
        <h2 className="cart-title">Shopping Cart</h2>
        <div className="cart-header">
          <span className="header-product">Product</span>
          <span className="header-price">Price</span>
          <span className="header-total">Total</span>
        </div>

        {error && <p className="error">{error}</p>}
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty!</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId?._id || Math.random()} className="cart-item">
              <div className="product-info">
                <img
                  src={item.productId?.image || "https://via.placeholder.com/100"}
                  alt={item.productId?.productName || "Product"}
                  className="product-image"
                  onClick={() => navigate(`/products/product/${item.productId?._id}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="product-details">
                  <p
                    className="product-name"
                    onClick={() => navigate(`/products/product/${item.productId?._id}`)}
                    
                  >
                    {item.productId?.productName || "Unknown Product"}
                  </p>
                  <p className="product-weight">
                    Weight: {item.weight || "N/A"} kg
                  </p>
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item.productId?._id)}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity || 1}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(item.productId?._id)}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.productId?._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <span className="product-price">
                {item.productId?.price ? `${item.productId.price} LE` : "N/A"}
              </span>
              <span className="product-total">
                {item.productId?.price
                  ? `${item.productId.price * (item.quantity || 1)} LE`
                  : "N/A"}
              </span>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <div className="subtotal-container">
            <div className="subtotal-row">
              <span className="subtotal">SubTotal</span>
              <span className="total-price">
                {isNaN(subtotal) ? "N/A" : `${subtotal} LE`}
              </span>
            </div>
            <p className="tax-info">Taxes and shipping calculated at checkout</p>
            <button className="checkout-btn">BUY IT NOW</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
