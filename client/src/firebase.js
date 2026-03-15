import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmEdNfPTDXLSE4bSP5VbxjzgWWUmq33t8", // Use yours!
  authDomain: "queue-system-88f09.firebaseapp.com",
  projectId: "queue-system-88f09",
  storageBucket: "queue-system-88f09.firebasestorage.app",
  messagingSenderId: "1044486820732",
  appId: "1:1044486820732:web:38129f3c45a7df38174af9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
