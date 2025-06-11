import React, { useState } from 'react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Order</h2>
      <form onSubmit={handleSubmit}>
        {/* Order Info Section */}
        <div className="section-30">
          <h3>Order Info:</h3>
          <input type="text" placeholder="Full Name" required />
          <input type="tel" placeholder="Phone Number" required />
          <input type="email" placeholder="Email Address" required />
          <input type="text" placeholder="City" required />
        </div>

        {/* Payment Method Section */}
        <div className="section payment-method">
          <h3>Payment Method</h3>
          <div className="payment-option">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit/Debit Card
            </label>
            <div className="card-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
              <img src="data:image/png;base64,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" alt="Meeza" />
            </div>
            {paymentMethod === 'card' && (
              <div className="card-details-30">
                <input type="text" placeholder="Card Number" required />
                <input type="text" placeholder="Cardholder Name" required />
                <div className="card-info-30">
                  <input className='cvv' type="text" placeholder="CVV" required />
                  <div className="expiry">
                    <label>Expiry Date</label>
                    <select required>
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select required>
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={2025 + i}>{2025 + i}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="card-actions">
                  <button type="button" className="add-btn">Add</button>
                  <button type="button" className="cancel-btn">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="payment-option">
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <p className="note">A fee of EGP 20 may apply for using this service.</p>
          </div>
        </div>

        {/* Confirm Button */}
        <button type="submit" className="confirm-btn-30">Confirm</button>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Order confirmed successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;