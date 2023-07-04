import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEk-atmGRQhiiC-fGXQ6gKon4mSKJfoNY",
  authDomain: "sveltree.firebaseapp.com",
  projectId: "sveltree",
  storageBucket: "sveltree.appspot.com",
  messagingSenderId: "1069739125701",
  appId: "1:1069739125701:web:8b9270b03b3b0518d7f9ac",
  measurementId: "G-K0YJBJQ9MW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();