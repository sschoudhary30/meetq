import { db } from '../firebase';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';

export const acceptFriendRequest = async (friendshipId, userId1, userId2) => {
  try {
    const friendshipDoc = doc(db, "friendships", friendshipId);
    await updateDoc(friendshipDoc, { status: "accepted" });

    const user1Doc = doc(db, "users", userId1);
    const user2Doc = doc(db, "users", userId2);

    await updateDoc(user1Doc, { friends: arrayUnion(userId2) });
    await updateDoc(user2Doc, { friends: arrayUnion(userId1) });

    console.log("Friend request accepted!");
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

export const rejectFriendRequest = async (friendshipId) => {
  try {
    const friendshipDoc = doc(db, "friendships", friendshipId);
    await updateDoc(friendshipDoc, { status: "rejected" });
    console.log("Friend request rejected!");
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};

export const getSuggestedFriends = async (currentUserId, currentUserFriends) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("friends", "array-contains", currentUserId));
    const snapshot = await getDocs(q);

    let suggestedFriends = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      if (!currentUserFriends.includes(doc.id) && doc.id !== currentUserId) {
        suggestedFriends.push({ id: doc.id, ...userData });
      }
    });

    return suggestedFriends;
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
  }
};

export const sendFriendRequest = async (userId1, userId2) => {
  try {
    await addDoc(collection(db, "friendships"), {
      user1: userId1,
      user2: userId2,
      status: "pending",
      createdAt: Timestamp.now(),
    });
    console.log("Friend request sent!");
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};
