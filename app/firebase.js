// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQog3ZnikBJpRZ-Rrn-ZatskOpNLEHZVc",
  authDomain: "prantry-tracker.firebaseapp.com",
  projectId: "prantry-tracker",
  storageBucket: "prantry-tracker.appspot.com",
  messagingSenderId: "744414064796",
  appId: "1:744414064796:web:12b67dcdd3b699d7613d59",
  measurementId: "G-87SK8123JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const analytics = getAnalytics(app);
export{app, firestore}