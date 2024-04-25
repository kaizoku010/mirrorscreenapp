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
  messagingSenderId: "35890729930",
  appId: "1:35890729930:web:7b1796506b474b89013533"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}