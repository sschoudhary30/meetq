import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useGetFeedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        //console.log("Fetching posts from followed users...");

        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, where("createdBy", "in", user.following || []));
        const snapshot = await getDocs(q);

        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //console.log("Fetched Feed Posts:", fetchedPosts);

        setPosts(fetchedPosts);
      } catch (err) {
        //console.error("Error fetching feed posts:", err);
        setError("Failed to load posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  return { posts, isLoading, error };
};

export default useGetFeedPosts;


