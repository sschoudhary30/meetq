import { useState } from "react";
import { addDoc, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useToast } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import useAuthStore from "../store/authStore";

export const useCreatePost = () => {
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleCreatePost = async (selectedFile, caption) => {
    if (isLoading) return;

    if (!authUser?.uid) {
      showToast({
        title: "Error",
        description: "User not authenticated",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!selectedFile) {
      showToast({
        title: "Error",
        description: "Please select an image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    const newPost = {
      caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
    };

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "dwyvzy6z");
      formData.append("folder", "feed");

      const response = await fetch("https://api.cloudinary.com/v1_1/dmshtfcw2/image/upload", {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await response.json();
      const imageURL = cloudinaryData.secure_url;

      await updateDoc(postDocRef, { imageURL });

      const userDocRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

      showToast({
        title: "Success",
        description: "Post created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      showToast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
};

