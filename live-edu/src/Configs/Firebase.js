// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu5_LQzGwzpvv83yNfJwxNw3EGQHbGoB4",
  authDomain: "liveedu-5c763.firebaseapp.com",
  projectId: "liveedu-5c763",
  storageBucket: "liveedu-5c763.appspot.com",
  messagingSenderId: "983671030517",
  appId: "1:983671030517:web:925ee068dee9f489a5bbbc",
  measurementId: "G-6SBRF3T6S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Export Authentication
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();