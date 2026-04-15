// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIXhRP9Vl7mzmI3aJL3XYH5yLfNVQR9Ik",
  authDomain: "quickai-a5e3b.firebaseapp.com",
  projectId: "quickai-a5e3b",
  storageBucket: "quickai-a5e3b.firebasestorage.app",
  messagingSenderId: "288429996907",
  appId: "1:288429996907:web:5a77e1844d5d43dfd32a2e",
  measurementId: "G-D3GGK8QRK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication + Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
