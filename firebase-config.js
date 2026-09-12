import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgTyyPHmDKoeiASGh986VboKoQ9EQNn38",
    authDomain: "bancodedados-6a371.firebaseapp.com",
    projectId: "bancodedados-6a371",
    storageBucket: "bancodedados-6a371.firebasestorage.app",
    messagingSenderId: "982595529125",
    appId: "1:982595529125:web:cb819182abea81a94da04c",
    measurementId: "G-0GWC6KWSGW"
};

// Inicialização
const app = initializeApp(firebaseConfig);

// Exportação das instâncias (apenas UMA declaração para cada)
export const auth = getAuth(app);
export const db = getFirestore(app);