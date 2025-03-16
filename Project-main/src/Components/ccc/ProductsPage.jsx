import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ dogs: [], cats: [] });
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🔹 جلب المنتجات من API
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 🔹 فلترة المنتجات بناءً على الفئات المحددة
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[name] = [...prevFilters[name], value];
      } else {
        updatedFilters[name] = prevFilters[name].filter((item) => item !== value);
      }
      return updatedFilters;
    });
  };

  // 🔹 تطبيق الفلترة عند تغيير الخيارات
  useEffect(() => {
    let filtered = products;
    if (filters.dogs.length > 0 || filters.cats.length > 0) {
      filtered = filtered.filter((product) =>
        filters.dogs.includes(product.type) || filters.cats.includes(product.type)
      );
    }
    setFilteredProducts(filtered);
  }, [filters, products]);

  // 🔹 عرض التحميل أو رسالة الخطأ إذا لم ينجح الجلب
  if (loading) return <h2>Loading products...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="products-container">
      {/* 🔹 قسم الفلاتر */}
      <div className="filters">
        <h2>⚙ Filters</h2>
        <h3>DOGS</h3>
        <label><input type="checkbox" name="dogs" value="Dog Dry food" onChange={handleFilterChange} /> Dog Dry food</label>
        <label><input type="checkbox" name="dogs" value="Dog Wet food" onChange={handleFilterChange} /> Dog Wet food</label>
        <label><input type="checkbox" name="dogs" value="Puppy food" onChange={handleFilterChange} /> Puppy food</label>
        <label><input type="checkbox" name="dogs" value="Treats & Snacks" onChange={handleFilterChange} /> Treats & Snacks</label>
        
        <h3>CATS</h3>
        <label><input type="checkbox" name="cats" value="Cat Dry food" onChange={handleFilterChange} /> Cat Dry food</label>
        <label><input type="checkbox" name="cats" value="Cat Wet food" onChange={handleFilterChange} /> Cat Wet food</label>
        <label><input type="checkbox" name="cats" value="Kitten food" onChange={handleFilterChange} /> Kitten food</label>
        <label><input type="checkbox" name="cats" value="Treats & Snacks" onChange={handleFilterChange} /> Treats & Snacks</label>
      </div>
      
      {/* 🔹 قائمة المنتجات */}
      <div className="products-list">
        <div className="product-grid">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <div 
              key={product._id} 
              className="product-card" 
              onClick={() => navigate(`/products/product/${product.id}`)} // ✅ تعديل المسار
              style={{ cursor: "pointer" }} // يجعل العنصر قابل للنقر
            >
              <img src={product.image} alt={product.productName} className="product-image" />
              <h4>{product.productName}</h4>
              <p>EGP {product.price}</p>
            </div>
          ))}
        </div>

        {/* 🔹 زر "تحميل المزيد" */}
        {visibleProducts < filteredProducts.length && (
          <div className="show-more-container">
            <button onClick={() => setVisibleProducts(visibleProducts + 8)} className="show-more-btn">
              MORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
