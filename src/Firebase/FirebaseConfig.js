// src/Firebase/FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Import auth

const firebaseConfig = {
  apiKey: "AIzaSyABcdxNFpCGpnYGs7OlOBRLMHYpvLRlDVs",
  authDomain: "vk-1-73a46.firebaseapp.com",
  projectId: "vk-1-73a46",
  storageBucket: "vk-1-73a46.appspot.com",
  messagingSenderId: "1023681488676",
  appId: "1:1023681488676:web:ce0aec35949ee092fd35b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app); // 👈 Initialize auth

// Export both db and auth
export { db, auth };
