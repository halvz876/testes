import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tabelaUsuarios = document.getElementById("tabelaUsuarios");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // Busca o nível do usuário logado
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    let nivelUsuarioLogado = "usuario";
    if (docSnap.exists()) {
        const dados = docSnap.data();
        nivelUsuarioLogado = dados.nivel || dados.nível || "usuario";
    }

    // Se não for admin, volta pro login
    if (nivelUsuarioLogado !== "adm1" && nivelUsuarioLogado !== "adm2") {
        alert("Acesso restrito a administradores.");
        window.location.href = "index.html";
        return;
    }

    carregarUsuarios(nivelUsuarioLogado);
});

async function carregarUsuarios(nivelLogado) {
    if (!tabelaUsuarios) return;
    tabelaUsuarios.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "usuarios"));
    
    querySnapshot.forEach((documento) => {
        const usuario = documento.data();
        const id = documento.id;
        const nome = usuario.nome || "Sem Nome";
        const email = usuario.email || "Sem E-mail";
        const nivel = usuario.nivel || usuario.nível || "usuario";

        const tr = document.createElement("tr");

        // Botão de excluir habilitado apenas para ADM2
        const podeExcluir = nivelLogado === "adm2";
        const btnHtml = podeExcluir 
            ? `<button class="btn-excluir" onclick="deletarUsuario('${id}')">confirmar 🗑️</button>`
            : `<button class="btn-excluir" disabled title="Apenas ADM 2 pode excluir">confirmar 🗑️</button>`;

        tr.innerHTML = `
            <td>${nome}</td>
            <td>${email}</td>
            <td>${nivel}</td>
            <td>${btnHtml}</td>
        `;

        tabelaUsuarios.appendChild(tr);
    });
}

// Função para deletar (quando for ADM2)
window.deletarUsuario = async (id) => {
    if (confirm("Deseja realmente excluir este usuário?")) {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            alert("Usuário excluído com sucesso!");
            location.reload();
        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        }
    }
};