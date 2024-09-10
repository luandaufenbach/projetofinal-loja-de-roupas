// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEVc7bm_lRL59BbLFRE2ZiazP5Ca9-SUk",
  authDomain: "projetotcc-edb50.firebaseapp.com",
  projectId: "projetotcc-edb50",
  storageBucket: "projetotcc-edb50.appspot.com",
  messagingSenderId: "590706809211",
  appId: "1:590706809211:web:f2d5fa1dd75a84caf0c5de"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const storage = getStore(app);

export {app, db, auth, storage, ref, gerDownloadURL};