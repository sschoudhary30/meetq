import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";

const useFollowUser = (userId) => {
  const authUser = useAuthStore.getState().user; 
  const updateAuthUser = useAuthStore.getState().setUser; 
  const { getFeedPosts } = usePostStore(); 

  const isFollowing = authUser.following.includes(userId);

  const handleFollowUser = async () => {
    if (!authUser) return;

    try {
      const userRef = doc(firestore, "users", authUser.uid);
      const updatedFollowing = isFollowing
        ? authUser.following.filter((id) => id !== userId)
        : [...authUser.following, userId];


      await updateDoc(userRef, { following: updatedFollowing });


      updateAuthUser({ ...authUser, following: updatedFollowing });


      getFeedPosts();
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  return { isFollowing, handleFollowUser };
};

export default useFollowUser;
