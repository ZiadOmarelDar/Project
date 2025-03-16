import React from 'react';
import Card from 'react-bootstrap/Card';
import './EcommerceCards.css';

import img1 from '../../assets/Creamy.png'; // استبدل بالصور الفعلية
import img2 from '../../assets/Feline Natural.png';
import img3 from '../../assets/Yellow color eat.png';
import img4 from '../../assets/Freezybits.png';

const products = [
	{ id: 1, name: 'Product Name', price: '190 L.E', image: img1 },
	{ id: 2, name: 'Product Name', price: '190 L.E', image: img2 },
	{ id: 3, name: 'Product Name', price: '190 L.E', image: img3 },
	{ id: 4, name: 'Product Name', price: '190 L.E', image: img4 },
];

function ProductCardsC() {
	return (
		<div className='top-selling-container'>
			<h2 className='section-title'>Top Selling Cat Food</h2>
			<div className='cards-container'>
				{products.map((product) => (
					<Card
						key={product.id}
						className='product-card'>
						<Card.Img
							variant='top'
							src={product.image}
						/>
						<Card.Body>
							<Card.Title className='product-name'>{product.name}</Card.Title>
							<Card.Text className='product-price'>{product.price}</Card.Text>
						</Card.Body>
					</Card>
				))}
			</div>
			<button className='shop-now'>Shop Now</button>
		</div>
	);
}

export default ProductCardsC;
