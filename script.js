// Dados dos Jogos (Carrossel)
const games = [
  { title: "Jogo da Velha", image: "https://via.placeholder.com/280/1a237e/ffffff?text=Jogo+da+Velha" },
  { title: "Flappy Bird", image: "https://via.placeholder.com/280/e65100/ffffff?text=Flappy+Bird" },
  { title: "Jogo da Cobrinha", image: "https://via.placeholder.com/280/1b5e20/ffffff?text=Jogo+da+Cobrinha" },
  { title: "Jogo da Memória", image: "https://via.placeholder.com/280/4a148c/ffffff?text=Jogo+da+Mem%C3%B3ria" }
];

let currentGameIndex = 0;

// Elementos da UI
const profileBtn = document.getElementById('btn-profile');
const optionsBtn = document.getElementById('btn-options');
const profileMenu = document.getElementById('profile-menu');
const optionsMenu = document.getElementById('options-menu');

const viewHome = document.getElementById('view-home');
const viewSearch = document.getElementById('view-search');
const viewUserProfile = document.getElementById('view-user-profile');

// Controle dos Dropdowns
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

// Navegação de Telas
document.getElementById('btn-search-page').addEventListener('click', () => {
  showView(viewSearch);
});

document.getElementById('btn-back-home').addEventListener('click', () => {
  showView(viewHome);
});

document.getElementById('btn-back-search').addEventListener('click', () => {
  showView(viewSearch);
});

function showView(targetView) {
  [viewHome, viewSearch, viewUserProfile].forEach(view => view.classList.add('hidden'));
  targetView.classList.remove('hidden');
  profileMenu.classList.add('hidden');
  optionsMenu.classList.add('hidden');
}

// Lógica do Carrossel
const gameTitle = document.getElementById('game-title');
const gameImage = document.getElementById('game-image');

function updateCarousel() {
  gameTitle.textContent = games[currentGameIndex].title;
  gameImage.src = games[currentGameIndex].image;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
  updateCarousel();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentGameIndex = (currentGameIndex + 1) % games.length;
  updateCarousel();
});

// Busca de Usuários
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

// Inicialização
updateCarousel();