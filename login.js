import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN NORMAL
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const senha = document.getElementById("loginSenha").value;

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            alert("Login realizado com sucesso!");
            window.location.href = "index.html";
        } catch (error) {
            alert("Erro ao fazer login: " + error.message);
        }
    });
}

// MOSTRAR/ESCONDER A CAIXA DE EXCLUSÃO
const btnAbrirDeletar = document.getElementById("btnAbrirDeletar");
const boxDeletar = document.getElementById("boxDeletar");

if (btnAbrirDeletar) {
    btnAbrirDeletar.addEventListener("click", () => {
        boxDeletar.style.display = (boxDeletar.style.display === "none" || boxDeletar.style.display === "") ? "block" : "none";
    });
}

// LÓGICA DE APAGAR A CONTA
const btnConfirmarDeletar = document.getElementById("btnConfirmarDeletar");

if (btnConfirmarDeletar) {
    btnConfirmarDeletar.addEventListener("click", async () => {
        const email = document.getElementById("deletarEmail").value;
        const senha = document.getElementById("deletarSenha").value;

        if (!email || !senha) {
            alert("Por favor, preencha o e-mail e a senha para confirmar.");
            return;
        }

        if (confirm("Tem certeza que deseja apagar permanentemente esta conta?")) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, senha);
                const user = userCredential.user;

                await deleteDoc(doc(db, "usuarios", user.uid));
                await deleteUser(user);

                alert("Conta excluída com sucesso!");
                window.location.reload();
            } catch (error) {
                alert("Erro ao excluir conta: " + error.message);
            }
        }
    });
}