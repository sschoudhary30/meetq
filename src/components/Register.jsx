import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Logo from '../img/Logo.svg';
import GoogleIcon from '../img/Google.svg';
import { googleLogin } from "./SignInWithGoogle"; 
import './Signup.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!accountType || (accountType !== "personal" && accountType !== "fanpage")) {
        throw new Error("Please specify a valid account type (personal or fanpage).");
      }

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          accountType: accountType,
          photo: "",
        });
      }

      toast.success("User Registered Successfully!!", { position: "top-center" });
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      toast.error(error.message, { position: "bottom-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      <div className="signup-container">
        <div className="signup-card">
          <form onSubmit={handleRegister}>
            <input
              type="text"
              className="input-field"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              className="input-field"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              required
            >
              <option value="">Select Account Type</option>
              <option value="personal">Personal</option>
              <option value="fanpage">Fanpage</option>
            </select>
            <button
              type="submit"
              className="btn continue-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="divider">or</div>
          <button className="btn google-btn" onClick={googleLogin}> 
            <img
              src={GoogleIcon}
              alt="Google Icon"
              className="icon"
            />
            Sign Up with Google
          </button>
          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
