import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CryptoJS from "crypto-js";
import { useState } from "react";


const useLogin = () => {
	const showToast = useShowToast();
	const [signInWithEmailAndPassword, error] = useSignInWithEmailAndPassword(auth);
	const [loading, isLoading] = useState(false);
	const loginUser = useAuthStore((state) => state.loginUser);

	// Hash the phone number
	const hashData = (data) => {
		return CryptoJS.SHA256(data).toString();
	};

	const login = async (inputs) => {
		if (inputs.accountType === "fan") {
			if (!inputs.username || !inputs.password) {
				return showToast("Error", "Please fill all the fields", "error");
			}
			isLoading(true)
			try {
				//signin with fan cred
				const usersRef = collection(firestore, "fan_accounts");
				const q = query(usersRef, where("username", "==", inputs.username));
				const querySnapshot = await getDocs(q);
				if (querySnapshot.empty) {
					showToast("Error", "Invalid username, enter valid username", "error");
					return;
				}
				const userdata = querySnapshot.docs[0].data();
				if (userdata.password === hashData(inputs.password)) {
					const docRef = doc(firestore, "users", userdata.uid);
					const docSnap = await getDoc(docRef);
					localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
					loginUser(docSnap.data()); // Update Zustand store
				} else {
					showToast("Error", "Invalid password", "error");
				}
			} catch (error) {
				console.log(error)
				showToast("Error", error.message, "error");
			} finally{
				isLoading(false);
			}
		}
		else {
			if (!inputs.email || !inputs.password) {
				return showToast("Error", "Please fill all the fields", "error");
			}
			isLoading(true);
			try {
				const userCred = await signInWithEmailAndPassword(inputs.email, inputs.password);

				if (userCred) {
					const docRef = doc(firestore, "users", userCred.user.uid);
					const docSnap = await getDoc(docRef);
					localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
					loginUser(docSnap.data());
				}
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				isLoading(false);
			}
		}

	};

	return { loading, error, login };
};

export default useLogin;
