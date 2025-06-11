import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiFilter } from "react-icons/hi";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ dogs: [], cats: [] });
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products from API
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
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

  // Read query string (e.g., ?filter=dog)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterType = params.get("filter");

    if (filterType === "dog") {
      setFilters({
        dogs: ["Dog Dry food", "Dog Wet food", "Puppy food", "Treats & Snacks"],
        cats: [],
      });
    } else if (filterType === "cat") {
      setFilters({
        cats: [
          "Cat Dry food",
          "Cat Wet food",
          "Kitten food",
          "Treats & Snacks",
        ],
        dogs: [],
      });
    }
  }, [location.search]);

  // Apply filters to products
  useEffect(() => {
    let filtered = products;
    if (filters.dogs.length || filters.cats.length) {
      filtered = products.filter((product) =>
        [...filters.dogs, ...filters.cats].includes(product.type)
      );
    }
    setFilteredProducts(filtered);
  }, [filters, products]);
  // Handle checkbox filter change
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prevFilters) => {
      const updated = { ...prevFilters };
      if (checked) {
        if (!updated[name].includes(value)) {
          updated[name] = [...updated[name], value];
        }
      } else {
        updated[name] = updated[name].filter((item) => item !== value);
      }
      return updated;
    });
  };

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showFilters &&
        !e.target.closest(".filters") &&
        !e.target.closest(".filter-toggle-btn")
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFilters]);

  if (loading) return <h2>Loading products...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="products-container">
      {/* Filter Panel */}
      <div
        className={`filters ${showFilters ? "show-filters" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          <HiFilter /> Filters
        </h2>

        <h3>DOGS</h3>
        <label>
          <input
            type="checkbox"
            name="dogs"
            value="Dog Dry food"
            onChange={handleFilterChange}
          />
          Dog Dry food
        </label>
        <label>
          <input
            type="checkbox"
            name="dogs"
            value="Dog Wet food"
            onChange={handleFilterChange}
          />
          Dog Wet food
        </label>
        <label>
          <input
            type="checkbox"
            name="dogs"
            value="Puppy food"
            onChange={handleFilterChange}
          />
          Puppy food
        </label>
        <label>
          <input
            type="checkbox"
            name="dogs"
            value="Treats & Snacks"
            onChange={handleFilterChange}
          />
          Treats & Snacks
        </label>

        <h3>CATS</h3>
        <label>
          <input
            type="checkbox"
            name="cats"
            value="Cat Dry food"
            onChange={handleFilterChange}
          />
          Cat Dry food
        </label>
        <label>
          <input
            type="checkbox"
            name="cats"
            value="Cat Wet food"
            onChange={handleFilterChange}
          />
          Cat Wet food
        </label>
        <label>
          <input
            type="checkbox"
            name="cats"
            value="Kitten food"
            onChange={handleFilterChange}
          />
          Kitten food
        </label>
        <label>
          <input
            type="checkbox"
            name="cats"
            value="Treats & Snacks"
            onChange={handleFilterChange}
          />
          Treats & Snacks
        </label>
      </div>

      {/* Toggle Button */}
      <button
        className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowFilters(!showFilters);
        }}
      >
        <HiFilter /> {showFilters ? "Close Filters" : "Open Filters"}
      </button>

      {/* Products Grid */}
      <div className="products-list">
        <div className="product-grid">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <div
              key={product._id}
              className="product-card-2"
              onClick={() => navigate(`/products/product/${product._id}`)}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="product-image-9"
              />
			  <div className="n-p">
              <h4>{product.productName}</h4>
              <br />
              <div className="p-pr">
                <p>EGP {product.price}</p>
              </div>
			  </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleProducts < filteredProducts.length && (
          <div className="show-more-container">
            <button
              onClick={() => setVisibleProducts(visibleProducts + 8)}
              className="show-more-btn"
            >
              MORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
