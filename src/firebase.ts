import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1tOlADoJNH_K63gVr4kejbIRwdWaRZ9E",
  authDomain: "personal-finance-tracker-f5e6d.firebaseapp.com",
  projectId: "personal-finance-tracker-f5e6d",
  storageBucket: "personal-finance-tracker-f5e6d.firebasestorage.app",
  messagingSenderId: "173856092933",
  appId: "1:173856092933:web:cd733f3d5f4c49effebd6c",
  measurementId: "G-M22G12XX60",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
