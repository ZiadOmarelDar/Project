import React from 'react';
import './shop.css';
import SearchBar from '../SearchBar/SearchBar';
import Carousel from '../Carousel/Carousel';
import FeaturedCategories from '../FeaturedCategories/FeaturedCategories';
import ShopByCategory from '../ShopByCategory/ShopByCategory';
import BigSale from '../BigSale/BigSale';
import ProductCardsD from '../EcommerceCards/EcommerceCardsD';
import ProductCardsC from '../EcommerceCards/EcommerceCardsC';

const Shop = () => {
	return (
		<div className='shop-container'>
			<SearchBar />
			<Carousel />
			<FeaturedCategories />
			<ShopByCategory />
			<BigSale />
			<ProductCardsD />
			<ProductCardsC />
		</div>
	);
};

export default Shop;
