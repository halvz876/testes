import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nome: nome,
            email: email
        });

        alert("Usuário cadastrado com sucesso!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
    // Dentro do seu cadastro.js, ao salvar no Firestore:
await setDoc(doc(db, "usuarios", user.uid), {
    nome: nomeInput.value,
    email: emailInput.value,
    nivel: "user", // "user", "adm1" ou "adm2"
    criadoEm: new Date()
});
});