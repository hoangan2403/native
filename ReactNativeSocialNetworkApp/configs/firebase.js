import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPQpDLGjh03PBI7z-5t-iCXtxqBUH-Eb4",
  authDomain: "chat-a8bfc.firebaseapp.com",
  projectId: "chat-a8bfc",
  storageBucket: "chat-a8bfc.appspot.com",
  messagingSenderId: "801318890271",
  appId: "1:801318890271:web:ba8a7b3a4c273886025e2a"
};
// initialize firebase
initializeApp(firebaseConfig);
export const database = getFirestore();
