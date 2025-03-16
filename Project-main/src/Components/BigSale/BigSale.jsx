import React from 'react';
import './BigSale.css';
import saleImage from '../../assets/Big Sales.png';

const BigSale = () => {
	return (
		<div className='big-sale-container'>
			<div className='sale-content'>
				<h2 className='sale-title'>
					HOT <span className='sale-highlight'>SALES</span>
				</h2>
				<p className='sale-text'>
					<span className='sale-text'>CHECK NOW OUR SPECIAL OFFERS</span>
				</p>
				<button className='shop-now'>Shop Now</button>
			</div>

			<div className='sale-image'>
				<img
					src={saleImage}
					alt='Big Sale'
				/>
			</div>
		</div>
	);
};

export default BigSale;
