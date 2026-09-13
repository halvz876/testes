import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnCadastrar = document.getElementById("btnCadastrar");
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");
    const inputSenha = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");

    // 1. Lógica do Olhinho
    if (toggleSenha && inputSenha) {
        toggleSenha.addEventListener("click", () => {
            const tipo = inputSenha.getAttribute("type") === "password" ? "text" : "password";
            inputSenha.setAttribute("type", tipo);
            toggleSenha.textContent = tipo === "password" ? "👁️" : "🙈";
        });
    }

    // 2. Lógica do Botão Cadastrar
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", async (e) => {
            e.preventDefault();
            const nome = inputNome.value.trim();
            const email = inputEmail.value.trim();
            const senha = inputSenha.value;

            if (!nome || !email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            try {
                const credencial = await createUserWithEmailAndPassword(auth, email, senha);
                const user = credencial.user;

                // Salva o usuário no Firestore (Nível padrão: usuario)
                await setDoc(doc(db, "usuarios", user.uid), {
                    nome: nome,
                    email: email,
                    nivel: "usuario"
                });

                alert("Conta criada com sucesso!");
                window.location.href = "index.html";
            } catch (error) {
                console.error("Erro no cadastro:", error);
                alert("Erro ao cadastrar: " + error.message);
            }
        });
    }
});