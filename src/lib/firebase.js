// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth } from "firebase/auth";
//import firestore
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgdVKH74jN751WXkMinfnDgNPx33tvkDQ",
  authDomain: "budgetlabs-39188.firebaseapp.com",
  projectId: "budgetlabs-39188",
  storageBucket: "budgetlabs-39188.appspot.com",
  messagingSenderId: "864791339728",
  appId: "1:864791339728:web:db41f3759d58a839c634d5",
  measurementId: "G-RGLV787CMN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
auth.setPersistence(browserLocalPersistence);
export const db = getFirestore();
