import React, { useState, useRef } from 'react';
import { FaImage, FaPaperPlane } from 'react-icons/fa';
import Post from './Post';
import './Community.css';

const Community = ({ currentUserAvatar }) => {
	// Dummy data for posts with initial state
	const [posts, setPosts] = useState([
		{
			username: 'Sara Ziad',
			avatar: 'https://via.placeholder.com/40',
			content:
				'This little creature has completely stolen my heart! From her mischievous eyes to her endless running around the little ball, or lounging in the perfect sleeping spot (preferably on my lap!), she knows how to warm my heart and make me smile every day.',
			initialLikes: 0,
			initialComments: [],
			isLiked: false, // حالة اللايك لكل بوست
		},
		{
			username: 'ZOA',
			avatar: 'https://via.placeholder.com/40',
			content:
				'This little creature has completely stolen my heart! From her mischievous eyes to her endless running around the little ball, or lounging in the perfect sleeping spot (preferably on my lap!), she knows how to warm my heart and make me smile every day.',
			initialLikes: 0,
			initialComments: [],
			isLiked: false, // حالة اللايك لكل بوست
		},
	]);

	const [newPost, setNewPost] = useState(''); // النص بتاع البوست الجديد
	const [selectedImage, setSelectedImage] = useState(null); // الصورة المرفوعة
	const fileInputRef = useRef(null); // Ref للـ input file

	const handlePostSubmit = () => {
		if (newPost.trim()) {
			setPosts([
				{
					username: 'Current User',
					avatar: currentUserAvatar,
					content: newPost,
					initialLikes: 0,
					initialComments: [],
					isLiked: false, // البوست الجديد يبدأ بدون لايك
					image: selectedImage ? URL.createObjectURL(selectedImage) : null,
				},
				...posts,
			]);
			setNewPost(''); // إفراغ الـ textarea
			setSelectedImage(null); // إعادة تعيين الصورة بعد الإضافة
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
		}
	};

	const handleLikeToggle = (index) => {
		setPosts((prevPosts) =>
			prevPosts.map((post, i) =>
				i === index
					? {
							...post,
							isLiked: !post.isLiked,
							initialLikes: post.isLiked
								? post.initialLikes - 1
								: post.initialLikes + 1,
					  }
					: post
			)
		);
	};

	return (
		<div className='Community'>
			{/* سكشن إضافة بوست جديد */}
			<div className='add-post'>
				<img
					src={currentUserAvatar}
					alt="Current user's avatar"
					className='current-user-avatar'
				/>
				<div className='add-post-input-container'>
					<textarea
						placeholder='Add Post'
						value={newPost}
						onChange={(e) => setNewPost(e.target.value)}
					/>
					<FaImage
						className='upload-image-icon'
						onClick={() => fileInputRef.current.click()}
					/>
					<FaPaperPlane
						className='post-icon'
						onClick={handlePostSubmit}
					/>
					<input
						type='file'
						accept='image/*'
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleImageUpload}
					/>
					{selectedImage && (
						<div className='image-preview'>
							<img
								src={URL.createObjectURL(selectedImage)}
								alt='Preview'
							/>
						</div>
					)}
				</div>
			</div>

			{/* عرض البوستات */}
			{posts.map((post, index) => (
				<Post
					key={index}
					username={post.username}
					avatar={post.avatar}
					content={post.content}
					initialLikes={post.initialLikes}
					isLiked={post.isLiked}
					initialComments={post.initialComments}
					currentUserAvatar={currentUserAvatar}
					onLikeToggle={() => handleLikeToggle(index)}
				/>
			))}
		</div>
	);
};

export default Community;
