import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams(); // 🔹 التقاط ID المنتج من المسار
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

      <div className="product-details">
        <img src={product.image} alt={product.productName} className="product-image" />
        <div className="product-info">
          <h1>{product.productName}</h1>
          <p className="description">{product.description}</p>
          <h3 className="price">EGP {product.price}</h3>
          <p className="stock">Stock: {product.stockQuantity}</p>
          
          <button className="add-to-cart">🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
