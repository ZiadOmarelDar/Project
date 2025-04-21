// src/components/Community/Post.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaPaperPlane,
  FaUser,
} from "react-icons/fa";
import "./Post.css";

const Post = ({ post, currentUserAvatar, onPostUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = token
    ? JSON.parse(atob(token.split(".")[1])).userId
    : null;

  const handleToggleLike = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLiking(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:3001/community/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Error toggling like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        `http://localhost:3001/community/posts/${post._id}/comment`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data.post);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding comment");
    }
  };

  return (
    <div className="post">
      {error && <div className="error-message">{error}</div>}

      {/* العنوان مع صورة المستخدم */}
      <div className="post-header">
        {post.avatar ? (
          <img
            src={post.avatar}
            alt={`${post.username}'s avatar`}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-icon">
            <FaUser />
          </div>
        )}
        <h1 className="post-title">{post.username}</h1>
      </div>

      {/* المحتوى */}
      <div className="post-content">
  <p>{post.content}</p>

  {post.imageUrl && (
    <div className="post-image">
      <img
        src={post.imageUrl}
        alt="Post"
        style={{
          maxWidth: "100%",
          marginTop: "10px",
          borderRadius: "10px",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  )}
</div>


      {/* الإعجابات والتعليقات */}
      <div className="post-engagement">
        <div className="engagement-metrics">
          <span
            className="likes-container"
            onClick={handleToggleLike}
            style={{ cursor: isLiking ? "not-allowed" : "pointer" }}
          >
            {isLiking ? (
              <span>Loading...</span>
            ) : userId && post.likes.includes(userId) ? (
              <FaHeart className="liked" />
            ) : (
              <FaRegHeart />
            )}
            <span className="likes-count">{post.likes.length}</span>
          </span>
          <span
            className="comments-container"
            onClick={() => setShowComments(!showComments)}
          >
            <FaRegComment />
            <span className="comments-count">{post.comments.length}</span>
          </span>
        </div>

        {/* عرض التعليقات */}
        <div className="comments-section">
          {showComments && post.comments.length > 0 ? (
            post.comments.map((commentObj, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <span className="comment-username">{commentObj.username}</span>
                  <span className="comment-date">
                    {new Date(commentObj.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{commentObj.content}</p>
              </div>
            ))
          ) : (
            showComments && <div>No comments yet.</div>
          )}
        </div>

        {/* حقل التعليق مع صورة المستخدم */}
        <div className="add-comment">
          {currentUserAvatar ? (
            <img
              src={currentUserAvatar}
              alt="Current user's avatar"
              className="current-user-avatar"
            />
          ) : (
            <Link to='/Profile'><div className="current-user-avatar-icon">
            <FaUser />
          </div></Link>
          )}
          <div className="add-comment-input-container">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <FaPaperPlane
              className="comment-submit-icon"
              onClick={handleAddComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;