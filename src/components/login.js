import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { googleLogin } from "./SignInWithGoogle";  
import Logo from '../img/Logo.svg';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields", {
        position: "top-center",
      });
      return;
    }

    try {
      toast.loading("Logging in...", { position: "top-center" });
      await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss(); 
      toast.success("User logged in successfully", {
        position: "top-center",
      });

      window.location.href = "/profile";
    } catch (error) {
      toast.dismiss(); 
      console.log(error.message);
      toast.error("Login failed. Please check your credentials.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <div className="login-card">

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="input-field"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn submit-btn">
              Submit
            </button>
          </div>
        </form>

        <p className="forgot-password">
          New user? <a href="/register">Register Here</a>
        </p>
        <button 
          className="btn google-btn" 
          onClick={googleLogin} 
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
