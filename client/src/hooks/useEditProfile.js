import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
//import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

	const showToast = useShowToast();

	const cloud_api_secret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

	const editProfile = async (inputs, selectedFile) => {
		if (isUpdating || !authUser) return;
		setIsUpdating(true);

		//for firebase storage
		//const storageRef = ref(storage, `profilePics/${authUser.uid}`);
		const userDocRef = doc(firestore, "users", authUser.uid);
		

		let URL = "";
		let id = "";
		try {
			if (selectedFile) {
				//delete old image, if any
				// Fetch the document snapshot
				const userDocSnap = await getDoc(userDocRef);
				if (userDocSnap.exists()) {
				  // Get the data from the document
				  const userData = userDocSnap.data();
			
				  // Check if the 'profilePicURL' field is empty or undefined
				  if (userData.profilePicURL || !userData.profilePicURL.trim() === "") {
					//delete image from cloudinary
					try{
					const arrayUrl = userData.profilePicURL.split('/');
					const publicId = `profile_images/${arrayUrl[arrayUrl.length - 1].split('.')[0]}`
					const response = await fetch(`http://localhost:3000/delete-image/${userData.username}`, {
						method: "POST",
						headers: {
						  "Content-Type": "application/json",
						},
						body: JSON.stringify({ publicId }),
					  });
				  
					  const data = await response.json();
					  if (data.success) {
						// this is for firestore
						// await uploadString(storageRef, selectedFile, "data_url");
						// using cloudinary
						const i = new FormData()
						i.append("file", selectedFile)
						i.append("upload_preset", "dwyvzy6z")
						i.append("folder", "profile_images")
				
						const response = await fetch(
							"https://api.cloudinary.com/v1_1/dmshtfcw2/image/upload",
							{
								method: "post",
								body: i
							}
						)
						//firebase storage
						//URL = await getDownloadURL(ref(storage, `profilePics/${authUser.uid}`));
						//using cloudinary
						URL = (await response.json()).secure_url;
					  	} else {
							throw data.error;
					  }
					} catch (error) {
						showToast("Error", error.message, "error");
					}
				}
			}
		}

			const updatedUser = {
				...authUser,
				fullName: inputs.fullName || authUser.fullName,
				username: inputs.username || authUser.username,
				bio: inputs.bio || authUser.bio,
				profilePicURL: URL || authUser.profilePicURL,
			};

			await updateDoc(userDocRef, updatedUser);
			localStorage.setItem("user-info", JSON.stringify(updatedUser));
			setAuthUser(updatedUser);
			setUserProfile(updatedUser);
			showToast("Success", "Profile updated successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { editProfile, isUpdating };
};

export default useEditProfile;
