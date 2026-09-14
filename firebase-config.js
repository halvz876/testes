// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgTyyPHmDKoeiASGh986VboKoQ9EQNn38",
  authDomain: "bancodedados-6a371.firebaseapp.com",
  projectId: "bancodedados-6a371",
  storageBucket: "bancodedados-6a371.firebasestorage.app",
  messagingSenderId: "982595529125",
  appId: "1:982595529125:web:cb819182abea81a94da04c",
  measurementId: "G-0GWC6KWSGW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportações essenciais para o seu painel e cadastro funcionarem:
export const auth = getAuth(app);
export const db = getFirestore(app);