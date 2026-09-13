// Dados dos Jogos
const games = [
  { title: "Jogo da Velha", icon: "fa-hashtag" },
  { title: "Flappy Bird", icon: "fa-crow" },
  { title: "Jogo da Cobrinha", icon: "fa-staff-snake" },
  { title: "Jogo da Memória", icon: "fa-brain" }
];

let currentGameIndex = 0;

// Elementos da UI
const mainNavbar = document.getElementById('main-navbar');
const profileBtn = document.getElementById('btn-profile');
const optionsBtn = document.getElementById('btn-options');
const profileMenu = document.getElementById('profile-menu');
const optionsMenu = document.getElementById('options-menu');

const viewLogin = document.getElementById('view-login');
const viewHome = document.getElementById('view-home');
const viewSearch = document.getElementById('view-search');
const viewUserProfile = document.getElementById('view-user-profile');

// Formulário de Login e Permissões ADM
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputVal = document.getElementById('login-email').value.toLowerCase().trim();
    
    if (inputVal) {
      const userNick = document.getElementById('user-nickname');
      const userMail = document.getElementById('user-email');
      if (userNick) userNick.textContent = inputVal.split('@')[0];
      if (userMail) userMail.textContent = inputVal.includes('@') ? inputVal : `${inputVal}@gmail.com`;
    }

    // Libera a opção de planilha no menu de 3 pontinhos para adm1 ou adm2
    const linkPlanilha = document.getElementById('menu-link-planilha');
    if (linkPlanilha) {
      if (inputVal === 'adm1' || inputVal === 'adm2') {
        linkPlanilha.classList.remove('hidden');
      } else {
        linkPlanilha.classList.add('hidden');
      }
    }

    // Exibe a barra de navegação e redireciona para a Home
    if (mainNavbar) mainNavbar.classList.remove('hidden');
    showView(viewHome);
  });
}

// Mostrar / Ocultar Senha (Olho)
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

// Menu de 3 Pontinhos
const btnMenu = document.getElementById('btn-menu-options');
const dropdownMenu = document.getElementById('dropdown-menu');

if (btnMenu && dropdownMenu) {
  btnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
  });
}

// Logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    if (mainNavbar) mainNavbar.classList.add('hidden');
    showView(viewLogin);
  });
}

// Fechar menus ao clicar fora
document.addEventListener('click', () => {
  if (profileMenu) profileMenu.classList.add('hidden');
  if (optionsMenu) optionsMenu.classList.add('hidden');
  if (dropdownMenu) dropdownMenu.classList.add('hidden');
});

// Navegação entre Telas
const btnSearchPage = document.getElementById('btn-search-page');
const btnBackHome = document.getElementById('btn-back-home');
const btnBackSearch = document.getElementById('btn-back-search');

if (btnSearchPage) btnSearchPage.addEventListener('click', () => showView(viewSearch));
if (btnBackHome) btnBackHome.addEventListener('click', () => showView(viewHome));
if (btnBackSearch) btnBackSearch.addEventListener('click', () => showView(viewSearch));

function showView(targetView) {
  const views = [viewLogin, viewHome, viewSearch, viewUserProfile];
  views.forEach(view => {
    if (view) view.classList.add('hidden');
  });
  if (targetView) targetView.classList.remove('hidden');
  if (profileMenu) profileMenu.classList.add('hidden');
  if (optionsMenu) optionsMenu.classList.add('hidden');
}

// Carrossel
const gameTitle = document.getElementById('game-title');
const gameIcon = document.getElementById('game-icon');

function updateCarousel() {
  if (gameTitle && games[currentGameIndex]) {
    gameTitle.textContent = games[currentGameIndex].title;
  }
  if (gameIcon && games[currentGameIndex]) {
    gameIcon.className = `fa-solid ${games[currentGameIndex].icon}`;
  }
}

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
    updateCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentGameIndex = (currentGameIndex + 1) % games.length;
    updateCarousel();
  });
}

// Busca de Usuários
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const searchResultCard = document.getElementById('search-result-card');
const userResultItem = document.getElementById('user-result-item');
const resultUsername = document.getElementById('result-username');

if (btnSearch) {
  btnSearch.addEventListener('click', () => {
    const query = searchInput ? searchInput.value.trim() : '';
    if (query !== '' && searchResultCard && resultUsername) {
      resultUsername.textContent = query;
      searchResultCard.classList.remove('hidden');
    }
  });
}

if (userResultItem) {
  userResultItem.addEventListener('click', () => {
    const targetUser = document.getElementById('target-username');
    if (targetUser && resultUsername) targetUser.textContent = resultUsername.textContent;
    showView(viewUserProfile);
  });
}

updateCarousel();