import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrQTRk9JA5-kmknbFTu1j4IC6NhoOg9iU",
  authDomain: "zizi-shopping-website.firebaseapp.com",
  projectId: "zizi-shopping-website",
  storageBucket: "zizi-shopping-website.appspot.com",
  messagingSenderId: "601546966830",
  appId: "1:601546966830:web:aa0bb1f48c90754febdcbf",
  measurementId: "G-6LV136LREJ",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = app.firestore();

export { auth, db };
