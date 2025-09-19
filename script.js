// =====================
// MENSAGENS INICIAIS
// =====================
console.log("Site carregado com sucesso!");

//testdriverpullreswuest
// Smooth scroll para menu


// =====================
// SMOOTH SCROLL PARA MENU
// =====================

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // previne o comportamento padrão do link
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =====================
// ANIMAÇÃO FADE-IN AO ROLAR
// =====================
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // adiciona classe para animação
      }
    });
  },
  { threshold: 0.2 } // 20% do elemento precisa estar visível para disparar
);

sections.forEach(section => observer.observe(section));
