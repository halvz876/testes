import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("cadastroEmail").value.trim();
        const senha = document.getElementById("cadastroSenha").value;
        const nome = document.getElementById("cadastroNome").value;

        try {
            // Tenta criar o usuário no Firebase Auth (se o e-mail já existir, ele lança um erro aqui)
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Salva os dados no Firestore usando o UID único do Authentication
            await setDoc(doc(db, "usuarios", user.uid), {
                nome: nome,
                email: email,
                nivel: "usuario", // Nível padrão para novos cadastros
                criadoEm: new Date()
            });

            alert("Conta criada com sucesso!");
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erro ao cadastrar:", error);

            // Tratamento específico para e-mail já existente
            if (error.code === 'auth/email-already-in-use') {
                alert("Este e-mail já está cadastrado no sistema! Tente fazer login ou use outro e-mail.");
            } else if (error.code === 'auth/weak-password') {
                alert("A senha deve ter pelo menos 6 caracteres.");
            } else if (error.code === 'auth/invalid-email') {
                alert("O e-mail digitado é inválido.");
            } else {
                alert("Erro ao cadastrar: " + error.message);
            }
        }
    });
}