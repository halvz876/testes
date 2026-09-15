const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('login-email').value.toLowerCase().trim();
    const inputPass = document.getElementById('login-password').value.trim();

    const users = getUsers();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === inputVal || u.username.toLowerCase() === inputVal
    );

    if (!foundUser) {
      alert("Conta não encontrada!");
      return;
    }

    if (foundUser.pass !== inputPass) {
      alert("Senha incorreta!");
      return;
    }

    alert("Login realizado com sucesso!");

    // FORÇA A TROCA DE TELA ESCONDENDO O LOGIN E MOSTRANDO A HOME DIRETAMENTE
    const elLogin = document.getElementById('view-login');
    const elHome = document.getElementById('view-home');
    const elNavbar = document.getElementById('main-navbar');

    if (elLogin) {
      elLogin.style.display = 'none';
      elLogin.classList.remove('active');
      elLogin.classList.add('hidden');
    }

    if (elHome) {
      elHome.style.display = 'block';
      elHome.classList.remove('hidden');
      elHome.classList.add('active');
    }

    if (elNavbar) {
      elNavbar.classList.remove('hidden');
    }
    
    updateCarousel();
  });
}