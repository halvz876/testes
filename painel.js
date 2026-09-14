import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const tabelaUsuarios = document.getElementById('tabela-usuarios');

// Lista padrão caso esteja usando dados locais (localStorage)
const usuariosPadraoLocal = [
  { id: '1', nome: 'lean', email: 'lean17@gmail.com', nivel: 'usuario' },
  { id: '2', nome: 'rik', email: 'rik13@gmail.com', nivel: 'usuario' },
  { id: '3', nome: 'zera', email: 'davizera66@gmail.com', nivel: 'usuario' },
  { id: '4', nome: 'henrique', email: 'henriquealvesribeiro882@gmail.com', nivel: 'adm1' },
  { id: '5', nome: 'CARLOS', email: 'carlos@gmail.com', nivel: 'usuario' },
  { id: '6', nome: 'david', email: 'dada6@gmail.com', nivel: 'usuario' },
  { id: '7', nome: 'Fabio de Souza Ribeiro', email: 'pespontofabio0@gmail.com', nivel: 'usuario' },
  { id: '8', nome: 'henrique', email: 'halvz876@gmail.com', nivel: 'adm2' }
];

// Inicia tentando verificar a autenticação ou carrega o painel direto
if (auth) {
  onAuthStateChanged(auth, (user) => {
    let nivelAtual = 'adm2'; // Padrão liberado para visualização/testes
    if (user && user.email) {
      const email = user.email.toLowerCase();
      if (email.includes('halvz876') || email.includes('havz876')) nivelAtual = 'adm2';
      else if (email.includes('henriquealvesribeiro882')) nivelAtual = 'adm1';
    }
    iniciarCarregamento(nivelAtual);
  });
} else {
  iniciarCarregamento('adm2');
}

async function iniciarCarregamento(nivelAtual) {
  if (!tabelaUsuarios) return;

  // 1. Tenta buscar no Firebase Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const listaUsuarios = [];

    querySnapshot.forEach((documento) => {
      listaUsuarios.push({ id: documento.id, ...documento.data() });
    });

    if (listaUsuarios.length > 0) {
      renderizarTabela(listaUsuarios, nivelAtual, true);
      return;
    }
  } catch (erroFirebase) {
    console.warn("Firebase não retornou dados ou deu erro de permissão. Usando base local:", erroFirebase);
  }

  // 2. Se o Firebase falhar/estiver vazio, usa os dados do localStorage ou a lista padrão
  const armazenados = localStorage.getItem('app_users');
  let listaLocal = armazenados ? JSON.parse(armazenados) : usuariosPadraoLocal;

  renderizarTabela(listaLocal, nivelAtual, false);
}

function renderizarTabela(usuarios, nivelAtual, isFirebase) {
  tabelaUsuarios.innerHTML = '';

  if (usuarios.length === 0) {
    tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum usuário encontrado.</td></tr>';
    return;
  }

  usuarios.forEach((user) => {
    const tr = document.createElement('tr');
    const id = user.id || user.email;
    const nome = user.nome || user.username || 'Sem nome';
    const email = user.email || 'Sem e-mail';
    const nivel = user.nivel || (user.isAdmin ? 'adm1' : 'usuario');

    // Apenas ADM Nível 2 (adm2) pode excluir registros
    const podeDeletar = (nivelAtual === 'adm2');

    tr.innerHTML = `
      <td><strong>${nome}</strong></td>
      <td>${email}</td>
      <td><span class="badge-nivel badge-${nivel}">${nivel}</span></td>
      <td>
        <button class="btn-excluir" ${!podeDeletar ? 'disabled title="Apenas ADM nível 2 pode excluir"' : ''}>
          confirmar <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    const btnExcluir = tr.querySelector('.btn-excluir');
    if (podeDeletar && btnExcluir) {
      btnExcluir.addEventListener('click', () => deletarUsuario(id, nome, isFirebase));
    }

    tabelaUsuarios.appendChild(tr);
  });
}

async function deletarUsuario(id, nome, isFirebase) {
  const confirmacao = confirm(`Tem certeza que deseja excluir "${nome}"?`);
  if (!confirmacao) return;

  if (isFirebase) {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      alert(`Usuário "${nome}" excluído com sucesso!`);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir no Firebase:", error);
      alert("Erro de permissão no Firebase Firestore ao excluir.");
    }
  } else {
    // Exclusão Local
    let armazenados = localStorage.getItem('app_users');
    let lista = armazenados ? JSON.parse(armazenados) : usuariosPadraoLocal;
    lista = lista.filter(u => (u.id !== id && u.email !== id));
    localStorage.setItem('app_users', JSON.stringify(lista));
    alert(`Usuário "${nome}" removido localmente!`);
    window.location.reload();
  }
}