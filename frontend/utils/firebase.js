// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-2510d.firebaseapp.com",
  projectId: "cortexai-2510d",
  storageBucket: "cortexai-2510d.firebasestorage.app",
  messagingSenderId: "411442037878",
  appId: "1:411442037878:web:e17b2e775e22e01e548b57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()
export {auth,googleProvider}