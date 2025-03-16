import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

  if (loading) return <h2>Loading product details...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="product-page-1">
      <div className="product-container-1">
        <img src={product.image} alt={product.productName} className="product-image-1" />
        <div className="product-info-1">
          <h1 className="product-title-1">{product.productName}</h1>
          <h2 className="product-price-1">{product.price} LE</h2>
          
          <div className="product-description-1">
            <p><strong>Description</strong></p>
            <p> {product.description}</p>
            <br />
            <p>Stock : {product.stockQuantity} pices</p>
          </div>

          <div className="quantity-container-1">
            <p>Quantity</p>
            <div className="quantity-controls-1">
              <button className="bb" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
              <span>{quantity}</span>
              <button className="bb" onClick={() => setQuantity(quantity + 1)}>+</button>
              <button className="add-to-cart-1">ADD TO CARD</button>
            </div>
          </div>

          <div className="buttons-container-1">
            
            <button className="buy-now-1">BUY IT NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
