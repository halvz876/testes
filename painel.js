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

// Função para verificar o nível de acesso do usuário atual e carregar a tabela
onAuthStateChanged(auth, async (user) => {
  if (user) {
    let nivelAtual = 'usuario';

    // Busca as informações do usuário logado no Firestore para verificar o nível (adm1, adm2 ou usuario)
    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        nivelAtual = userData.nivel || userData.role || 'usuario';
      }

      // Verificação fallback caso seja um dos e-mails principais de ADM
      const emailLogado = user.email ? user.email.toLowerCase() : '';
      if (emailLogado === 'halvz876@gmail.com' || emailLogado === 'havz876@gmail.com') {
        nivelAtual = 'adm2';
      } else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
        nivelAtual = 'adm1';
      }

      // Carrega a lista de usuários passando o nível detectado
      carregarUsuarios(nivelAtual);

    } catch (error) {
      console.error("Erro ao buscar dados do usuário logado:", error);
      carregarUsuarios('usuario');
    }
  } else {
    // Se não houver usuário autenticado no Firebase, carrega em modo leitura simples
    carregarUsuarios('usuario');
  }
});

// Função para listar os usuários do Firestore na tabela
async function carregarUsuarios(nivelAtual) {
  if (!tabelaUsuarios) return;

  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Carregando usuários...</td></tr>';

  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    tabelaUsuarios.innerHTML = '';

    if (querySnapshot.empty) {
      tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum usuário encontrado.</td></tr>';
      return;
    }

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      const id = documento.id;

      const nome = data.nome || data.username || 'Sem nome';
      const email = data.email || 'Sem e-mail';
      const nivel = data.nivel || data.role || 'usuario';

      // Cria a linha da tabela
      const tr = document.createElement('tr');

      // Apenas ADM Nível 2 (adm2) pode excluir registros
      const podeDeletar = nivelAtual === 'adm2';

      tr.innerHTML = `
        <td><strong>${nome}</strong></td>
        <td>${email}</td>
        <td><span class="badge-nivel badge-${nivel}">${nivel}</span></td>
        <td>
          <button class="btn-excluir" ${!podeDeletar ? 'disabled title="Apenas ADM nível 2 pode excluir"' : ''} data-id="${id}">
            confirmar <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      // Adiciona o evento de clique no botão excluir se tiver permissão
      const btnExcluir = tr.querySelector('.btn-excluir');
      if (podeDeletar && btnExcluir) {
        btnExcluir.addEventListener('click', () => deletarUsuario(id, nome));
      }

      tabelaUsuarios.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro ao carregar lista de usuários:", error);
    tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">Erro ao carregar dados.</td></tr>';
  }
}

// Função para deletar usuário do Firestore
async function deletarUsuario(id, nome) {
  const confirmacao = confirm(`Tem certeza que deseja excluir a conta de "${nome}"?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    alert(`Usuário "${nome}" excluído com sucesso!`);
    window.location.reload();
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    alert("Falha ao excluir usuário. Verifique suas permissões.");
  }
}