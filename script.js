// Certifique-se de que o Firebase Auth está importado ou disponível no escopo (ex: firebase.auth() ou importado do firebase-config.js)
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.trim();
    const inputPass = document.getElementById('login-password').value.trim();

    try {
      // Tenta fazer o login direto pelo Firebase Auth
      // (Se estiver usando Firebase Modular v9+, ajuste conforme sua importação, ou use o padrão global se houver)
      const userCredential = await firebase.auth().signInWithEmailAndPassword(inputVal, inputPass);
      const user = userCredential.user;

      alert("Login realizado com sucesso!");

      // Atualiza infos de perfil na navbar
      const userNickname = document.getElementById('user-nickname');
      const userEmail = document.getElementById('user-email');
      if (userNickname) userNickname.textContent = user.email.split('@')[0];
      if (userEmail) userEmail.textContent = user.email;

      // Regra de Administrador por e-mail
      const isUserAdmin = user.email.toLowerCase() === "henriquealvesribeiro882@gmail.com" || 
                          user.email.toLowerCase() === "halvz876@gmail.com";

      const linkPlanilha = document.getElementById('menu-link-planilha');
      if (linkPlanilha) {
        if (isUserAdmin) {
          linkPlanilha.classList.remove('hidden');
        } else {
          linkPlanilha.classList.add('hidden');
        }
      }

      // TROCA DE TELA
      const viewLogin = document.getElementById('view-login');
      const viewHome = document.getElementById('view-home');
      const mainNavbar = document.getElementById('main-navbar');

      if (viewLogin) {
        viewLogin.style.display = 'none';
        viewLogin.classList.add('hidden');
      }

      if (viewHome) {
        viewHome.style.display = 'flex';
        viewHome.classList.remove('hidden');
        viewHome.classList.add('active');
      }

      if (mainNavbar) {
        mainNavbar.classList.remove('hidden');
      }
      
      updateCarousel();

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login: Verifique se o e-mail e a senha estão corretos. (Detalhe: " + error.message + ")");
    }
  });
}