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

      // FORÇA A MUDANÇA DE TELA USANDO OS ELEMENTOS DA PÁGINA
      // Seus containers de tela principais (procurando por ID ou tag .view)
      const views = document.querySelectorAll('.view, main, section');
      views.forEach(el => {
        // Se o elemento parecer ser a tela de login, esconde
        if (el.id && el.id.includes('login')) {
          el.style.display = 'none';
          el.classList.add('hidden');
        }
        // Se for a tela principal/home, mostra
        if (el.id && (el.id.includes('home') || el.id.includes('main') || el.id.includes('carrossel'))) {
          el.style.display = 'block';
          el.classList.remove('hidden');
          el.classList.add('active');
        }
      });

      // Mostra a barra de navegação superior
      const mainNavbar = document.getElementById('main-navbar') || document.querySelector('header') || document.querySelector('nav');
      if (mainNavbar) {
        mainNavbar.style.display = 'flex';
        mainNavbar.classList.remove('hidden');
      }

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
      
      updateCarousel();

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login: Verifique se o e-mail e a senha estão corretos.");
    }
  });
}