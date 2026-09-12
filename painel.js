import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tabelaUsuarios = document.getElementById("tabelaUsuarios");
const totalUsuarios = document.getElementById("totalUsuarios");
const colunaAcoes = document.getElementById("colunaAcoes");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // 1. Busca os dados do usuário logado para saber seu nível
    const docUser = await getDoc(doc(db, "usuarios", user.uid));
    const dadosUser = docUser.data();

    if (dadosUser.nivel !== "adm1" && dadosUser.nivel !== "adm2") {
        alert("Acesso negado! Área restrita para administradores.");
        window.location.href = "index.html";
        return;
    }

    // Se for ADM 2, mostra a coluna de Excluir
    const ehAdm2 = dadosUser.nivel === "adm2";
    if (ehAdm2) {
        colunaAcoes.style.display = "table-cell";
    }

    // 2. Carrega todos os usuários cadastrados
    carregarUsuarios(ehAdm2);
});

async function carregarUsuarios(ehAdm2) {
    tabelaUsuarios.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    
    totalUsuarios.innerText = querySnapshot.size;

    querySnapshot.forEach((documento) => {
        const u = documento.data();
        const id = documento.id;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding: 8px;">${id}</td>
            <td style="padding: 8px;">${u.nome || 'N/A'}</td>
            <td style="padding: 8px;">${u.email}</td>
            <td style="padding: 8px;">${u.nivel}</td>
            ${ehAdm2 ? `<td style="padding: 8px;"><button class="btn-deletar" data-id="${id}" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Excluir</button></td>` : ''}
        `;

        tabelaUsuarios.appendChild(tr);
    });

    // Evento dos botões de exclusão (apenas ADM Nível 2)
    if (ehAdm2) {
        document.querySelectorAll(".btn-deletar").forEach(botao => {
            botao.addEventListener("click", async (e) => {
                const uidParaDeletar = e.target.getAttribute("data-id");

                if (confirm("Tem certeza que deseja apagar este usuário do banco de dados?")) {
                    try {
                        // Apaga o registro do banco de dados Firestore
                        await deleteDoc(doc(db, "usuarios", uidParaDeletar));
                        alert("Usuário removido do Firestore com sucesso!");
                        carregarUsuarios(true); // Recarrega a tabela
                    } catch (error) {
                        alert("Erro ao excluir: " + error.message);
                    }
                }
            });
        });
    }
}