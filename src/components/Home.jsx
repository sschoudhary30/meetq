import React, { useState, useEffect } from "react";
import AddPost from "./AddPost";
import MyPosts from "./MyPosts";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";

const Home = ({ handlePostAdded }) => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setLoggedInUser(userDoc.data()); 
      }
    };

    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", auth.currentUser.uid)); 
      const postDocs = await getDocs(q);
      setPosts(postDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const fetchSavedPosts = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userSavedPosts = userDoc.data()?.savedPosts || [];
      setSavedPosts(userSavedPosts);
    };

    if (auth.currentUser) {
      fetchUserData();
    }
    fetchPosts();
    fetchSavedPosts();
  }, []);

  const handleSavePost = async (post) => {
    if (!savedPosts.some((savedPost) => savedPost.id === post.id)) {
      setSavedPosts((prev) => [...prev, post]);

      const userRef = doc(db, "users", auth.currentUser.uid);
      const postData = {
        id: post.id,
        content: post.content,
        media: post.media,
      };

      try {
        await updateDoc(userRef, {
          savedPosts: arrayUnion(postData),
        });
        alert("Post saved successfully!");
      } catch (error) {
        console.error("Error saving post: ", error);
      }
    } else {
      alert("Post already saved.");
    }
  };

  const handleLikeClick = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likeCount: (post.likeCount || 0) + 1 }
          : post
      )
    );
  };

  return (
    <div className="home-section">
      {loggedInUser && (
        <AddPost 
          userId={auth.currentUser.uid} 
          userName={loggedInUser.name} 
          userProfilePic={loggedInUser.profilePic}  
          bio={loggedInUser.bio}  
          onPostAdded={handlePostAdded} 
        />
      )}

      <MyPosts posts={posts} onSavePost={handleSavePost} onLikeClick={handleLikeClick} />

      <div className="saved-posts-section">
        <h4>Saved Posts</h4>
        {savedPosts.length ? (
          savedPosts.map((post) => (
            <div key={post.id} className="saved-post-item">
              <div className="saved-post-content">{post.content}</div>
              {post.media && <img src={post.media} alt="Post media" className="saved-post-media" />}
            </div>
          ))
        ) : (
          <p>No saved posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
