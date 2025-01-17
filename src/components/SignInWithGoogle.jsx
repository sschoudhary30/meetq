import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";

export function googleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "", // Empty last name
        });
        console.log("New user document created");
      }

      toast.success("User logged in successfully", {
        position: "top-center",
      });

      window.location.href = "/profile"; 
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error.message);
      toast.error("Failed to sign in with Google. Please try again.", {
        position: "top-center",
      });
    });
}
