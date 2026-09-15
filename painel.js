import { db, auth } from "./firebase-config.js";
import { collection, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let usuariosListaOriginal = [];
let nivelUsuarioAtual = 'usuario';

document.addEventListener("DOMContentLoaded", () => {
  const tabelaUsuarios = document.getElementById('tabela-usuarios');
  const inputBusca = document.getElementById('input-busca-email');
  const selectOrdenar = document.getElementById('select-ordenar');

  if (!tabelaUsuarios) return;

  onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
      const emailLogado = user.email.toLowerCase().trim();

      if (emailLogado === 'halvz876@gmail.com' || emailLogado === 'havz876@gmail.com' || emailLogado === 'halvz86@gmail.com') {
        nivelUsuarioAtual = 'adm2';
      } else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
        nivelUsuarioAtual = 'adm1';
      }
    }

    escutarFirestoreEmTempoReal(tabelaUsuarios);
  });

  if (inputBusca) {
    inputBusca.addEventListener('input', () => renderizarTabela(tabelaUsuarios));
  }

  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', () => renderizarTabela(tabelaUsuarios));
  }
});

function escutarFirestoreEmTempoReal(tabelaUsuarios) {
  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #a0aec0;">Conectando ao banco...</td></tr>';

  onSnapshot(collection(db, "usuarios"), (querySnapshot) => {
    usuariosListaOriginal = [];

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      usuariosListaOriginal.push({
        id: documento.id,
        nome: data.nome || data.Nome || data.username || 'Sem nome',
        email: data.email || data.Email || 'Sem e-mail',
        nivel: data.nivel || data.Nivel || 'usuario',
        criadoEm: data.criadoEm || ''
      });
    });

    renderizarTabela(tabelaUsuarios);

  }, (error) => {
    console.error("Erro no Firestore:", error);
    tabelaUsuarios.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">
      Erro ao carregar dados.<br><small style="color: #a0aec0;">${error.message}</small>
    </td></tr>`;
  });
}

function renderizarTabela(tabelaUsuarios) {
  const termoBusca = (document.getElementById('input-busca-email')?.value || '').toLowerCase().trim();
  const opcaoOrdenacao = document.getElementById('select-ordenar')?.value || 'nome-asc';

  // FILTRAGEM POR E-MAIL
  let listaFiltrada = usuariosListaOriginal.filter(u => u.email.toLowerCase().includes(termoBusca));

  // ORDENAÇÃO
  listaFiltrada.sort((a, b) => {
    if (opcaoOrdenacao === 'nome-asc') return a.nome.localeCompare(b.nome);
    if (opcaoOrdenacao === 'nome-desc') return b.nome.localeCompare(a.nome);
    if (opcaoOrdenacao === 'data-asc') return (a.criadoEm || '').localeCompare(b.criadoEm || '');
    if (opcaoOrdenacao === 'data-desc') return (b.criadoEm || '').localeCompare(a.criadoEm || '');
    return 0;
  });

  atualizarContadorUsuarios(listaFiltrada.length);

  tabelaUsuarios.innerHTML = '';

  // AVISO DE NÃO ENCONTRADO
  if (listaFiltrada.length === 0) {
    tabelaUsuarios.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 25px; color: #e53e3e; font-weight: 500;">
          <i class="fa-solid fa-circle-exclamation"></i> Nenhum usuário encontrado para "${termoBusca}".
        </td>
      </tr>`;
    return;
  }

  listaFiltrada.forEach((u) => {
    const tr = document.createElement('tr');
    const podeDeletar = (nivelUsuarioAtual === 'adm2');

    tr.innerHTML = `
      <td><strong>${u.nome}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-nivel badge-${u.nivel}">${u.nivel}</span></td>
      <td>
        <button class="btn-excluir" ${!podeDeletar ? 'disabled style="opacity:0.3; cursor:not-allowed;" title="Apenas ADM nível 2 pode excluir"' : ''}>
          confirmar <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    const btnExcluir = tr.querySelector('.btn-excluir');
    if (podeDeletar && btnExcluir) {
      btnExcluir.addEventListener('click', () => deletarNoFirestore(u.id, u.nome));
    }

    tabelaUsuarios.appendChild(tr);
  });
}

function atualizarContadorUsuarios(total) {
  let contadorEl = document.getElementById('contador-usuarios');
  
  if (!contadorEl) {
    const tituloTabela = document.querySelector('h1');
    contadorEl = document.createElement('div');
    contadorEl.id = 'contador-usuarios';
    contadorEl.style.cssText = 'margin-bottom: 15px; font-size: 15px; color: #cbd5e1; font-weight: 500;';
    
    if (tituloTabela) {
      tituloTabela.insertAdjacentElement('afterend', contadorEl);
    } else {
      document.body.prepend(contadorEl);
    }
  }

  contadorEl.innerHTML = `<i class="fa-solid fa-users"></i> Usuários exibidos: <strong style="color: #38bdf8;">${total}</strong>`;
}

async function deletarNoFirestore(id, nome) {
  const confirmacao = confirm(`Deseja excluir "${nome}" permanentemente do banco?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    alert(`Usuário "${nome}" excluído com sucesso!`);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao excluir documento do banco.");
  }
}