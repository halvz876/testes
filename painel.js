import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const tabelaUsuarios = document.getElementById('tabela-usuarios');

// Identifica quem está logado no Firebase Auth
onAuthStateChanged(auth, async (user) => {
  let nivelAtual = 'usuario';

  if (user && user.email) {
    const emailLogado = user.email.toLowerCase().trim();

    // Regra de permissão para definir quem é ADM nível 2
    if (emailLogado === 'halvz876@gmail.com' || emailLogado === 'havz876@gmail.com') {
      nivelAtual = 'adm2';
    } else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
      nivelAtual = 'adm1';
    }
  } else {
    // Fallback caso use session local antiga
    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
      const emailLocal = loggedUser.toLowerCase();
      if (emailLocal.includes('halvz876') || emailLocal.includes('havz876')) nivelAtual = 'adm2';
      else if (emailLocal.includes('henriquealvesribeiro882')) nivelAtual = 'adm1';
    }
  }

  carregarFirestore(nivelAtual);
});

async function carregarFirestore(nivelAtual) {
  if (!tabelaUsuarios) return;

  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #a0aec0;">Buscando dados no Firebase...</td></tr>';

  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    tabelaUsuarios.innerHTML = '';

    if (querySnapshot.empty) {
      tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #a0aec0;">Nenhum usuário cadastrado no banco Firestore.</td></tr>';
      return;
    }

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      const id = documento.id;

      const nome = data.nome || 'Sem nome';
      const email = data.email || 'Sem e-mail';
      const nivelDoc = data.nivel || 'usuario';

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
        btnExcluir.addEventListener('click', () => deletarNoFirestore(id, nome));
      }

      tabelaUsuarios.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro no Firestore:", error);
    tabelaUsuarios.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">
      Erro de conexão com o Firebase.<br><small style="color: #a0aec0;">${error.message}</small>
    </td></tr>`;
  }
}

async function deletarNoFirestore(id, nome) {
  const confirmacao = confirm(`[ADM NÍVEL 2] Deseja excluir "${nome}" permanentemente do Firebase?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    alert(`Usuário "${nome}" excluído com sucesso!`);
    window.location.reload();
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao excluir no Firestore.");
  }
}