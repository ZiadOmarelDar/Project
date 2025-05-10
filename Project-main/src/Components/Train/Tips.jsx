import React from 'react';
import './DogTrain.css';

function Tips() {
	return (
		<div className='dog-train-container'>
			<div className='header-text-dog'>
				<h2>Tips</h2>
			</div>
			<div className='videos-grid'>
				<div className='video-card-dog'>
					<img
						src='https://express-elmadina.com/Pets_images/Training/Tips/1.png'
						alt="Zak George's Dog Training Revolution"
						className='video-image-dog'
					/>
					<div className='video-info-dog'>
						<a
							href='https://express-elmadina.com/Pets_images/Training/Tips/vid.mp4'
							target='_blank'>
							<div className='custom-play-icon'></div>
						</a>
						<p className='video-title-dog'>
							Zak George's Dog Training Revolution
						</p>
					</div>
				</div>
				<div className='video-card-dog'>
					<img
						src='https://express-elmadina.com/Pets_images/Training/Tips/2.png'
						alt='Dog Training 101: How to Train ANY DOG the Basics'
						className='video-image-dog'
					/>
					<div className='video-info-dog'>
						<a
							href='https://express-elmadina.com/Pets_images/Training/Tips/vid.mp4'
							target='_blank'>
							<div className='custom-play-icon'></div>
						</a>
						<p className='video-title-dog'>
							Dog Training 101: How to Train ANY DOG the Basics
						</p>
					</div>
				</div>
				<div className='video-card-dog'>
					<img
						src='https://express-elmadina.com/Pets_images/Training/Tips/3.png'
						alt='5 Dog Training Exercises You Should Do EVERY DAY At Home!'
						className='video-image-dog'
					/>
					<div className='video-info-dog'>
						<a
							href='https://express-elmadina.com/Pets_images/Training/Tips/vid.mp4'
							target='_blank'>
							<div className='custom-play-icon'></div>
						</a>
						<p className='video-title-dog'>
							5 Dog Training Exercises You Should Do EVERY DAY At Home!
						</p>
					</div>
				</div>
				<div className='video-card-dog'>
					<img
						src='https://express-elmadina.com/Pets_images/Training/Tips/4.png'
						alt='How to Teach The First 7 Things To Your Dog'
						className='video-image-dog'
					/>
					<div className='video-info-dog'>
						<a
							href='https://https://express-elmadina.com/Pets_images/Training/Tips/vid.mp4'
							target='_blank'>
							<div className='custom-play-icon'></div>
						</a>
						<p className='video-title-dog'>
							How to Teach The First 7 Things To Your Dog
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Tips;
