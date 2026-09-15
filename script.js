// LOGIN E VALIDAÇÃO DE CADASTRO
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.toLowerCase().trim();
    const inputPass = document.getElementById('login-password').value.trim();

    const users = getUsers();

    // Procura por email ou username
    const foundUser = users.find(u => 
      u.email.toLowerCase() === inputVal || u.username.toLowerCase() === inputVal
    );

    if (!foundUser) {
      alert("Conta não encontrada! Por favor, crie uma conta para acessar a plataforma.");
      return;
    }

    if (foundUser.pass !== inputPass) {
      alert("Senha incorreta! Tente novamente.");
      return;
    }

    // Alerta de sucesso
    alert("Login realizado com sucesso!");

    // Atualiza infos de perfil na navbar se existirem
    const userNickname = document.getElementById('user-nickname');
    const userEmail = document.getElementById('user-email');
    if (userNickname) userNickname.textContent = foundUser.username;
    if (userEmail) userEmail.textContent = foundUser.email;

    // Regra de Administrador
    const isUserAdmin = foundUser.email.toLowerCase() === "henriquealvesribeiro882@gmail.com" || 
                        foundUser.email.toLowerCase() === "halvz876@gmail.com" || 
                        foundUser.isAdmin;

    const linkPlanilha = document.getElementById('menu-link-planilha');
    if (linkPlanilha) {
      if (isUserAdmin) {
        linkPlanilha.classList.remove('hidden');
      } else {
        linkPlanilha.classList.add('hidden');
      }
    }

    // FORÇA A EXIBIÇÃO DA HOME E ESCONDE O LOGIN (USANDO ESTILO DIRETO)
    const viewLogin = document.getElementById('view-login');
    const viewHome = document.getElementById('view-home');
    const mainNavbar = document.getElementById('main-navbar');

    if (viewLogin) {
      viewLogin.style.display = 'none';
      viewLogin.classList.remove('active', 'view');
      viewLogin.classList.add('hidden');
    }

    if (viewHome) {
      viewHome.style.display = 'block';
      viewHome.classList.remove('hidden');
      viewHome.classList.add('active', 'view');
    }

    if (mainNavbar) {
      mainNavbar.classList.remove('hidden');
    }
    
    updateCarousel();
  });
}