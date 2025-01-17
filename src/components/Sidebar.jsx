import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Logo from "../img/Logo.svg";
import User from "../img/User.svg";

const Sidebar = ({ userData, setSelectedSection }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/register");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="user-card">
        <div className="user-details">
          <img
            src={userData.profilePic || "https://via.placeholder.com/50"}
            alt="Profile"
            className="profile-pic"
          />
          <h3>{userData.name}</h3>
        </div>
        <div className="menu">
          <div onClick={() => setSelectedSection("posts")}>Posts</div>
          <div onClick={() => setSelectedSection("friends")}>Friends</div>
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
