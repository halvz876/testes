import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const games = [
  { title: "Jogo da Memória", image: "./ursinho.png" },
  { title: "Flappy Bird", image: "./passarim.jpg" },
  { title: "Jogo da Velha", image: "./jogodaveia.jpg" },
  { title: "Jogo da Cobrinha", image: "./cobrinha.jpg" }
];

let currentIndex = 0;

const mainNavbar = document.getElementById('main-navbar');
const profileBtn = document.getElementById('btn-profile');
const optionsBtn = document.getElementById('btn-menu-options');
const profileMenu = document.getElementById('profile-menu');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle menus da Navbar
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

// LOGIN COM FIREBASE AUTH
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.trim();
    const inputPass = document.getElementById('login-password').value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, inputVal, inputPass);
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

      if (viewLogin) {
        viewLogin.style.display = 'none';
        viewLogin.classList.remove('active');
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
      alert("Erro ao fazer login: Verifique se o e-mail e a senha estão corretos.");
    }
  });
}

// CADASTRO (CRIAR CONTA NO FIREBASE)
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const regEmail = document.getElementById('reg-email').value.trim();
    const regPass = document.getElementById('reg-password').value.trim();

    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPass);
      alert("Conta criada com sucesso! Faça login para continuar.");
      
      // Volta para a tela de login
      const viewRegister = document.getElementById('view-register');
      const viewLogin = document.getElementById('view-login');
      if (viewRegister) viewRegister.classList.add('hidden');
      if (viewLogin) viewLogin.classList.remove('hidden');
      registerForm.reset();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar: " + error.message);
    }
  });
}

// BOTÃO CRIAR CONTA / VOLTAR (Navegação de telas)
const btnCreateAccount = document.getElementById('btn-create-account');
const btnBackToLogin = document.getElementById('btn-back-to-login');
const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');

if (btnCreateAccount) {
  btnCreateAccount.addEventListener('click', () => {
    if (viewLogin) viewLogin.classList.add('hidden');
    if (viewRegister) viewRegister.classList.remove('hidden');
  });
}

if (btnBackToLogin) {
  btnBackToLogin.addEventListener('click', () => {
    if (viewRegister) viewRegister.classList.add('hidden');
    if (viewLogin) viewLogin.classList.remove('hidden');
  });
}

// LOGOUT COM CONFIRMAÇÃO
const btnLogout = document.getElementById('btn-logout');
const viewHome = document.getElementById('view-home');
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmar = confirm("Deseja realmente sair da sua conta?");
    if (confirmar) {
      auth.signOut().then(() => {
        if (profileMenu) profileMenu.classList.add('hidden');
        if (mainNavbar) mainNavbar.classList.add('hidden');
        if (viewHome) {
          viewHome.style.display = 'none';
          viewHome.classList.add('hidden');
        }
        if (viewLogin) {
          viewLogin.style.display = 'flex';
          viewLogin.classList.remove('hidden');
        }
      });
    }
  });
}

// TOGGLE SENHA (BOTÃO DO OLHO)
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

// CARROSSEL DE JOGOS
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

document.addEventListener("DOMContentLoaded", () => {
  updateCarousel();
});