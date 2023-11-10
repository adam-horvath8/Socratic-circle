import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYnosoPUxSwu8-U3BHaxhxJDAMqI-y35o",
  authDomain: "socraticcircle-6ba8b.firebaseapp.com",
  projectId: "socraticcircle-6ba8b",
  storageBucket: "socraticcircle-6ba8b.appspot.com",
  messagingSenderId: "466717250703",
  appId: "1:466717250703:web:c3cbfc990cf35030deccfa",
  measurementId: "G-F3B8HZHR49",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

