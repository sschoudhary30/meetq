
import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import UserCard from "./UserCard";
import UserStats from "./UserStats";
import SuggestedFriends from "./SuggestedFriend";
import MyPosts from "./MyPosts";
import AddPost from "./AddPost";
import SavedPosts from "./SavedPosts";
import Settings from "./Settings";
import Home from "./Home"; 
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedSection, setSelectedSection] = useState("home"); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }

        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", user.uid));
        const postDocs = await getDocs(q);
        setPosts(postDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } else {
        navigate("/register");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleSavePost = (post) => {
    if (!savedPosts.some((savedPost) => savedPost.id === post.id)) {
      setSavedPosts([...savedPosts, post]);
    } else {
      alert("Post already saved.");
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <Header />
      <div className="content">
        <div className="left-sidebar">
          <UserCard userData={userData} setSelectedSection={setSelectedSection} />
        </div>
        <div className="main-content">
          {selectedSection === "home" && (
            <Home userData={userData} handlePostAdded={handlePostAdded} />
          )}
          {selectedSection === "savedposts" && <SavedPosts savedPosts={savedPosts} />}
          {selectedSection === "settings" && <Settings />}
        </div>
        <div className="right-sidebar">
          {selectedSection !== "home" && <UserStats userData={userData} posts={posts} setSelectedSection={setSelectedSection} />}
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
};

export default Profile;
