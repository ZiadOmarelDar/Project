import React, { useState, useEffect } from 'react';
import './Carousel.css';
import UperImage from '../../assets/UperImagejpeg.png';
import BackImage from '../../assets/back.png';
import DogsImage from '../../assets/Dogs.png';

const images = [UperImage, BackImage, DogsImage];

const carousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % images.length);
		}, 9000);
		return () => clearInterval(interval);
	}, []);

	return (
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
				<button
					className='prev'
					onClick={() =>
						setCurrentSlide((currentSlide - 1 + images.length) % images.length)
					}>
					&#10094;
				</button>
				<button
					className='next'
					onClick={() => setCurrentSlide((currentSlide + 1) % images.length)}>
					&#10095;
				</button>
				<div className='dots'>
					{images.map((_, index) => (
						<span
							key={index}
							className={index === currentSlide ? 'dot active' : 'dot'}
							onClick={() => setCurrentSlide(index)}></span>
					))}
				</div>
			</div>
		</div>
	);
};

export default carousel;
