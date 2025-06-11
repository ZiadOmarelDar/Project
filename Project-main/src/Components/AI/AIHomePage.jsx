import React from 'react';
import './AIHomePage.css';
import { Link } from 'react-router-dom';
import dogAI from '../../assets/dogAI.png';
import catAI from '../../assets/catAI.png';
import dAI from '../../assets/dAI.png';

const AIHomePage = () => {
	return (
		<div className='page-container-50'>
			<nav className='navbar-50'>
				<ul className='nav-list-50'>
					<li>
						<Link to='/AdoptionPredictor'>Adoption Likelihood Predictor</Link>
					</li>
					<li>
						<Link to='/PetChecker'>Pet Health Checker</Link>
					</li>
					<li>
						<Link to='/PetPricePredictor'>PawCost</Link>
					</li>
				</ul>
			</nav>

			<div className='main-content-50'>
				<div className='cards-container-50'>
					<Link
						to='/AdoptionPredictor'
						className='card card-50'>
						<div className='card-50'>
							<img
								src={catAI}
								alt='Adopt a Cat'
							/>
						</div>
					</Link>

					<Link
						to='/PetChecker'
						className='card-50'>
						<div className='card-50'>
							<img
								src={dogAI}
								alt='Adopt a Cat'
							/>
						</div>
					</Link>

					<Link
						to='/PetPricePredictor'
						className='card-50'>
						<div className='card-50'>
							<img
								src={dAI}
								alt='Adopt a Cat'
							/>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AIHomePage;
