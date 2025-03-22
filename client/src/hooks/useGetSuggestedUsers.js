import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useGetSuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchSuggestedUsers = async () => {
      try {
        setIsLoading(true);
        const usersQuery = query(collection(firestore, "users"));
        const snapshot = await getDocs(usersQuery);

        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredUsers = usersList.filter(
          (u) => !user.following.includes(u.uid) && u.uid !== user.uid
        );

        setSuggestedUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [user.following]);

  return { suggestedUsers, isLoading };
};

export default useGetSuggestedUsers;

