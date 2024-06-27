import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  collection,
  orderBy,
  where,
  setDoc,
  query,
  addDoc,
  runTransaction,
  doc,
  getDoc,
  firestore,
  updateDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter,
  arrayUnion,
  


} from "firebase/firestore";
import {getStorage, uploadBytes,ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
// import { AppRegistry } from 'react-native';
// import App from './App.js';
// import { name as appName } from './app.json';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA689XXkcCzM-Q4GTSNrHbI9e13-9XKHoA",
    authDomain: "selfcheckinapps.firebaseapp.com",
    databaseURL: "https://selfcheckinapps-default-rtdb.firebaseio.com",
    projectId: "selfcheckinapps",
    storageBucket: "selfcheckinapps.appspot.com",
    messagingSenderId: "861079724058",
    appId: "1:861079724058:web:fcbd3d5fb16938e6a6f1a3"
  };
  
// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

// AppRegistry.registerComponent(appName, () => App);

export {
  where,
  doc,
  updateDoc,
  getDoc,
  db,
  orderBy,
  runTransaction,
  query,
  storage,
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  getDocs,
  setDoc,
  limit,
  startAfter,
  arrayUnion,
  getDownloadURL,
  uploadBytes,
  ref
}