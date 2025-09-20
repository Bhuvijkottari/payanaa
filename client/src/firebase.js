
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
apiKey: "AIzaSyDiAmjJXAeZ56nxLXBsla5LtQiTSnAWCk8",
  authDomain: "payana-ba8f6.firebaseapp.com",
  projectId: "payana-ba8f6",
  storageBucket: "payana-ba8f6.firebasestorage.app",
  messagingSenderId: "502506575751",
  appId: "1:502506575751:web:c3e17b9a974bb6a0da2522"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);