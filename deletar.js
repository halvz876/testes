import { auth, db } from "./firebase-config.js";
import { deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btnDeletar = document.getElementById("btnDeletar");

btnDeletar.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
        alert("Você precisa estar logado para excluir a conta!");
        window.location.href = "index.html";
        return;
    }

    if (confirm("Tem certeza que deseja excluir sua conta permanentemente?")) {
        try {
            // 1. Remove os dados cadastrados no Firestore
            await deleteDoc(doc(db, "usuarios", user.uid));

            // 2. Apaga o usuário do Firebase Authentication
            await deleteUser(user);

            alert("Conta excluída com sucesso!");
            window.location.href = "index.html";
        } catch (error) {
            alert("Erro ao excluir conta: " + error.message);
        }
    }
});