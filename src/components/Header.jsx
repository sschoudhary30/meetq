import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../img/Logo.svg";
import User from "../img/User.svg";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/register");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="searchbar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="user-info">
        <img src={User} alt="User Icon" className="user-icon" />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
