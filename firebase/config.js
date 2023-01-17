// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaWlqC2Xj5DfzkRJ_kwPM33_wCaiczLtY",
  authDomain: "instagram-clone-c56cb.firebaseapp.com",
  projectId: "instagram-clone-c56cb",
  storageBucket: "instagram-clone-c56cb.appspot.com",
  messagingSenderId: "1047813369829",
  appId: "1:1047813369829:web:7fde08e0124c1dda5bc90c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, db };
