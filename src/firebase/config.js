// Firebase configuration for client-side
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyA_c0ddL_e5GCqHEcDT8usbKByEQVpAmYw",
  authDomain: "csot-chat-ui.firebaseapp.com",
  projectId: "csot-chat-ui",
  storageBucket: "csot-chat-ui.firebasestorage.app",
  messagingSenderId: "1094527917272",
  appId: "1:1094527917272:web:791639de77021619aacbad",
  measurementId: "G-5SWGLQFY9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
