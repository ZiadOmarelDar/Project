import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';
import AboutUsImage1 from '../../assets/AboutUs/BlackDogAboutUs.png';
import AboutUsImage2 from '../../assets/AboutUs/SmallDogAboutUs.png';
import AboutUsImage3 from '../../assets/AboutUs/GroupOfDogsAboutUs.png';

function AboutUs() {
	return (
		<div className='AboutUsAboutUsContainer'>
			<header className='AboutUsAboutUsHeader'>
				<h1>About Us</h1>
				<Link
					className='AboutUsLearnMoreBtn'
					to='/'>
					See More
				</Link>
			</header>
			<div className='AboutUsWelcomeSection'>
				<h2>Welcome to PetCare Haven</h2>
				<p>- the easy way to take care of your pet!</p>
			</div>
			<div className='AboutUsContentSection'>
				<div className='AboutUsTextContainer'>
					<div className='AboutUsTextColumn'>
						<h1>1.</h1>
						<h3>Who We Are</h3>
						<p>
							We’re a group of people who love animals and want to make pet care
							easier for everyone. PetCare Haven is a place where you can find
							everything your pet needs in one simple app or website.
						</p>
					</div>
					<div className='AboutUsTextColumn'>
						<h1>2.</h1>
						<h3>What We Do</h3>
						<p>
							We help you take care of your pet by offering everything in one
							place – from adopting a new furry friend, finding the nearest vet
							clinic, and shopping for food and toys, to learning training tips,
							chatting with other pet lovers in our forum, and getting quick
							answers through our smart AI assistant.
						</p>
					</div>
					<div className='AboutUsTextColumn'>
						<h1>3.</h1>
						<h3>How We Help</h3>
						<p>
							We save you time and effort by putting all your pet needs in one
							app. No more searching in many places – with PetCare Haven, you
							get trusted services, helpful info, and a caring community in just
							a few taps.
						</p>
					</div>
					<div className='AboutUsTextColumn'>
						<h1>4.</h1>
						<h3>Create success story</h3>
						<p>
							Every happy pet and smiling owner is a success story. Whether it's
							helping someone find their first puppy, guiding a cat through
							training, or supporting a rescue dog’s recovery – we’re proud to
							be part of each journey.
						</p>
					</div>
				</div>
				<div className='AboutUsImageContainer'>
					<div className='AboutUsImageGroupTop'>
						<img
							src={AboutUsImage1}
							alt='Who We Are'
							className='AboutUsImageTall'
						/>
						<img
							src={AboutUsImage2}
							alt='What We Do'
							className='AboutUsImageShort'
						/>
					</div>
					<div className='AboutUsImageGroupBottom'>
						<img
							src={AboutUsImage3}
							alt='How We Help & Success Story'
							className='AboutUsImageWide'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AboutUs;
