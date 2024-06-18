// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ_iWG0iFriM1YqJA_rKoluQ5Sir6IMCA",
  authDomain: "mirrorapp-ee00d.firebaseapp.com",
  projectId: "mirrorapp-ee00d",
  storageBucket: "mirrorapp-ee00d.appspot.com",
  messagingSenderId: "35890729930",import { initializeApp } from "firebase/app";
  import { 
    getAuth,
    createUserWithEmailAndPassword,
    initializeAuth,
    onAuthStateChanged,
    getReactNativePersistence,
    setPersistence 
  } from "firebase/auth";
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
    arrayUnion
  } from "firebase/firestore";
  import { 
    getDatabase,
    ref,
    onValue,
    orderByChild,
    child, 
    equalTo,
    push
  } from "firebase/database";
  import { AppRegistry } from 'react-native';
  import App from './App.js';
  import { name as appName } from './app.json';
  
  
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
  const database = getDatabase(app)
  
  AppRegistry.registerComponent(appName, () => App);
  
  export {
    where,
    doc,
    updateDoc,
    getDoc,
    db,
    orderBy,
    runTransaction,
    query,
    addDoc,
    serverTimestamp,
    onAuthStateChanged,
    setPersistence,
    collection,
    onSnapshot,
    getDocs,
    createUserWithEmailAndPassword,
    database,
    ref,
    onValue,
    setDoc,
    limit,
    startAfter,
    arrayUnion
  }
  appId: "1:35890729930:web:91bfcccad1d03b5d013533"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}