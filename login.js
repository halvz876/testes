import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
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

    // 2. Lógica do Botão Login
    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault();
            const email = inputEmail.value.trim();
            const senha = inputSenha.value;

            if (!email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, senha);
                alert("Login efetuado com sucesso!");
                window.location.href = "painel.html";
            } catch (error) {
                console.error("Erro no login:", error);
                alert("Erro ao fazer login: " + error.message);
            }
        });
    }
});