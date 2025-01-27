import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, limit } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { sendFriendRequest } from "./friendFunctionsTemp"; 

import "./SuggestedFriends.css";

const SuggestedFriends = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userId, setUserId] = useState(null);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null); 
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchSuggestedFriends = async () => {
        try {
          const usersCollection = collection(db, "users");
          const usersQuery = query(usersCollection, limit(5)); 
          const snapshot = await getDocs(usersQuery);

          const usersList = snapshot.docs
            .filter((doc) => doc.id !== userId) 
            .map((doc) => ({ id: doc.id, ...doc.data() })); 

          setSuggestedUsers(usersList); 
        } catch (error) {
          console.error("Error fetching suggested friends: ", error);
        } finally {
          setLoading(false); 
        }
      };

      fetchSuggestedFriends();
    }
  }, [userId]);

  const handleSendFriendRequest = async (friendId) => {
    try {
      if (!userId) {
        alert("You need to be logged in to send a friend request.");
        return;
      }
      await sendFriendRequest(userId, friendId); 
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="suggested-friends">
      <h3>Suggested Friends</h3>
      <hr className="frnd-divider" /> 

      {loading ? (
        <p>Loading suggested friends...</p> 
      ) : (
        <div className="friends-list">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div key={user.id} className="friend-card">
                <div className="friend-info">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/50"} 
                    alt={`${user.name}'s profile`}
                    className="profile-pic-suggestedf"
                  />
                  <div className="friend-details">
                    <h4>{user.name}</h4>
                    <p className="bio-suggestedf">{user.bio || "No bio available"}</p>
                  </div>
                </div>
                <button
                  className="add-friend-btn"
                  onClick={() => handleSendFriendRequest(user.id)} 
                >
                  + 
                </button>
              </div>
            ))
          ) : (
            <p>No suggested friends available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestedFriends;

