// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDo2zCTvPv1KcU6mSs_CMcCgDxreiTWS_4",
  authDomain: "impact-area-manager.firebaseapp.com",
  projectId: "impact-area-manager",
  storageBucket: "impact-area-manager.firebasestorage.app",
  messagingSenderId: "96447108170",
  appId: "1:96447108170:web:dc23f3b3695d5bdabfc2b3",
  measurementId: "G-XFM94MYRKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
