import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import UperImage from '../../assets/UperImagejpeg.png';
import BackImage from '../../assets/back.png';
import DogsImage from '../../assets/Dogs.png';
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
	const navigate = useNavigate();

	// Carousel auto-slide
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % images.length);
		}, 9000);
		return () => clearInterval(interval);
	}, []);

	// Fetch products
	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:3001/products')
			.then((response) => response.json())
			.then((data) => {
				setProducts(data.slice(0, 6));
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching products:', error);
				setError('Failed to load products');
				setLoading(false);
			});
	}, []);

	return (
		<div className='shop-container'>
			<div className='search-bar'>
				<div className='search-icon'>
					<FaSearch style={{ color: 'white' }} />
				</div>
				<input
					type='text'
					placeholder='Search For Product'
					className='search-input'
				/>
			</div>

			<div className='container'>
				<div className='carousel'>
					{images.map((img, index) => (
						<img
							key={index}
							src={img}
							alt={`Slide ${index + 1}`}
							className={index === currentSlide ? 'active' : 'hidden'}
						/>
					))}
					{/* <button
						className='prev'
						onClick={() =>
							setCurrentSlide(
								(currentSlide - 1 + images.length) % images.length
							)
						}
						aria-label='Previous slide'>
						❮
					</button>
					<button
						className='next'
						onClick={() => setCurrentSlide((currentSlide + 1) % images.length)}
						aria-label='Next slide'>
						❯
					</button> */}
					<div className='dots'>
						{images.map((_, index) => (
							<span
								key={index}
								className={index === currentSlide ? 'dot active' : 'dot'}
								onClick={() => setCurrentSlide(index)}
								role='button'
								aria-label={`Go to slide ${index + 1}`}></span>
						))}
					</div>
				</div>
			</div>

			<div className='container-1'>
				<div className='featured-categories'>
					<h2>Featured Categories</h2>
					<div className='categories-container'>
						{[
							{
								img: DogFood,
								alt: 'Dog Dry Food',
								label: 'Dog Dry Food',
								path: '/productsPage',
							},
							{
								img: CatFood,
								alt: 'Cat Dry Food',
								label: 'Cat Dry Food',
								path: '/productsPage',
							},
							{
								img: DogTreats,
								alt: 'Dog Treats',
								label: 'Dog Treats',
								path: '/productsPage',
							},
							{
								img: CatTreats,
								alt: 'Cat Treats',
								label: 'Cat Treats',
								path: '/productsPage',
							},
							{
								img: Litter,
								alt: 'Litter',
								label: 'Litter',
								path: '/productsPage',
							},
						].map((category) => (
							<Link
								to={category.path}
								key={category.alt}
								className='category'
								role='button'
								aria-label={`View ${category.label}`}>
								<div className='image-wrapper'>
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

			<div className='container-3'>
				<div className='shop-by-category'>
					<h2>Shop by Category</h2>
					<div className='category-container'>
						{[
							{ img: Dogs, alt: 'Dogs', label: 'Dogs', path: '/productsPage' },
							{ img: Cats, alt: 'Cats', label: 'Cats', path: '/productsPage' },
						].map((category) => (
							<Link
								to={category.path}
								key={category.alt}
								className='category'
								role='button'
								aria-label={`View ${category.label}`}>
								<div className='image-wrapper-sec large'>
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

			<div className='big-sale-container'>
				<div className='sale-content'>
					<h2 className='sale-title'>
						HOT{' '}
						<span className='sale-highlight'>
							{' '}
							<br /> SALES
						</span>
					</h2>
					<p className='sale-text'>CHECK NOW OUR SPECIAL OFFERS</p>
					<Link
						to='/ProductsPage'
						className='shop-now-2'>
						Shop Now
					</Link>
				</div>
				<div className='sale-image'>
					<img
						src={saleImage}
						alt='Big Sale'
					/>
				</div>
			</div>

			<div className='products-list'>
				<div className='featured-products'>
					<h2>Featured Products</h2>
				</div>
				{loading ? (
					<p>Loading products...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div className='products-grid'>
						{products.map((product) => (
							<div
								key={product._id}
								className='product-card'
								onClick={() => navigate(`/products/product/${product._id}`)}
								style={{ cursor: 'pointer' }}>
								<img
									src={product.image}
									alt={product.productName}
									className='product-image'
								/>
								<h4>{product.productName}</h4>
								<p>{product.price} LE</p>
							</div>
						))}
					</div>
				)}
				<button
					className='view-all-btn'
					onClick={() => navigate('/ProductsPage')}>
					View All Products
				</button>
			</div>
		</div>
	);
};

export default Shop;
