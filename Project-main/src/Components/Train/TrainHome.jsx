import React from 'react';
import { FaPlayCircle } from 'react-icons/fa'; // استيراد أيقونة التشغيل
import { Link } from 'react-router-dom'; // استيراد Link للتنقل
import trainDog from '../../assets/Train/TrainingDog.png';
import trainer1 from '../../assets/Train/trainer1.png'; // استبدل بمسار الصورة الأولى
import trainer2 from '../../assets/Train/trainer2.png'; // استبدل بمسار الصورة الثانية
import trainer3 from '../../assets/Train/trainer3.png'; // استبدل بمسار الصورة الثالثة
import trainer4 from '../../assets/Train/trainer4.png'; // استبدل بمسار الصورة الرابعة
import Training1 from '../../assets/Train/Training1.png'; // استبدل بمسار صورة الفيديو الأولى
import Training2 from '../../assets/Train/Training2.png'; // استبدل بمسار صورة الفيديو الثانية
import Training3 from '../../assets/Train/Training3.png'; // استبدل بمسار صورة الفيديو الثالثة
import './TrainHome.css';

function TrainHome() {
	return (
		<>
			<div className='train-header'></div>
			{/* Section 1: Hero */}
			<section className='train-section1'>
				<div className='section1-text'>
					<h1>
						Make your pet understand you, <br /> it's enough!
					</h1>
					<p>
						Learn how to train your pet effectively and provide the best care to
						ensure they thrive. From basic commands to advanced training
						techniques, we guide you every step of the way.
					</p>
				</div>
				<div className='image-train'>
					<img
						src={trainDog}
						alt='Dog'
					/>
				</div>
			</section>

			{/* Section 2: Our Pest Trainers */}
			<section className='train-section2'>
				<h2 className='section2-title'>Our Pest Trainers</h2>
				<div className='trainers-container'>
					<div className='trainer'>
						<img
							src={trainer1}
							alt='Trainer 1'
							className='trainer-image'
						/>
						<p className='trainer-name'>Trainer 1</p>
					</div>
					<div className='trainer'>
						<img
							src={trainer2}
							alt='Trainer 2'
							className='trainer-image'
						/>
						<p className='trainer-name'>Trainer 2</p>
					</div>
					<div className='trainer'>
						<img
							src={trainer3}
							alt='Trainer 3'
							className='trainer-image'
						/>
						<p className='trainer-name'>Trainer 3</p>
					</div>
					<div className='trainer'>
						<img
							src={trainer4}
							alt='Trainer 4'
							className='trainer-image'
						/>
						<p className='trainer-name'>Trainer 4</p>
					</div>
				</div>
			</section>

			{/* Section 3: Training Videos */}
			<section className='train-section3'>
				<h2 className='section3-title'>Training Videos</h2>
				<svg
					width='0'
					height='0'>
					<defs>
						<clipPath
							id='waveClip'
							clipPathUnits='objectBoundingBox'>
							<path d='M0,0 H1,1 V0.45 Q0.99,0.99 0.6,0.85 Q0.15,0.65 0,0.95 V0 Z' />
						</clipPath>
					</defs>
				</svg>
				<div className='videos-container'>
					<div className='video-card'>
						<img
							src={Training1}
							alt='Training 1'
							className='video-image'
						/>
						<div className='video-info'>
							<Link to='/dogTrain'>
								<FaPlayCircle className='play-icon' />
							</Link>
							<div>
								<p className='video-title'>Train DOG</p>
								<p className='video-subtitle'>4 free Available</p>
							</div>
						</div>
					</div>
					<div className='video-card'>
						<img
							src={Training2}
							alt='Training 2'
							className='video-image'
						/>
						<div className='video-info'>
							<Link to='/catTrain'>
								<FaPlayCircle className='play-icon' />
							</Link>
							<div>
								<p className='video-title'>Train cat</p>
								<p className='video-subtitle'>4 free Available</p>
							</div>
						</div>
					</div>
					<div className='video-card'>
						<img
							src={Training3}
							alt='Training 3'
							className='video-image'
						/>
						<div className='video-info'>
							<Link to='/tips'>
								<FaPlayCircle className='play-icon' />
							</Link>
							<div>
								<p className='video-title'>Tips</p>
								<p className='video-subtitle'>4 free Available</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default TrainHome;
