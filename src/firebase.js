// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8bTCUstyubPWiN7uDMcFcEyPF1hHMoVU",
  authDomain: "store-9f07e.firebaseapp.com",
  projectId: "store-9f07e",
  storageBucket: "store-9f07e.appspot.com",
  messagingSenderId: "707906612139",
  appId: "1:707906612139:web:92abf2311fdeec94ad00ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;