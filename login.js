import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 1. LOGIN NORMAL + REDIRECIONAMENTO DE ADM
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // trim() remove espaços acidentais antes ou depois do e-mail
        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        try {
            // Tenta fazer login
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Busca os dados do usuário no Firestore
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dados = docSnap.data();
                
                // Redirecionamento por Nível
                if (dados.nivel === "adm1" || dados.nivel === "adm2") {
                    alert("Bem-vindo ao Painel Administrativo!");
                    window.location.href = "painel.html";
                } else {
                    alert("Login realizado com sucesso!");
                    window.location.href = "index.html";
                }
            } else {
                window.location.href = "index.html";
            }

        } catch (error) {
            console.error("Erro detalhado do Firebase:", error);
            
            // Tratamento de erros comuns
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert("E-mail ou senha incorretos! Verifique se digitou a senha 'lula2026' corretamente.");
            } else if (error.code === 'auth/too-many-requests') {
                alert("Muitas tentativas sem sucesso. Aguarde alguns minutos e tente novamente.");
            } else {
                alert("Erro ao fazer login: " + error.message);
            }
        }
    });
}

// 2. MOSTRAR / ESCONDER CAIXA DE EXCLUSÃO DE CONTA
const btnAbrirDeletar = document.getElementById("btnAbrirDeletar");
const boxDeletar = document.getElementById("boxDeletar");

if (btnAbrirDeletar) {
    btnAbrirDeletar.addEventListener("click", () => {
        boxDeletar.style.display = (boxDeletar.style.display === "none" || boxDeletar.style.display === "") ? "block" : "none";
    });
}

// 3. APAGAR A PRÓPRIA CONTA
const btnConfirmarDeletar = document.getElementById("btnConfirmarDeletar");

if (btnConfirmarDeletar) {
    btnConfirmarDeletar.addEventListener("click", async () => {
        const email = document.getElementById("deletarEmail").value.trim();
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