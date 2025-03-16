import React from 'react';
import './FeaturedCategories.css';
import DogFood from '../../assets/Dog Dry Food.png';
import CatFood from '../../assets/Cat Dry Food.png';
import DogTreats from '../../assets/Dog Treats.png';
import CatTreats from '../../assets/Cat Treats.png';
import Litter from '../../assets/Litter.png';

const FeaturedCategories = () => {
	return (
		<div className='container-1'>
			<div className='featured-categories'>
				<h2>Featured Categories</h2>
				<div className='categories-container'>
					<div className='category'>
						<div className='image-wrapper'>
							<img
								src={DogFood}
								alt='Dog Dry Food'
							/>
						</div>
						<p>Dog Dry Food</p>
					</div>
					<div className='category'>
						<div className='image-wrapper'>
							<img
								src={CatFood}
								alt='Cat Dry Food'
							/>
						</div>
						<p>Cat Dry Food</p>
					</div>
					<div className='category'>
						<div className='image-wrapper'>
							<img
								src={DogTreats}
								alt='Dog Treats'
							/>
						</div>
						<p>Dog Treats</p>
					</div>
					<div className='category'>
						<div className='image-wrapper'>
							<img
								src={CatTreats}
								alt='Cat Treats'
							/>
						</div>
						<p>Cat Treats</p>
					</div>
					<div className='category'>
						<div className='image-wrapper'>
							<img
								src={Litter}
								alt='Litter'
							/>
						</div>
						<p>Litter</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FeaturedCategories;
