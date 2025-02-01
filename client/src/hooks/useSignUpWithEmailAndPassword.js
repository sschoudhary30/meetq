import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import CryptoJS from "crypto-js";
import { useState } from "react";

const useSignUpWithEmailAndPassword = () => {
	const [createUserWithEmailAndPassword, error] = useCreateUserWithEmailAndPassword(auth);
	const [loading, isLoading] = useState(false);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.loginUser);

	// Hash the phone number
	const hashData = (data) => {
		return CryptoJS.SHA256(data).toString();
	};

	const signup = async (inputs) => {

		try {
			if (!inputs.username || !inputs.password) {
				showToast("Error", "Please fill all the fields", "error");
				return;
			}
			// check if username already exists
			const usersRef = collection(firestore, "users");

			const q = query(usersRef, where("username", "==", inputs.username));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				showToast("Error", "Username already exists", "error");
				return;
			}

			// add user initial data
			let userDoc = {
				uid: "",
				username: inputs.username,
				fullName: "",
				bio: "",
				profilePicURL: "",
				followers: [],
				following: [],
				posts: [],
				createdAt: Date.now(),
				accountType: "",
				tagAccount: ""
			};

			if (inputs.tagAccount !== "") {
				// fan page handling
				isLoading(true);
				const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
				const fan_data = {
					username: inputs.username,
					ref: inputs.tagAccount,
					password: hashData(inputs.password),
					uid: uid
				}
				await setDoc(doc(firestore, "fan_accounts", uid), fan_data)

				const usersRefFan = collection(firestore, "users");

				const q1 = query(usersRefFan, where("username", "==", inputs.tagAccount));
				const querySnapshotFan = await getDocs(q1);
				const userdata = querySnapshotFan.docs[0].data().fullName;
				const tagUID = querySnapshotFan.docs[0].data().uid;

				userDoc.uid = uid;
				userDoc.fullName = userdata;
				userDoc.accountType = "FanPage";
				userDoc.tagAccount = tagUID;
			} else {
				// personal page handling
				isLoading(true)
				if (!inputs.fullName) {
					showToast("Error", "Please fill all the fields", "error");
					return;
				}

				const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
				if (!newUser && error) {
					showToast("Error", error.message, "error");
					return;
				}

				if (newUser) {
					// encrypt and send data
					const hashedPhoneNumber = hashData(inputs.phoneNumber);
					const hashedEmail = hashData(inputs.email);
					const salt = hashData(inputs.username);

					const special_data = {
						1: hashedPhoneNumber,
						2: hashedEmail
					}

					await setDoc(doc(firestore, "signup_data", salt), special_data);

					userDoc.uid = newUser.user.uid;
					userDoc.fullName = inputs.fullName;
					userDoc.accountType = "PersonalPage";
					userDoc.tagAccount = "";
				};
			}
			await setDoc(doc(firestore, "users", userDoc.uid), userDoc);
			localStorage.setItem("user-info", JSON.stringify(userDoc));
			loginUser(userDoc);
		} catch (error) {
			showToast("Error", error.message, "error");
		}finally{
			isLoading(false)
		}
	};

	return { loading, error, signup };
};

export default useSignUpWithEmailAndPassword;
