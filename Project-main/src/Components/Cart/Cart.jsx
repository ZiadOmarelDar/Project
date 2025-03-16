import React, { useState } from 'react';
import './Cart.css';
import product1 from '../../assets/puppy-food.png';
import product2 from '../../assets/adult-dog-food.png';

const Cart = () => {
	const [cartItems, setCartItems] = useState([
		{
			id: 1,
			name: 'Alpha Dry Food for Puppies 20 kg',
			weight: '20kg',
			price: 1500,
			quantity: 2,
			image: product1,
		},
		{
			id: 2,
			name: 'Alpha Dry Food for Adult dog 20 kg',
			weight: '20kg',
			price: 1800,
			quantity: 1,
			image: product2,
		},
	]);

	const increaseQuantity = (id) => {
		setCartItems(
			cartItems.map((item) =>
				item.id === id ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const decreaseQuantity = (id) => {
		setCartItems(
			cartItems.map((item) =>
				item.id === id && item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const removeItem = (id) => {
		setCartItems(cartItems.filter((item) => item.id !== id));
	};

	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	return (
		<div className='cart-container'>
			<div className='Sub-cart-container'>
				<h2 className='cart-title'>Shopping Cart</h2>
				<div className='cart-header'>
					<span className='header-product'>Product</span>
					<span className='header-price'>Price</span>
					<span className='header-total'>Total</span>
				</div>
				{cartItems.map((item) => (
					<div
						key={item.id}
						className='cart-item'>
						<div className='product-info'>
							<img
								src={item.image}
								alt={item.name}
								className='product-image'
							/>
							<div className='product-details'>
								<p className='product-name'>{item.name}</p>
								<p className='product-weight'>Weight: {item.weight}</p>
								<div className='quantity-control'>
									<button
										className='qty-btn'
										onClick={() => decreaseQuantity(item.id)}>
										-
									</button>
									<span className='qty-value'>{item.quantity}</span>
									<button
										className='qty-btn'
										onClick={() => increaseQuantity(item.id)}>
										+
									</button>
									<button
										className='remove-btn'
										onClick={() => removeItem(item.id)}>
										Remove
									</button>
								</div>
							</div>
						</div>
						<span className='product-price'>{item.price} LE</span>
						<span className='product-total'>
							{item.price * item.quantity} LE
						</span>
					</div>
				))}

				{/* قسم الفاتورة والتأكيد */}
				<div className='subtotal-container'>
					<div className='subtotal-row'>
						<spanp className='subtotal'>SubTotal</spanp>
						<span className='total-price'>{subtotal} LE</span>
					</div>
					<p className='tax-info'>Taxes and shipping calculated at checkout</p>
					<button className='checkout-btn'>BUY IT NOW</button>
				</div>
			</div>
		</div>
	);
};

export default Cart;
