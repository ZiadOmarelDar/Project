import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import UperImage from '../../assets/upper.png';
import BackImage from '../../assets/back.png';
import DogsImage from '../../assets/AboutUs/GroupOfDogsAboutUs.png';
import DogFood from '../../assets/Dog Dry Food.png';
import CatFood from '../../assets/Cat Dry Food.png';
import DogTreats from '../../assets/Dog Treats.png';
import CatTreats from '../../assets/Cat Treats.png';
import Litter from '../../assets/Litter.png';
import Dogs from '../../assets/Dogs.png';
import Cats from '../../assets/Cats.png';
import saleImage from '../../assets/Big Sales.png';
import './Shop.css';

const images = [UperImage, BackImage, DogsImage];

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchError, setSearchError] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % images.length);
		}, 9000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:3001/products')
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching products:', error);
				setError('Failed to load products');
				setLoading(false);
			});
	}, []);

	const handleSearch = (e) => {
		if (e.key === 'Enter' || e.type === 'click') {
			const term = searchTerm.trim();
			if (!term) {
				setSearchError('Please enter a valid search term.');
				return;
			}

			setSearchError('');
			setShowSuggestions(false);
			navigate(`/ProductsPage?search=${encodeURIComponent(term)}`);
		}
	};

	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);

		if (term) {
			const filteredSuggestions = products
				.filter(
					(product) =>
						(product.productName &&
							product.productName.toLowerCase().includes(term.toLowerCase())) ||
						(product.type &&
							product.type.toLowerCase().includes(term.toLowerCase())) ||
						(product.company &&
							product.company &&
							product.company.toLowerCase().includes(term.toLowerCase()))
				)
				.map((product) => product.productName || product.type);
			setSuggestions([...new Set(filteredSuggestions)].slice(0, 5));
			setShowSuggestions(true);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setSearchTerm(suggestion);
		setShowSuggestions(false);
		navigate(`/ProductsPage?search=${encodeURIComponent(suggestion)}`);
	};

	const handleBlur = () => {
		setTimeout(() => setShowSuggestions(false), 100);
	};

	const featuredProducts = Array.isArray(products) ? products.slice(0, 6) : [];

	return (
		<div className='ShopShopContainer'>
			<div className='ShopSearchBar'>
				<button
					className='ShopSearchIcon'
					onClick={handleSearch}>
					<FaSearch style={{ color: 'white' }} />
				</button>
				<input
					type='text'
					placeholder='Search For Product'
					className='ShopSearchInput'
					value={searchTerm}
					onChange={handleInputChange}
					onKeyDown={handleSearch}
					onFocus={() => setShowSuggestions(true)}
					onBlur={handleBlur}
				/>
			</div>
			{searchError && <p className='ShopSearchError'>{searchError}</p>}

			<div className='ShopContainer'>
				<div className='ShopCarousel'>
					{images.map((img, index) => (
						<img
							key={index}
							src={img}
							alt={`Slide ${index + 1}`}
							className={index === currentSlide ? 'ShopActive' : 'ShopHidden'}
						/>
					))}
					<button
						className='ShopPrev'
						onClick={() =>
							setCurrentSlide(
								(currentSlide - 1 + images.length) % images.length
							)
						}
						aria-label='Previous slide'>
						❮
					</button>
					<button
						className='ShopNext'
						onClick={() => setCurrentSlide((currentSlide + 1) % images.length)}
						aria-label='Next slide'>
						❯
					</button>
					<div className='ShopDots'>
						{images.map((_, index) => (
							<span
								key={index}
								className={
									index === currentSlide ? 'ShopDot ShopActive' : 'ShopDot'
								}
								onClick={() => setCurrentSlide(index)}
								role='button'
								aria-label={`Go to slide ${index + 1} of ${
									images.length
								}`}></span>
						))}
					</div>
				</div>
			</div>

			<div className='ShopContainer1'>
				<div className='ShopFeaturedCategories'>
					<h2>Featured Categories</h2>
					<div className='ShopCategoriesContainer'>
						{[
							{
								img: DogFood,
								alt: 'Dog Dry Food',
								label: 'Dog Dry Food',
								path: '/ProductsPage?filter=dog',
							},
							{
								img: CatFood,
								alt: 'Cat Dry Food',
								label: 'Cat Dry Food',
								path: '/ProductsPage?filter=cat',
							},
							{
								img: DogTreats,
								alt: 'Dog Treats',
								label: 'Dog Treats',
								path: '/ProductsPage?filter=dog',
							},
							{
								img: CatTreats,
								alt: 'Cat Treats',
								label: 'Cat Treats',
								path: '/ProductsPage?filter=cat',
							},
							{
								img: Litter,
								alt: 'Litter',
								label: 'Litter',
								path: '/ProductsPage',
							},
						].map((category) => (
							<Link
								to={category.path}
								key={category.alt}
								className='ShopCategory'
								role='button'
								aria-label={`View ${category.label}`}>
								<div className='ShopImageWrapper'>
									<img
										src={category.img}
										alt={category.alt}
									/>
								</div>
								<p>{category.label}</p>
							</Link>
						))}
					</div>
				</div>
			</div>

			<div className='ShopContainer3'>
				<div className='ShopShopByCategory'>
					<h2>Shop by Category</h2>
					<div className='ShopCategoryContainer'>
						{[
							{
								img: Dogs,
								alt: 'Dogs',
								label: 'Dogs',
								path: '/ProductsPage?filter=dog',
							},
							{
								img: Cats,
								alt: 'Cats',
								label: 'Cats',
								path: '/ProductsPage?filter=cat',
							},
						].map((category) => (
							<Link
								to={category.path}
								key={category.alt}
								className='ShopCategory'
								role='button'
								aria-label={`View ${category.label}`}>
								<div className='ShopImageWrapperSec ShopLarge'>
									<img
										src={category.img}
										alt={category.alt}
									/>
								</div>
								<p>{category.label}</p>
							</Link>
						))}
					</div>
				</div>
			</div>

			<div className='ShopBigSaleContainer'>
				<div className='ShopSaleContent'>
					<h2 className='ShopSaleTitle'>
						HOT{' '}
						<span className='ShopSaleHighlight'>
							{' '}
							<br /> SALES
						</span>
					</h2>
					<p className='ShopSaleText'>CHECK NOW OUR SPECIAL OFFERS</p>
					<Link
						to='/ProductsPage'
						className='ShopShopNow2'>
						Shop Now
					</Link>
				</div>
				<div className='ShopSaleImage'>
					<img
						src={saleImage}
						alt='Big Sale'
					/>
				</div>
			</div>

			<div className='ShopProductsList'>
				<div className='ShopFeaturedProducts'>
					<h2>Featured Products</h2>
				</div>
				{loading ? (
					<p>Loading products...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div className='ShopProductsGrid'>
						{featuredProducts.map((product) => (
							<div
								key={product._id}
								className='ShopProductCard'
								onClick={() => navigate(`/products/product/${product._id}`)}
								style={{ cursor: 'pointer' }}>
								<img
									src={product.image}
									alt={product.productName}
									className='ShopProductImage'
								/>
								<h4>{product.productName}</h4>
								<p>{product.price} LE</p>
							</div>
						))}
					</div>
				)}
				<button
					className='ShopViewAllBtn'
					onClick={() => navigate('/ProductsPage')}>
					View All Products
				</button>
			</div>
		</div>
	);
};

export default Shop;
