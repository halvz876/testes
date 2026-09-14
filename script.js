const games = [
  { title: "Jogo da Memória", image: "./ursinho.png" },
  { title: "Flappy Bird", image: "./passarim.jpg" },
  { title: "Jogo da Velha", image: "./jogodaveia.jpg" },
  { title: "Jogo da Cobrinha", image: "./cobrinha.jpg" }
];

let currentIndex = 0;

// BASE DE DADOS LOCAL DE USUÁRIOS (com ADMs já pré-cadastrados)
const defaultUsers = [
  { username: "henrique", email: "henriquealvesribeiro882@gmail.com", pass: "lula2026", isAdmin: true },
  { username: "henrique", email: "halvz876@gmail.com", pass: "lula2026Brasil", isAdmin: true },
  { username: "henrique", email: "havz876@gmail.com", pass: "lula2026Brasil", isAdmin: true },
  { username: "adm1", email: "adm1@gmail.com", pass: "123456", isAdmin: true },
  { username: "adm2", email: "adm2@gmail.com", pass: "123456", isAdmin: true }
];

function getUsers() {
  const stored = localStorage.getItem('app_users');
  if (!stored) {
    localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('app_users', JSON.stringify(users));
}

const mainNavbar = document.getElementById('main-navbar');
const profileBtn = document.getElementById('btn-profile');
const optionsBtn = document.getElementById('btn-menu-options');
const profileMenu = document.getElementById('profile-menu');
const dropdownMenu = document.getElementById('dropdown-menu');

const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');
const viewHome = document.getElementById('view-home');

// Toggle menus
if (profileBtn && profileMenu) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('hidden');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
  });
}

if (optionsBtn && dropdownMenu) {
  optionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
    if (profileMenu) profileMenu.classList.add('hidden');
  });
}

document.addEventListener('click', () => {
  if (profileMenu) profileMenu.classList.add('hidden');
  if (dropdownMenu) dropdownMenu.classList.add('hidden');
});

// LOGIN E VALIDAÇÃO DE CADASTRO
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.toLowerCase().trim();
    const inputPass = document.getElementById('login-password').value.trim();

    const users = getUsers();

    // Procura por email ou username na lista de usuários cadastrados
    const foundUser = users.find(u => 
      u.email.toLowerCase() === inputVal || u.username.toLowerCase() === inputVal
    );

    // Se a conta não existe, alerta e manda criar conta
    if (!foundUser) {
      alert("Conta não encontrada! Por favor, crie uma conta para acessar a plataforma.");
      viewLogin.classList.add('hidden');
      viewRegister.classList.remove('hidden');
      return;
    }

    // Atualiza infos de perfil na navbar
    document.getElementById('user-nickname').textContent = foundUser.username;
    document.getElementById('user-email').textContent = foundUser.email;

    // Exibe a planilha de ADM se for um usuário com privilégio de ADM
    const linkPlanilha = document.getElementById('menu-link-planilha');
    if (linkPlanilha) {
      if (foundUser.isAdmin) {
        linkPlanilha.classList.remove('hidden');
      } else {
        linkPlanilha.classList.add('hidden');
      }
    }

    if (mainNavbar) mainNavbar.classList.remove('hidden');
    viewLogin.classList.add('hidden');
    viewHome.classList.remove('hidden');
  });
}

// CRIAR CONTA (CADASTRO)
const btnCreateAccount = document.getElementById('btn-create-account');
const btnBackToLogin = document.getElementById('btn-back-to-login');
const registerForm = document.getElementById('register-form');

if (btnCreateAccount) {
  btnCreateAccount.addEventListener('click', () => {
    viewLogin.classList.add('hidden');
    viewRegister.classList.remove('hidden');
  });
}

if (btnBackToLogin) {
  btnBackToLogin.addEventListener('click', () => {
    viewRegister.classList.add('hidden');
    viewLogin.classList.remove('hidden');
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    // Salva a nova conta no sistema
    saveUser({ username, email, pass, isAdmin: false });

    alert('Conta criada com sucesso! Faça login para continuar.');
    viewRegister.classList.add('hidden');
    viewLogin.classList.remove('hidden');
    
    // Preenche o campo de login com o e-mail cadastrado
    document.getElementById('login-email').value = email;
  });
}

// EXCLUIR CONTA NO LOGIN
const btnDeleteAccountLogin = document.getElementById('btn-delete-account-login');
if (btnDeleteAccountLogin) {
  btnDeleteAccountLogin.addEventListener('click', () => {
    const emailToDelete = prompt('Digite o e-mail ou usuário da conta que deseja excluir:');
    if (emailToDelete) {
      alert(`Solicitação de exclusão para "${emailToDelete}" enviada com sucesso.`);
    }
  });
}

// LOGOUT
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    if (mainNavbar) mainNavbar.classList.add('hidden');
    viewHome.classList.add('hidden');
    viewLogin.classList.remove('hidden');
  });
}

// TOGGLE SENHA
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('login-password');
if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });
}

// CARROSSEL
const gameTitle = document.getElementById('game-title');
const gameImage = document.getElementById('game-image');
const imgPrev = document.getElementById('img-prev');
const imgNext = document.getElementById('img-next');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updateCarousel() {
  const total = games.length;

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  if (imgPrev) imgPrev.src = games[prevIndex].image;
  if (imgNext) imgNext.src = games[nextIndex].image;

  if (gameTitle) gameTitle.textContent = games[currentIndex].title;
  if (gameImage) gameImage.src = games[currentIndex].image;
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + games.length) % games.length;
    updateCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % games.length;
    updateCarousel();
  });
}

updateCarousel();