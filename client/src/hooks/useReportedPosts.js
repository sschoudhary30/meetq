import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useReportedPosts = () => {
  const [reportedPostIds, setReportedPostIds] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const reportsQuery = query(collection(firestore, "reports"));
        const reportsSnapshot = await getDocs(reportsQuery);

        const reportedIds = reportsSnapshot.docs.map((doc) => doc.data().postId);

        console.log("Reported Post IDs:", reportedIds);

        setReportedPostIds(reportedIds);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  return { reportedPostIds, isLoading };
};

export default useReportedPosts;

