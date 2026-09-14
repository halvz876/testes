import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const tabelaUsuarios = document.getElementById('tabela-usuarios');

// Lista padrão de usuários (caso o Firestore/localStorage não tenha dados)
const usuariosPadrao = [
  { id: '1', nome: 'lean', email: 'lean17@gmail.com', nivel: 'usuario' },
  { id: '2', nome: 'rik', email: 'rik13@gmail.com', nivel: 'usuario' },
  { id: '3', nome: 'zera', email: 'davizera66@gmail.com', nivel: 'usuario' },
  { id: '4', nome: 'henrique', email: 'henriquealvesribeiro882@gmail.com', nivel: 'adm1' },
  { id: '5', nome: 'CARLOS', email: 'carlos@gmail.com', nivel: 'usuario' },
  { id: '6', nome: 'david', email: 'dada6@gmail.com', nivel: 'usuario' },
  { id: '7', nome: 'Fabio de Souza Ribeiro', email: 'pespontofabio0@gmail.com', nivel: 'usuario' },
  { id: '8', nome: 'henrique', email: 'halvz876@gmail.com', nivel: 'adm2' }
];

// Identifica o nível de acesso do usuário logado
function obterNivelUsuarioLogado(firebaseUser) {
  // 1. Tenta pegar pelo e-mail do Firebase Auth
  let email = firebaseUser ? firebaseUser.email : null;

  // 2. Se não encontrou no Firebase Auth, pega o usuário salvo no localStorage (login local)
  if (!email) {
    const userLocal = localStorage.getItem('logged_user');
    if (userLocal) {
      try {
        const parsed = JSON.parse(userLocal);
        email = parsed.email || parsed.username;
      } catch (e) {
        email = userLocal;
      }
    }
  }

  if (!email) email = '';
  email = email.toLowerCase().trim();

  // Definição estrita dos ADMs por e-mail/username
  if (email.includes('halvz876') || email.includes('havz876') || email === 'adm2') {
    return 'adm2'; // ADM Nível 2 - Pode excluir
  }
  if (email.includes('henriquealvesribeiro882') || email === 'adm1') {
    return 'adm1'; // ADM Nível 1 - NÃO pode excluir
  }

  return 'usuario';
}

// Inicializa a página
if (auth) {
  onAuthStateChanged(auth, (user) => {
    const nivelAtual = obterNivelUsuarioLogado(user);
    carregarPainel(nivelAtual);
  });
} else {
  const nivelAtual = obterNivelUsuarioLogado(null);
  carregarPainel(nivelAtual);
}

async function carregarPainel(nivelAtual) {
  if (!tabelaUsuarios) return;

  let listaUsuarios = [];
  let isFirebase = false;

  // Tenta carregar do Firebase Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    querySnapshot.forEach((documento) => {
      listaUsuarios.push({ id: documento.id, ...documento.data() });
    });

    if (listaUsuarios.length > 0) {
      isFirebase = true;
    }
  } catch (erro) {
    console.warn("Aviso Firebase: Não foi possível ler dados do Firestore, carregando base local.", erro);
  }

  // Se o Firebase falhar ou estiver vazio, usa os dados armazenados localmente
  if (listaUsuarios.length === 0) {
    const armazenados = localStorage.getItem('app_users');
    listaUsuarios = armazenados ? JSON.parse(armazenados) : usuariosPadrao;
    isFirebase = false;
  }

  renderizarTabela(listaUsuarios, nivelAtual, isFirebase);
}

function renderizarTabela(usuarios, nivelAtual, isFirebase) {
  tabelaUsuarios.innerHTML = '';

  if (usuarios.length === 0) {
    tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  usuarios.forEach((user) => {
    const tr = document.createElement('tr');
    const id = user.id || user.email;
    const nome = user.nome || user.username || 'Sem nome';
    const email = user.email || 'Sem e-mail';
    const nivel = user.nivel || (user.isAdmin ? 'adm1' : 'usuario');

    // REGRA DE SEGURANÇA CRÍTICA: Apenas ADM Nível 2 pode excluir
    const podeDeletar = (nivelAtual === 'adm2');

    tr.innerHTML = `
      <td><strong>${nome}</strong></td>
      <td>${email}</td>
      <td><span class="badge-nivel badge-${nivel}">${nivel}</span></td>
      <td>
        <button class="btn-excluir" ${!podeDeletar ? 'disabled style="opacity: 0.5; cursor: not-allowed;" title="Apenas ADM Nível 2 pode excluir"' : ''}>
          confirmar <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    const btnExcluir = tr.querySelector('.btn-excluir');

    if (podeDeletar) {
      btnExcluir.addEventListener('click', () => deletarUsuario(id, nome, isFirebase));
    } else {
      btnExcluir.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Acesso negado: Administradores nível 1 não têm permissão para excluir contas.");
      });
    }

    tabelaUsuarios.appendChild(tr);
  });
}

async function deletarUsuario(id, nome, isFirebase) {
  const confirmacao = confirm(`[ADM NÍVEL 2] Tem certeza que deseja excluir "${nome}"?`);
  if (!confirmacao) return;

  if (isFirebase) {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      alert(`Usuário "${nome}" excluído com sucesso do Firebase!`);
      window.location.reload();
      return;
    } catch (error) {
      console.error("Erro ao deletar no Firebase:", error);
    }
  }

  // Exclusão no localStorage
  let armazenados = localStorage.getItem('app_users');
  let lista = armazenados ? JSON.parse(armazenados) : usuariosPadrao;
  lista = lista.filter(u => (u.id !== id && u.email !== id && u.username !== nome));
  localStorage.setItem('app_users', JSON.stringify(lista));

  alert(`Usuário "${nome}" excluído com sucesso!`);
  window.location.reload();
}