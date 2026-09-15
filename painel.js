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

    // Atualiza ou cria o contador de usuários totais no topo da tabela
    atualizarContadorUsuarios(querySnapshot.size);

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

      const btnExcluir = tr.querySelector('.btn-excluir');
      if (podeDeletar && btnExcluir) {
        btnExcluir.addEventListener('click', () => deletarNoFirestore(id, nome, tr, querySnapshot.size));
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

function atualizarContadorUsuarios(total) {
  let contadorEl = document.getElementById('contador-usuarios');
  
  // Se o elemento ainda não existe no HTML, cria ele automaticamente acima da tabela
  if (!contadorEl) {
    const containerTitulo = document.querySelector('.planilha-usuarios, h2, .card') || document.body;
    contadorEl = document.createElement('div');
    contadorEl.id = 'contador-usuarios';
    contadorEl.style.cssText = 'margin-bottom: 15px; font-size: 15px; color: #cbd5e1; font-weight: 500;';
    
    const tituloTabela = document.querySelector('h2') || document.querySelector('h1');
    if (tituloTabela) {
      tituloTabela.insertAdjacentElement('afterend', contadorEl);
    } else {
      document.body.prepend(contadorEl);
    }
  }

  contadorEl.innerHTML = `<i class="fa-solid fa-users"></i> Total de usuários cadastrados: <strong style="color: #38bdf8;">${total}</strong>`;
}

async function deletarNoFirestore(id, nome, linhaDaTabela, totalAtual) {
  const confirmacao = confirm(`Deseja excluir "${nome}" permanentemente do banco?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    linhaDaTabela.remove();
    
    // Atualiza o contador subtraindo 1 na hora
    atualizarContadorUsuarios(totalAtual - 1);
    
    alert(`Usuário "${nome}" excluído com sucesso do banco!`);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao excluir documento do banco.");
  }
}