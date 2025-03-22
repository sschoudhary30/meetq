
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export const storeNsfwResultsInReport = async (postId, nsfwScores) => {
  try {
    const reportDocRef = doc(firestore, "reports", postId);

    // Update the report document with NSFW scores
    await updateDoc(reportDocRef, {
      nsfwScores: nsfwScores, 
    });

    console.log("NSFW scores saved successfully!");
  } catch (error) {
    console.error("Error saving NSFW scores:", error);
  }
};
