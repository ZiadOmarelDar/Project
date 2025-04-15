import React from 'react';
import './BigSale.css';
import saleImage from '../../assets/Big Sales.png';
import { Link } from 'react-router-dom';

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
				
				<Link to='/ProductsPage' className='shop-1' > <button className='shop-now-2'> Shop Now </button></Link> 
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
