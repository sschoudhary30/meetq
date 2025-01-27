import React, { useState } from "react";
import { FaEllipsisH, FaCommentAlt, FaHeart, FaSave, FaFlag } from "react-icons/fa";
import "./MyPosts.css";

const MyPosts = ({ posts, onSavePost, onLikeClick }) => {
  const [savedMessage, setSavedMessage] = useState({}); 
  const [menuOpen, setMenuOpen] = useState({});


  const handleMenuClick = (action, post) => {
    if (action === "save") {
      onSavePost(post); 
      setSavedMessage({ [post.id]: "Post saved successfully!" }); 
      setTimeout(() => setSavedMessage({}), 3000); 
    } else if (action === "report") {
      alert("Post reported.");
    }
    setMenuOpen({});
  };

  const toggleMenu = (postId) => {
    setMenuOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Timestamp not available";
    try {
      const date = timestamp.toDate();
      return date.toLocaleString();
    } catch (error) {
      console.error("Invalid timestamp:", error);
      return "Invalid timestamp";
    }
  };

  return (
    <div className="my-posts-section">
      <h4>My Posts</h4>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            {savedMessage[post.id] && (
              <div className="saved-message">{savedMessage[post.id]}</div>
            )}

            <div className="post-header">
              <div className="post-user-info">
                <img
                  src={post.userProfilePic || "/default-profile.png"}
                  alt="Profile"
                  className="profile-pic"
                />
                <div className="user-details">
                  <span className="user-name">{post.userName || "Anonymous"}</span>
                  <span className="user-username">@{post.userName || "unknown"}</span>
                </div>
              </div>
              <div className="post-options">
                <FaEllipsisH
                  className="menu-icon"
                  onClick={() => toggleMenu(post.id)}
                />
                {menuOpen[post.id] && (
                  <div className="menu-dropdown-horizontal">
                    <button
                      className="menu-button"
                      onClick={() => handleMenuClick("save", post)}
                    >
                      <FaSave className="menu-icon" /> Save
                    </button>
                    <button
                      className="menu-button"
                      onClick={() => handleMenuClick("report", post)}
                    >
                      <FaFlag className="menu-icon" /> Report
                    </button>
                  </div>
                )}
              </div>
              <span className="post-timestamp">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>

            <hr className="divider" />

            <div className="post-content">{post.content}</div>
            <hr className="divider" />
            <div className="post-footer">
              <div className="comment-section">
                <FaCommentAlt className="comment-icon" />
                <span>Comment</span>
              </div>
              <div className="like-section" onClick={() => onLikeClick(post.id)}>
                <FaHeart className="like-icon" />
                <span>{post.likeCount || 0} Likes</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
};

export default MyPosts;
