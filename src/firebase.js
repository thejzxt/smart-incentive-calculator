import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeSokhWEsOZVnC8cg3q-PcbG5fk9hSOs8",
  authDomain: "smart-incentitive-calculator.firebaseapp.com",
  projectId: "smart-incentitive-calculator",
  storageBucket: "smart-incentitive-calculator.firebasestorage.app",
  messagingSenderId: "1058180822201",
  appId: "1:1058180822201:web:fe39c02f2ecbd50e0cd768",
  measurementId: "G-QVW2PNXCQ6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);