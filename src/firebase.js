// client/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homeiq-5aff7.firebaseapp.com",
  projectId: "homeiq-5aff7",
  storageBucket: "homeiq-5aff7.firebasestorage.app",   
  messagingSenderId: "341810174950",
  appId: "1:341810174950:web:13072a7fd786c2010b1427"
};

export const app = initializeApp(firebaseConfig);

