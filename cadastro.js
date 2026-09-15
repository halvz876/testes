import { db, auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("form-cadastro");

  if (!formCadastro) return;

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Pega os valores dos inputs do seu HTML (suporta tanto id="cad-nome" quanto id="username")
    const nomeInput = document.getElementById("cad-nome") || document.getElementById("username");
    const emailInput = document.getElementById("cad-email") || document.getElementById("email");
    const senhaInput = document.getElementById("cad-senha") || document.getElementById("senha");
    const nivelInput = document.getElementById("cad-nivel");

    const nome = nomeInput ? nomeInput.value.trim() : "Sem nome";
    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value : "";
    const nivel = nivelInput ? nivelInput.value : "usuario"; // Padrão 'usuario' se não houver o select na tela

    try {
      // 1. Cria a conta no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Salva os dados na coleção "usuarios" do Firestore usando o UID exato do usuário
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        nivel: nivel,
        criadoEm: new Date().toISOString()
      });

      alert("Conta criada com sucesso! Faça login para continuar.");
      window.location.href = "index.html"; // Manda para a tela de login

    } catch (error) {
      console.error("Erro ao cadastrar:", error.code, error.message);
      alert("Erro ao cadastrar: " + error.message);
    }
  });
});