import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBprerudBnwBkPNSx6Y79h6n-V-N3Qkc6c",
  authDomain: "facebook-clone-v2-b3b2e.firebaseapp.com",
  projectId: "facebook-clone-v2-b3b2e",
  storageBucket: "facebook-clone-v2-b3b2e.appspot.com",
  messagingSenderId: "829241719216",
  appId: "1:829241719216:web:c018248f49b4f72389fe75",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

//init services
const db = getFirestore();

//collection reference
const colRef = collection(db, "posts");

export { db, storage, addDoc, deleteDoc, colRef, serverTimestamp, ref };
