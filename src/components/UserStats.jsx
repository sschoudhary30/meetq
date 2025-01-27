import React from "react";
import "./UserStats.css";

const UserStats = ({ userData, posts, onSectionChange }) => {
  return (
    <div className="user-stats">
      <div className="user-info-stats">
        <img
          src={userData.profilePic || "https://via.placeholder.com/50"}
          alt={`${userData.name}'s profile`}
          className="profile-pic-stats"
        />
        <div className="user-details">
          <h4>{userData.name}</h4>
          <p className="username">@{userData.username}</p>
        </div>
        <div className="user-stats-box">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-title">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.followers || 0}</span>
              <span className="stat-title">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.following || 0}</span>
              <span className="stat-title">Following</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider-stat" />

      <div className="links-stats">
        <p onClick={() => onSectionChange("myPosts")}>My Posts</p>
        <p onClick={() => onSectionChange("savedPosts")}>Saved Posts</p>
        <p>Settings</p>
      </div>
    </div>
  );
};

export default UserStats;
