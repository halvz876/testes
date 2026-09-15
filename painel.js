import { db, auth } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("Painel.js carregado com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
  const tabelaUsuarios = document.getElementById('tabela-usuarios');

  if (!tabelaUsuarios) {
    console.error("ERRO: O elemento 'tabela-usuarios' não foi encontrado no HTML.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    let nivelAtual = 'usuario';

    if (user && user.email) {
      const emailLogado = user.email.toLowerCase().trim();

      if (emailLogado === 'halvz876@gmail.com' || emailLogado === 'havz876@gmail.com' || emailLogado === 'halvz86@gmail.com') {
        nivelAtual = 'adm2';
      } else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
        nivelAtual = 'adm1';
      }
    }

    await carregarFirestore(nivelAtual, tabelaUsuarios);
  });
});

async function carregarFirestore(nivelAtual, tabelaUsuarios) {
  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #a0aec0;">Buscando dados no Firebase...</td></tr>';

  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    tabelaUsuarios.innerHTML = '';

    if (querySnapshot.empty) {
      tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #a0aec0;">Nenhum usuário cadastrado no banco.</td></tr>';
      return;
    }

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      const id = documento.id;

      const nome = data.nome || data.Nome || data.username || 'Sem nome';
      const email = data.email || data.Email || 'Sem e-mail';
      const nivelDoc = data.nivel || data.Nivel || 'usuario';

      const tr = document.createElement('tr');
      const podeDeletar = (nivelAtual === 'adm2');

      tr.innerHTML = `
        <td><strong>${nome}</strong></td>
        <td>${email}</td>
        <td><span class="badge-nivel badge-${nivelDoc}">${nivelDoc}</span></td>
        <td>
          <button class="btn-excluir" ${!podeDeletar ? 'disabled style="opacity:0.3; cursor:not-allowed;" title="Apenas ADM nível 2 pode excluir"' : ''}>
            confirmar <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      // Vincula o evento de clique no botão de excluir de cada linha
      const btnExcluir = tr.querySelector('.btn-excluir');
      if (podeDeletar && btnExcluir) {
        btnExcluir.addEventListener('click', () => deletarNoFirestore(id, nome, tr));
      }

      tabelaUsuarios.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro ao carregar Firestore:", error);
    tabelaUsuarios.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">
      Erro ao carregar dados do Firebase.<br><small style="color: #a0aec0;">${error.message}</small>
    </td></tr>`;
  }
}

async function deletarNoFirestore(id, nome, linhaDaTabela) {
  const confirmacao = confirm(`Deseja excluir "${nome}" permanentemente do banco?`);
  if (!confirmacao) return;

  try {
    // Apaga de verdade o documento do Firestore usando o ID do documento
    await deleteDoc(doc(db, "usuarios", id));
    
    // Remove a linha da tabela instantaneamente da tela
    linhaDaTabela.remove();
    
    alert(`Usuário "${nome}" excluído com sucesso do banco!`);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao excluir documento do banco.");
  }
}