// src/components/Community/Community.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Post from "./Post";
import "./Community.css";

const Community = ({ currentUserAvatar }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);


  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/community/posts");
      setPosts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPost);
    if (image) {
      formData.append("image", image); // ⬅️ attach the image if selected
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/community/posts",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts([response.data.post, ...posts]);
      setNewPost("");
      setImage(null);
      setSuccess("Post added successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding post");
      setSuccess("");
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <div className="Community">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* سكشن إضافة بوست جديد */}
      <div className="add-post">
        {currentUserAvatar ? (
          <img
            src={currentUserAvatar}
            alt="Current user's avatar"
            className="current-user-avatar"
          />
        ) : (
          <div className="current-user-avatar-icon">
            
            <Link to='/Profile'><FaUser /></Link>
          </div>
        )}
        <div className="add-post-input-container">
          <textarea
            placeholder="Add Post"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="image-upload-container">
  <label htmlFor="file-upload" className="custom-upload-button">
    📷 Add Photo
  </label>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
    className="hidden-file-input"
  />
  {/* {image && <p className="selected-image-name">The Photo : {image.name}</p>}
  <img src={URL.createObjectURL(image)} alt="" style={{ maxWidth: "150px", marginTop: "10px" }} /> */}
</div>

          <FaPaperPlane className="post-icon" onClick={handlePostSubmit} />
        </div>
      </div>

      {/* عرض البوستات */}
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to share your experience!</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            currentUserAvatar={currentUserAvatar}
            onPostUpdate={handlePostUpdate}
          />
        ))
      )}
    </div>
  );
};

export default Community;