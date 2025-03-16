import React from 'react';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
	return (
		<div className='search-bar'>
			<div className='search-icon'>
				<FaSearch style={{ color: 'white' }} />
			</div>
			<input
				type='text'
				placeholder='Search For Product'
				className='search-input'
			/>
		</div>
	);
};

export default SearchBar;
