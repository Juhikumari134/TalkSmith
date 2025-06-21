// client.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Correct SDK for browser

const firebaseConfig = {
  apiKey: "AIzaSyDhAgoxGpHo2Xk84uaT9owkHbohCei3gw4",
  authDomain: "talksmith-52998.firebaseapp.com",
  projectId: "talksmith-52998",
  storageBucket: "talksmith-52998.appspot.com", // ✅ fixed typo: .app → .app**spot**.com
  messagingSenderId: "873685438792",
  appId: "1:873685438792:web:c03a1bc5046dc80db6637d",
  measurementId: "G-FMRL5H2LQ5",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);
