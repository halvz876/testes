import { db, auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Cadastro.js carregado com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("form-cadastro"); // Altere para o ID exato do seu formulário no HTML se for diferente

  if (!formCadastro) {
    console.warn("Aviso: Formulário de cadastro não encontrado nesta página, mas o script está ativo.");
    return;
  }

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Pega os valores dos inputs do formulário (ajuste os IDs conforme o seu HTML se precisar)
    const nomeInput = document.getElementById("nome") ? document.getElementById("nome").value.trim() : "Sem nome";
    const emailInput = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value;

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, senhaInput);
      const user = userCredential.user;

      // 2. Salva os dados complementares na coleção "usuarios" do Firestore usando o UID do Auth como ID do documento
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nomeInput,
        email: emailInput,
        nivel: "usuario", // Todo novo cadastro começa como usuário comum
        criadoEm: new Date().toISOString()
      });

      alert("Conta criada e salva no banco com sucesso!");
      
      // Opcional: Redireciona para o login ou painel após cadastrar
      window.location.href = "login.html"; 

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error.code, error.message);
      alert("Erro ao cadastrar: " + error.message);
    }
  });
});