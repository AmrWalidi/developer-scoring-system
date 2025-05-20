import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmVe7apqmv-zwQ6K3k2BNQ7Zz1h4_ft1o",
  authDomain: "developer-ethics-scoring.firebaseapp.com",
  projectId: "developer-ethics-scoring",
  storageBucket: "developer-ethics-scoring.firebasestorage.app",
  messagingSenderId: "723425948033",
  appId: "1:723425948033:web:552b1026ef9462ceccf880",
  measurementId: "G-3GM2PLW2W5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, db, auth };
