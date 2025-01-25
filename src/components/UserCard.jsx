
import React from "react";
import homeIcon from "../img/Home.svg";
import profileIcon from "../img/User.svg";
import messagesIcon from "../img/Send.svg";
import notificationsIcon from "../img/Notification.svg";
import "./UserCard.css";

const UserCard = ({ userData, selectedSection, setSelectedSection }) => {
  return (
    <div className="user-card">
      <div className="profile-banner">
        <img
          src={
            userData.banner ||
            "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg"
          }
          alt="Banner"
          className="banner-img"
        />
      </div>
      <div className="profile-pic-usercard">
        <img
          src={
            userData.profilePic ||
            "https://tse2.mm.bing.net/th?id=OIP.HUhqiJIodGs4eAqZOYsTbAHaE7&pid=Api&P=0&h=180"
          }
          alt="User Profile"
        />
      </div>
      <div className="user-details">
        <h3>{userData.name}</h3>
        <p className="bio">{userData.bio || "No bio available"}</p>
      </div>
      <div className="user-icons">
        <div
          className={`icon-item ${selectedSection === "home" ? "selected" : ""}`}
          onClick={() => setSelectedSection("home")}
        >
          <img src={homeIcon} alt="Home" style={{ width: "20px", marginRight: "8px" }} /> Home
        </div>
        <hr className={`divider ${selectedSection === "home" ? "selected" : ""}`} />
        
        <div
          className={`icon-item ${selectedSection === "profile" ? "selected" : ""}`}
          onClick={() => setSelectedSection("profile")}
        >
          <img src={profileIcon} alt="Profile" style={{ width: "20px", marginRight: "8px" }} /> Profile
        </div>
        <hr className={`divider ${selectedSection === "profile" ? "selected" : ""}`} />
        
        <div
          className={`icon-item ${selectedSection === "messages" ? "selected" : ""}`}
          onClick={() => setSelectedSection("messages")}
        >
          <img src={messagesIcon} alt="Messages" style={{ width: "20px", marginRight: "8px" }} /> Messages
        </div>
        <hr className={`divider ${selectedSection === "messages" ? "selected" : ""}`} />
        
        <div
          className={`icon-item ${selectedSection === "notifications" ? "selected" : ""}`}
          onClick={() => setSelectedSection("notifications")}
        >
          <img src={notificationsIcon} alt="Notifications" style={{ width: "20px", marginRight: "8px" }} /> Notifications
        </div>
        
      </div>
    </div>
  );
};

export default UserCard;
