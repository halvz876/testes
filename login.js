import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN NORMAL COM REDIRECIONAMENTO POR NÍVEL
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        try {
            // 1. Autentica o usuário no Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // 2. Consulta o nível do usuário no Firestore
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dados = docSnap.data();
                
                // 3. Se for ADM 1 ou ADM 2, manda direto pro Painel
                if (dados.nivel === "adm1" || dados.nivel === "adm2") {
                    alert("Bem-vindo ao Painel Administrativo!");
                    window.location.href = "painel.html";
                } else {
                    alert("Login realizado com sucesso!");
                    window.location.href = "index.html";
                }
            } else {
                // Caso a conta exista no Auth mas ainda não tenha registro no Firestore
                alert("Login realizado!");
                window.location.href = "index.html";
            }

        } catch (error) {
            alert("Erro ao fazer login: " + error.message);
        }
    });
}