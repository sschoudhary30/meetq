
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

const useReportPost = () => {
  const [isReporting, setIsReporting] = useState(false);
  const auth = getAuth();

  const reportPost = async (postId, imageURL, caption) => {
    setIsReporting(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      const reportData = {
        reportedBy: currentUser.uid,
        postId,
        imageURL,
        caption,
        reason: "Spam", 
        timestamp: new Date().toISOString(),
      };

      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        reported: arrayUnion(currentUser.uid),
      });

      console.log("Post reported successfully");
    } catch (error) {
      console.error("Error reporting post:", error);
    } finally {
      setIsReporting(false);
    }
  };

  return { isReporting, reportPost };
};

export default useReportPost;
