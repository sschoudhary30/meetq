import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { useToast } from "@chakra-ui/react";

const useSavePost = (post) => {
  const [isSaving, setIsSaving] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const toast = useToast();

  const handleSavePost = async () => {
    if (!authUser) {
      //console.error("User not logged in.");
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userDocRef, {
        savedPosts: arrayUnion(post.id),
      });

      toast({
        title: "Post Saved",
        description: "The post has been saved to your profile.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSavePost, isSaving };
};

export default useSavePost;


