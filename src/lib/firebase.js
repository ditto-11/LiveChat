import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "livechat-d664a.firebaseapp.com",
  projectId: "livechat-d664a",
  storageBucket: "livechat-d664a.firebasestorage.app",
  messagingSenderId: "861926550865",
  appId: "1:861926550865:web:3e560f8580021a5fdbb770",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
