import React from 'react';
import './Community.css';
import { FaHeart, FaComment, FaSmile } from 'react-icons/fa';

function Community() {
	const posts = [
		{
			id: 1,
			user: 'Sara Ziad',
			text: 'This little ball of fluff has completely stolen my heart. 🐶...',
			likes: 542,
			comments: 123,
		},
		{
			id: 2,
			user: 'ZOZA',
			text: 'This little ball of fluff has completely stolen my heart. 🐶...',
			likes: 1542,
			comments: 112,
		},
	];

	return (
		<div className='posts-page'>
			<div className='add-post'>
				<img
					src='user.png'
					alt='User'
					className='profile-pic'
				/>
				<input
					type='text'
					placeholder='Add Post'
					className='post-input'
				/>
			</div>

			{posts.map((post) => (
				<div
					key={post.id}
					className='post-card'>
					<div className='post-header'>
						<img
							src='user.png'
							alt='User'
							className='profile-pic'
						/>
						<strong>{post.user}</strong>
					</div>
					<p className='post-text'>{post.text}</p>

					<div className='post-actions'>
						<FaHeart /> <FaComment />
					</div>

					<p className='likes'>{post.likes} Likes</p>
					<p className='comments'>View all {post.comments} comments</p>

					<div className='add-comment'>
						<img
							src='user.png'
							alt='User'
							className='profile-pic'
						/>
						<input
							type='text'
							placeholder='Add a comment...'
						/>
						<FaHeart className='icon' />
						<FaSmile className='icon' />
					</div>
				</div>
			))}
		</div>
	);
}

export default Community;
