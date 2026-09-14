import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Aguarda o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("form-cadastro");

  if (!formCadastro) return;

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura os valores dos campos do formulário
    const nomeInput = document.getElementById("cad-nome");
    const emailInput = document.getElementById("cad-email");
    const senhaInput = document.getElementById("cad-senha");
    const nivelSelect = document.getElementById("cad-nivel"); // Caso tenha um select, ou define dinamicamente

    const nome = nomeInput ? nomeInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value : "";
    
    // Define o nível de acesso baseado no e-mail ou no campo selecionado
    let nivel = nivelSelect ? nivelSelect.value : "usuario";
    
    const emailLower = email.toLowerCase();
    if (emailLower === "halvz876@gmail.com" || emailLower === "havz876@gmail.com") {
      nivel = "adm2";
    } else if (emailLower === "henriquealvesribeiro882@gmail.com") {
      nivel = "adm1";
    }

    if (!email || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // 1. Cria a conta no Firebase Authentication (Login/Senha)
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Cria o documento correspondente na coleção "usuarios" do Firestore usando o UID
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome || email.split("@")[0],
        email: email,
        nivel: nivel,
        criadoEm: new Date().toISOString()
      });

      // 3. Sincroniza também no localStorage (garantia local)
      salvarNoLocalStorage({ id: user.uid, nome: nome || email.split("@")[0], email, nivel });

      alert("Usuário cadastrado com sucesso no Firebase e no Firestore!");
      window.location.href = "./login.html"; // Redireciona para a tela de login

    } catch (error) {
      console.warn("Erro ao cadastrar no Firebase (usando salvamento local):", error);

      // Tratamento de erros comuns do Firebase
      if (error.code === "auth/email-already-in-use") {
        alert("Este e-mail já está em uso.");
        return;
      } else if (error.code === "auth/weak-password") {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      // Fallback: Se o Firebase falhar ou estiver offline, salva localmente
      const idLocal = "user_" + Date.now();
      salvarNoLocalStorage({ id: idLocal, nome: nome || email.split("@")[0], email, nivel });

      alert("Cadastro realizado localmente com sucesso!");
      window.location.href = "./login.html";
    }
  });
});

// Função auxiliar para manter a lista do localStorage atualizada
function salvarNoLocalStorage(novoUsuario) {
  const armazenados = localStorage.getItem("app_users");
  let lista = armazenados ? JSON.parse(armazenados) : [];

  // Remove duplicados se já existir o mesmo e-mail
  lista = lista.filter(u => u.email !== novoUsuario.email);
  lista.push(novoUsuario);

  localStorage.setItem("app_users", JSON.stringify(lista));
}