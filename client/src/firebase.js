
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homeiq-80f2a.firebaseapp.com",
  projectId: "homeiq-80f2a",
  storageBucket: "homeiq-80f2a.firebasestorage.app",
  messagingSenderId: "897726320049",
  appId: "1:897726320049:web:256e1ce681219108f4c190",
  measurementId: "G-608M5S67K5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
