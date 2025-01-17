
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDftS2hTwFTL1SOV36yhetFUrql--GZuCA",
  authDomain: "social-media-e1d1d.firebaseapp.com",
  projectId: "social-media-e1d1d",
  storageBucket: "social-media-e1d1d.firebasestorage.app",
  messagingSenderId: "306633014922",
  appId: "1:306633014922:web:c7b6c5bd32ddd18894b773"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;