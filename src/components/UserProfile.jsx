import React, { useState } from "react";
import AddPost from "./AddPost";
import SavedPosts from "./SavedPosts";
import Posts from "./Posts"; 
import Settings from "./Settings";
import "./UserProfile.css";

const UserProfile = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeSection, setActiveSection] = useState("addPost");

  const handlePostAdded = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const handleSavePost = (post) => {
    if (!savedPosts.some((savedPost) => savedPost.id === post.id)) {
      setSavedPosts([...savedPosts, post]);
    } else {
      alert("Post already saved.");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="user-profile-container">
      <div className="navigation">
        <button onClick={() => handleSectionChange("addPost")}>Add Post</button>
        <button onClick={() => handleSectionChange("savedPosts")}>Saved Posts</button>
        <button onClick={() => handleSectionChange("settings")}>Settings</button>
        <button onClick={() => handleSectionChange("posts")}>Posts</button>
      </div>

      <div className="section-content">
        {activeSection === "addPost" && (
          <AddPost userId={userId} onPostAdded={handlePostAdded} />
        )}
        {activeSection === "savedPosts" && <SavedPosts savedPosts={savedPosts} />}
        {activeSection === "settings" && <Settings />}
        {activeSection === "posts" && (
          <Posts posts={posts} onSavePost={handleSavePost} /> 
        )
        }
      </div>
    </div>
  );
};

export default UserProfile;
