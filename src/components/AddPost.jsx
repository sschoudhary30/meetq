import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import "./AddPost.css";

const AddPost = ({ userId, userName, userProfilePic, bio, onPostAdded }) => {
  const [newPost, setNewPost] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file); 
      const reader = new FileReader();
      reader.onloadend = () => setMediaUrl(reader.result); 
      reader.readAsDataURL(file); 
    } else {
      setMedia(null); 
    }
  };

  const uploadMedia = async () => {
    if (!media) return null; 

    try {
      const storage = getStorage();
      const mediaRef = ref(storage, `media/${media.name}`); 
      await uploadBytes(mediaRef, media);
      const url = await getDownloadURL(mediaRef); 
      return url;

    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media.");
      return null; 
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim() && !media) {
      alert("Post content or media is required!");
      return;
    }

    try {
      const mediaUploadUrl = media ? await uploadMedia() : null;
      const post = {
        content: newPost,
        mediaUrl: mediaUploadUrl || "", 
        userId,
        timestamp: serverTimestamp(),
        userName,
        userProfilePic,
      };
      const postRef = await addDoc(collection(db, "posts"), post);
      onPostAdded({ ...post, id: postRef.id });

      setNewPost("");
      setMedia(null);
      setMediaUrl("");
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post. Please try again.");
    }
  };

  return (
    <div className="add-post-container">
      <div className="add-post-header">
      <div className="user-info-post">
  <img
    src={userProfilePic || "https://via.placeholder.com/50"}
    alt={`${userName}'s profile`}
    className="profile-pic-post"
  />
  <div className="user-details-post">
    <h4>{userName}</h4>
    <p className="username-post">/@{userName}</p>
    {bio && <p className="bio-post">{bio}</p>}
  </div>
</div>

        <p className="timestamp">{new Date().toLocaleString()}</p>
      </div>

      <hr className="divider" />
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="What's on your mind?"
        className="add-post-input"
      />

      {mediaUrl && <img src={mediaUrl} alt="Media preview" className="media-preview" />}

      <div className="media-button-container">
        <input
          type="file"
          accept="image/*,video/*"
          id="media-upload"
          onChange={handleMediaChange}
          style={{ display: "none" }}
        />
        <label htmlFor="media-upload" className="media-button">
          <img src={require("../img/Media.svg").default} alt="Upload Media" />
        </label>
      </div>

      <button onClick={handleAddPost} className="add-post-button">
        Add Post
      </button>
    </div>
  );
};

export default AddPost;

