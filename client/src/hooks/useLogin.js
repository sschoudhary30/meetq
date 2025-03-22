import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import CryptoJS from "crypto-js";
import { useState } from "react";

const useLogin = () => {
  const showToast = useShowToast();
  const [signInWithEmailAndPassword, user, error] = useSignInWithEmailAndPassword(auth);
  const [loading, setLoading] = useState(false);
  const loginUser = useAuthStore((state) => state.loginUser);

  // Hash the password
  const hashData = (data) => {
    return CryptoJS.SHA256(data).toString();
  };

  const login = async (inputs) => {
    setLoading(true); // Ensure loading state is properly updated
    try {
      if (inputs.accountType === "fan") {
        if (!inputs.username || !inputs.password) {
          showToast("Error", "Please fill all the fields", "error");
          return;
        }

        // Sign in fan account
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
          if (docSnap.exists()) {
            localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
            loginUser(docSnap.data());
          } else {
            showToast("Error", "User data not found", "error");
          }
        } else {
          showToast("Error", "Invalid password", "error");
        }
      } else {
        if (!inputs.email || !inputs.password) {
          showToast("Error", "Please fill all the fields", "error");
          return;
        }

        // Firebase email-password sign-in
        const userCred = await signInWithEmailAndPassword(inputs.email, inputs.password);
        if (userCred) {
          const docRef = doc(firestore, "users", userCred.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
            loginUser(docSnap.data());
          } else {
            showToast("Error", "User data not found", "error");
          }
        }
      }
    } catch (err) {
      showToast("Error", err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};

export default useLogin;