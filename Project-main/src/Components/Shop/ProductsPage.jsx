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
    const filterType = params.get("filter"); // "dog" أو "cat"

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

	return (
		<div className='products-container'>
			<div className={`filters ${showFilters ? 'show-filters' : ''}`}>
				<h2>
					<HiFilter /> Filters
				</h2>

				<h3>DOGS</h3>
				{['Dog Dry food', 'Dog Wet food', 'Puppy food', 'Treats & Snacks'].map(
					(type) => (
						<label key={type}>
							<input
								type='checkbox'
								name='dogs'
								value={type}
								onChange={handleFilterChange}
							/>
							{type}
						</label>
					)
				)}

				<h3>CATS</h3>
				{['Cat Dry food', 'Cat Wet food', 'Kitten food', 'Treats & Snacks'].map(
					(type) => (
						<label key={type}>
							<input
								type='checkbox'
								name='cats'
								value={type}
								onChange={handleFilterChange}
							/>
							{type}
						</label>
					)
				)}
			</div>

			<button
				className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
				onClick={(e) => {
					e.stopPropagation();
					setShowFilters(!showFilters);
				}}>
				<HiFilter /> {showFilters ? 'Close Filters' : 'Open Filters'}
			</button>

			<div className='products-list'>
				{filteredProducts.length === 0 ? (
					<div className='no-products-message-22'>
						<h2>No products found for your search.</h2>
						<button
							className='back-to-shop-btn-2'
							onClick={() => navigate('/Shop')}>
							Back to Shop
						</button>
					</div>
				) : (
					<>
						<div className='product-grid'>
							{filteredProducts.slice(0, visibleProducts).map((product) => (
								<div
									key={product._id}
									className='product-card-2'
									onClick={() => navigate(`/products/product/${product._id}`)}>
									<img
										src={product.image}
										alt={product.productName}
										className='product-image-9'
									/>
									<h4>{product.productName}</h4>
									<p>EGP {product.price}</p>
								</div>
							))}
						</div>

						{visibleProducts < filteredProducts.length && (
							<div className='show-more-container'>
								<button
									onClick={() => setVisibleProducts(visibleProducts + 8)}
									className='show-more-btn'>
									MORE
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ProductsPage;
