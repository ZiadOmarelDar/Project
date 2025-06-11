import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiFilter } from 'react-icons/hi';
import './ProductsPage.css';

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

	useEffect(() => {
		fetch('http://localhost:3001/products')
			.then((res) => {
				if (!res.ok) {
					throw new Error('Failed to fetch products');
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

	const handleFilterChange = (e) => {
		const { name, value, checked } = e.target;
		setFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters };

			if (checked) {
				if (!updatedFilters[name].includes(value)) {
					updatedFilters[name] = [...updatedFilters[name], value];
				}
			} else {
				updatedFilters[name] = updatedFilters[name].filter(
					(item) => item !== value
				);
			}

			return updatedFilters;
		});
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const searchTerm = params.get('search')?.toLowerCase() || '';
		const filterParam = params.get('filter')?.toLowerCase() || '';

		let filtered = products;

		// Apply category filter from URL (e.g., ?filter=cat or ?filter=dog)
		if (filterParam) {
			if (filterParam === 'cat') {
				filtered = products.filter((product) =>
					[
						'Cat Dry food',
						'Cat Wet food',
						'Kitten food',
						'Treats & Snacks',
					].includes(product.type)
				);
			} else if (filterParam === 'dog') {
				filtered = products.filter((product) =>
					[
						'Dog Dry food',
						'Dog Wet food',
						'Puppy food',
						'Treats & Snacks',
					].includes(product.type)
				);
			}
		}

		// Apply search term filter from URL (e.g., ?search=term)
		if (searchTerm) {
			filtered = filtered.filter(
				(product) =>
					(product.productName &&
						product.productName.toLowerCase().includes(searchTerm)) ||
					(product.type && product.type.toLowerCase().includes(searchTerm)) ||
					(product.company &&
						product.company.toLowerCase().includes(searchTerm))
			);
		}

		// Apply checkbox filters
		if (filters.dogs.length || filters.cats.length) {
			filtered = filtered.filter((product) =>
				[...filters.dogs, ...filters.cats].includes(product.type)
			);
		}

		setFilteredProducts(filtered);
	}, [filters, products, location.search]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				showFilters &&
				!e.target.closest('.filters') &&
				!e.target.closest('.filter-toggle-btn')
			) {
				setShowFilters(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [showFilters]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const filterType = params.get('filter'); // "dog" أو "cat"

		if (filterType === 'dog') {
			setFilters({
				dogs: ['Dog Dry food', 'Dog Wet food', 'Puppy food', 'Treats & Snacks'],
				cats: [],
			});
		} else if (filterType === 'cat') {
			setFilters({
				cats: [
					'Cat Dry food',
					'Cat Wet food',
					'Kitten food',
					'Treats & Snacks',
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
