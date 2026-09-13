// Lista dos Jogos e Suas Imagens
const games = [
  { title: "Jogo da Memória", image: "ursinho.png" },
  { title: "Flappy Bird", image: "passarim.png" },
  { title: "Jogo da Velha", image: "jogodaveia.png" },
  { title: "Jogo da Cobrinha", image: "cobrinha.png" }
];

let currentIndex = 0;

// Elementos
const mainNavbar = document.getElementById('main-navbar');
const profileBtn = document.getElementById('btn-profile');
const optionsBtn = document.getElementById('btn-menu-options');
const profileMenu = document.getElementById('profile-menu');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle Menu do Perfil
if (profileBtn && profileMenu) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('hidden');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
  });
}

// Toggle Menu de 3 Pontinhos
if (optionsBtn && dropdownMenu) {
  optionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
    if (profileMenu) profileMenu.classList.add('hidden');
  });
}

// Fechar menus ao clicar fora
document.addEventListener('click', () => {
  if (profileMenu) profileMenu.classList.add('hidden');
  if (dropdownMenu) dropdownMenu.classList.add('hidden');
});

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.toLowerCase().trim();
    
    if (inputVal) {
      document.getElementById('user-nickname').textContent = inputVal.split('@')[0];
      document.getElementById('user-email').textContent = inputVal.includes('@') ? inputVal : `${inputVal}@gmail.com`;
    }

    // Libera Planilha se for adm1 ou adm2
    const linkPlanilha = document.getElementById('menu-link-planilha');
    if (linkPlanilha) {
      if (inputVal === 'adm1' || inputVal === 'adm2') {
        linkPlanilha.classList.remove('hidden');
      } else {
        linkPlanilha.classList.add('hidden');
      }
    }

    if (mainNavbar) mainNavbar.classList.remove('hidden');
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-home').classList.remove('hidden');
  });
}

// Logout
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    if (mainNavbar) mainNavbar.classList.add('hidden');
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-login').classList.remove('hidden');
  });
}

// Olho da Senha
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

// Carrossel de Jogos
const gameTitle = document.getElementById('game-title');
const gameImage = document.getElementById('game-image');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updateCarousel() {
  if (games[currentIndex]) {
    if (gameTitle) gameTitle.textContent = games[currentIndex].title;
    if (gameImage) gameImage.src = games[currentIndex].image;
  }
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