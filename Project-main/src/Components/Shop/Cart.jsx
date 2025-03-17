import { useState, useEffect } from "react";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="Sub-cart-container">
        <h2 className="cart-title">Shopping Cart</h2>
        <div className="cart-header">
          <span className="header-product">Product</span>
          <span className="header-price">Price</span>
          <span className="header-total">Total</span>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty!</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="product-info">
                <img src={item.image} alt={item.productName} className="product-image" />
                <div className="product-details">
                  <p className="product-name">{item.productName}</p>
                  <p className="product-weight">Weight: {item.weight} kg</p>
                  <div className="quantity-control">
                    <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
              <span className="product-price">{item.price} LE</span>
              <span className="product-total">{item.price * item.quantity} LE</span>
            </div>
          ))
        )}

        {/* Subtotal Section */}
        {cartItems.length > 0 && (
          <div className="subtotal-container">
            <div className="subtotal-row">
              <span className="subtotal">SubTotal</span>
              <span className="total-price">{subtotal} LE</span>
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
