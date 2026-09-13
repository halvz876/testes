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

// Formulário de Login
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const inputVal = document.getElementById('login-email').value;
  if(inputVal) {
    document.getElementById('user-nickname').textContent = inputVal.split('@')[0];
    document.getElementById('user-email').textContent = inputVal.includes('@') ? inputVal : `${inputVal}@gmail.com`;
  }
  mainNavbar.classList.remove('hidden');
  showView(viewHome);
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  mainNavbar.classList.add('hidden');
  showView(viewLogin);
});

// Controle de Dropdowns
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileMenu.classList.toggle('hidden');
  optionsMenu.classList.add('hidden');
});

optionsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  optionsMenu.classList.toggle('hidden');
  profileMenu.classList.add('hidden');
});

document.addEventListener('click', () => {
  profileMenu.classList.add('hidden');
  optionsMenu.classList.add('hidden');
});

// Navegação
document.getElementById('btn-search-page').addEventListener('click', () => showView(viewSearch));
document.getElementById('btn-back-home').addEventListener('click', () => showView(viewHome));
document.getElementById('btn-back-search').addEventListener('click', () => showView(viewSearch));

function showView(targetView) {
  [viewLogin, viewHome, viewSearch, viewUserProfile].forEach(view => view.classList.add('hidden'));
  targetView.classList.remove('hidden');
  profileMenu.classList.add('hidden');
  optionsMenu.classList.add('hidden');
}

// Carrossel
const gameTitle = document.getElementById('game-title');
const gameIcon = document.getElementById('game-icon');

function updateCarousel() {
  gameTitle.textContent = games[currentGameIndex].title;
  gameIcon.className = `fa-solid ${games[currentGameIndex].icon}`;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
  updateCarousel();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentGameIndex = (currentGameIndex + 1) % games.length;
  updateCarousel();
});

// Busca
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const searchResultCard = document.getElementById('search-result-card');
const userResultItem = document.getElementById('user-result-item');
const resultUsername = document.getElementById('result-username');

btnSearch.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query !== '') {
    resultUsername.textContent = query;
    searchResultCard.classList.remove('hidden');
  }
});

userResultItem.addEventListener('click', () => {
  document.getElementById('target-username').textContent = resultUsername.textContent;
  showView(viewUserProfile);
});

updateCarousel();