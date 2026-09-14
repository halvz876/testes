import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const tabelaUsuarios = document.getElementById('tabela-usuarios');

// Monitora a autenticação do Firebase para validar permissões reais
onAuthStateChanged(auth, async (user) => {
  if (user) {
    let nivelAtual = 'usuario';

    try {
      // 1. Busca os dados e o nível real do usuário no Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        nivelAtual = data.nivel || data.role || 'usuario';
      }

      // 2. Trava de segurança por e-mail caso não esteja definido no documento
      const emailLogado = user.email ? user.email.toLowerCase().trim() : '';
      
      // E-mails do ADM Nível 2 (pode excluir)
      if (emailLogado === 'halvz876@gmail.com' || emailLogado === 'havz876@gmail.com') {
        nivelAtual = 'adm2';
      } 
      // E-mails do ADM Nível 1 (NÃO pode excluir)
      else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
        nivelAtual = 'adm1';
      }

      carregarUsuariosFirebase(nivelAtual);

    } catch (error) {
      console.error("Erro ao verificar nível do usuário:", error);
      carregarUsuariosFirebase('usuario');
    }
  } else {
    // Se não houver login autenticado no Firebase SDK, exibe em modo apenas leitura
    carregarUsuariosFirebase('usuario');
  }
});

// Busca a lista de usuários vinda exclusivamente do Firebase Firestore
async function carregarUsuariosFirebase(nivelAtual) {
  if (!tabelaUsuarios) return;

  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Carregando dados do Firebase...</td></tr>';

  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    tabelaUsuarios.innerHTML = '';

    if (querySnapshot.empty) {
      tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum usuário cadastrado no Firebase.</td></tr>';
      return;
    }

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      const id = documento.id;

      const nome = data.nome || data.username || 'Sem nome';
      const email = data.email || 'Sem e-mail';
      const nivel = data.nivel || data.role || 'usuario';

      const tr = document.createElement('tr');

      // REGRA: Apenas ADM Nível 2 ('adm2') tem permissão para excluir
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

      if (podeDeletar) {
        btnExcluir.addEventListener('click', () => deletarNoFirebase(id, nome));
      } else {
        // Garantia de bloqueio via JS se não for ADM 2
        btnExcluir.addEventListener('click', (e) => {
          e.preventDefault();
          alert("Acesso negado: Administradores nível 1 não possuem permissão para excluir contas.");
        });
      }

      tabelaUsuarios.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro ao carregar dados do Firestore:", error);
    tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">Erro ao carregar dados do Firebase. Verifique sua conexão e regras do Firestore.</td></tr>';
  }
}

// Exclusão direta no banco de dados Firebase Firestore
async function deletarNoFirebase(id, nome) {
  const confirmacao = confirm(`[ADM NÍVEL 2] Tem certeza que deseja excluir a conta de "${nome}" permanentemente do Firebase?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    alert(`Usuário "${nome}" excluído do Firebase com sucesso!`);
    window.location.reload();
  } catch (error) {
    console.error("Erro ao deletar documento no Firebase:", error);
    alert("Erro ao excluir usuário no Firebase. Verifique se as Regras de Segurança (Security Rules) do Firestore permitem essa ação.");
  }
}