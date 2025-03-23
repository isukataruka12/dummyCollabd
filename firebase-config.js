// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmO2yXvIwHq8nP78qKr_aO8A92I-orIVo",
  authDomain: "collabd-ce35e.firebaseapp.com",
  databaseURL: "https://collabd-ce35e-default-rtdb.firebaseio.com",
  projectId: "collabd-ce35e",
  storageBucket: "collabd-ce35e.firebasestorage.app",
  messagingSenderId: "680036639038",
  appId: "1:680036639038:web:b71c426fc93b4deb58cc6f",
  measurementId: "G-JH71SGEE29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, auth, database, analytics, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, ref, set, get, child };