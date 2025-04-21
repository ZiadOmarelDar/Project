import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './shop.css';
import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';
import FeaturedCategories from '../FeaturedCategories/FeaturedCategories';
import ShopByCategory from '../ShopByCategory/ShopByCategory';
import BigSale from '../BigSale/BigSale';


const Shop = () => {
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost:3001/products')
			.then((response) => response.json())
			.then((data) => setProducts(data.slice(0, 6)))
			.catch((error) => console.error('Error fetching products:', error));
	}, []);

	return (
		<div className='shop-container'>
			<SearchBar />
			<Carousel />
			<FeaturedCategories />
			<ShopByCategory />
			<BigSale />

			<div className='products-list'>
				<div className='featured-categories'>
					<h2>Featured Products</h2>
				</div>
				<div className='products-grid-3'>
					{products.map((product) => (
						<div
							key={product._id}
							className='product-card-2'
							onClick={() => navigate(`/products/product/${product._id}`)}
							style={{ cursor: 'pointer' }}>
							<img
								src={product.image}
								alt={product.productName}
								className='product-image-9'
							/>
							<h4>{product.productName}</h4>
							<p>{product.price} LE</p>
						</div>
					))}
				</div>

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
