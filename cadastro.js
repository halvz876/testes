import { db, auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Cadastro.js carregado com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("form-cadastro");

  if (!formCadastro) {
    console.error("Erro: O formulário 'form-cadastro' não foi encontrado!");
    return;
  }

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("cad-nome").value.trim();
    const email = document.getElementById("cad-email").value.trim();
    const senha = document.getElementById("cad-senha").value;
    const nivel = document.getElementById("cad-nivel").value;

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Salva os dados na coleção "usuarios" usando o UID do Auth como ID do documento
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        nivel: nivel, // Salva "usuario", "adm1" ou "adm2"
        criadoEm: new Date().toISOString()
      });

      alert("Conta criada com sucesso! Faça login para continuar.");
      
      // Redireciona para a tela de login
      window.location.href = "index.html";

    } catch (error) {
      console.error("Erro ao cadastrar:", error.code, error.message);
      alert("Erro ao cadastrar: " + error.message);
    }
  });
});