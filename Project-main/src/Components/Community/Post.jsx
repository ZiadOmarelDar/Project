import React, { useState, useRef } from 'react';
import {
	FaHeart,
	FaRegHeart,
	FaRegComment,
	FaImage,
	FaPaperPlane,
} from 'react-icons/fa';
import './Post.css';

const Post = ({
	username,
	avatar,
	content,
	initialLikes,
	isLiked,
	initialComments,
	currentUserAvatar,
	onLikeToggle,
}) => {
	const [comments, setComments] = useState(initialComments); // قايمة التعليقات
	const [showComments, setShowComments] = useState(false); // حالة إظهار كل التعليقات
	const [comment, setComment] = useState(''); // التعليق الجديد
	const [selectedCommentImage, setSelectedCommentImage] = useState(null); // الصورة المرفوعة مع التعليق
	const fileInputRef = useRef(null); // Ref للـ input file

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	const handleAddComment = () => {
		if (comment.trim()) {
			setComments([
				...comments,
				{
					text: comment,
					image: selectedCommentImage
						? URL.createObjectURL(selectedCommentImage)
						: null,
				},
			]);
			setComment(''); // إفراغ حقل التعليق
			setSelectedCommentImage(null); // إعادة تعيين الصورة
		}
	};

	const handleCommentImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedCommentImage(file);
		}
	};

	return (
		<div className='post'>
			{/* العنوان مع صورة المستخدم */}
			<div className='post-header'>
				<img
					src={avatar}
					alt={`${username}'s avatar`}
					className='user-avatar'
				/>
				<h1 className='post-title'> {username}</h1>
			</div>

			{/* المحتوى */}
			<div className='post-content'>
				<p>{content}</p>
			</div>

			{/* الإعجابات والتعليقات */}
			<div className='post-engagement'>
				<div className='engagement-metrics'>
					<span
						className='likes-icon'
						onClick={onLikeToggle}>
						{isLiked ? <FaHeart className='liked' /> : <FaRegHeart />}
					</span>
					<span
						className='comments-icon'
						onClick={toggleComments}>
						<FaRegComment />
					</span>
				</div>
				<span className='likes-count'>{initialLikes} Likes</span>
				<br />
				<span className='comments-count'>{comments.length} comments</span>

				{/* عرض التعليقات */}
				<div className='comments-section'>
					{showComments && comments.length > 0
						? comments.map((commentObj, index) => (
								<div
									key={index}
									className='comment'>
									<p>{commentObj.text}</p>
									{commentObj.image && (
										<img
											src={commentObj.image}
											alt='Comment attachment'
											className='comment-image'
										/>
									)}
								</div>
						  ))
						: showComments && <div>No comments yet.</div>}
				</div>

				{/* حقل التعليق مع صورة المستخدم */}
				<div className='add-comment'>
					<img
						src={currentUserAvatar}
						alt="Current user's avatar"
						className='current-user-avatar'
					/>
					<div className='add-comment-input-container'>
						<input
							type='text'
							placeholder='Add a comment...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<FaImage
							className='upload-comment-image-icon'
							onClick={() => fileInputRef.current.click()}
						/>
						<FaPaperPlane
							className='comment-submit-icon'
							onClick={handleAddComment}
						/>
						<input
							type='file'
							accept='image/*'
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleCommentImageUpload}
						/>
						{selectedCommentImage && (
							<div className='comment-image-preview'>
								<img
									src={URL.createObjectURL(selectedCommentImage)}
									alt='Preview'
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
