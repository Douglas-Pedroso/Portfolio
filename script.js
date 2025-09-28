// =====================
// AVALIAÇÃO DE PORTFÓLIO (ESTRELAS)
// =====================

const TOTAL_ESTRELAS = 5;
const estrelasDiv = document.getElementById('estrelas');
const votosDiv = document.getElementById('porcentagem-votos');

// URL base do backend
const API_URL = "https://portfolio-backend-production-6d89.up.railway.app/api";

// =====================
// TOKEN ÚNICO PARA CADA USUÁRIO
// =====================
function getToken() {
  let token = localStorage.getItem('voteToken');
  if (!token) {
    token = crypto.randomUUID(); // gera token único
    localStorage.setItem('voteToken', token);
  }
  return token;
}

const TOKEN = getToken();

// =====================
// INTEGRAÇÃO COM BACKEND
// =====================
async function buscarAvaliacao() {
  try {
    const res = await fetch(`${API_URL}/avaliacao`);
    const data = await res.json();
    renderEstrelas(data.media || 0);

    if (data.total > 0) {
      const porcentagem = ((data.media / TOTAL_ESTRELAS) * 100).toFixed(1);
      votosDiv.textContent = `Média: ${Number(data.media).toFixed(2)} (${porcentagem}% de aprovação, ${data.total} voto${data.total > 1 ? 's' : ''})`;
    } else {
      votosDiv.textContent = 'Ainda não há avaliações.';
    }
  } catch (err) {
    votosDiv.textContent = 'Erro ao carregar avaliações.';
  }
}

function renderEstrelas(media) {
  estrelasDiv.innerHTML = '';
  for (let i = 1; i <= TOTAL_ESTRELAS; i++) {
    const img = document.createElement('img');
    img.src = i <= Math.round(media) ? 'img/star.png' : 'img/nostar.png';
    img.alt = i <= Math.round(media) ? 'Estrela' : 'Sem estrela';
    img.style.width = '32px';
    img.style.height = '32px';
    img.style.cursor = 'pointer';
    img.dataset.valor = i;
    img.addEventListener('mouseenter', highlightEstrelas);
    img.addEventListener('mouseleave', () => renderEstrelas(media));
    img.addEventListener('click', votarEstrela);
    estrelasDiv.appendChild(img);
  }
}

function highlightEstrelas(e) {
  const valor = Number(e.target.dataset.valor);
  const imgs = estrelasDiv.querySelectorAll('img');
  imgs.forEach((img, idx) => {
    img.src = idx < valor ? 'img/star.png' : 'img/nostar.png';
  });
}

async function votarEstrela(e) {
  const nota = Number(e.target.dataset.valor);

  try {
    const res = await fetch(`${API_URL}/votar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota, token: TOKEN })
    });

    const data = await res.json();

    if (!data.success) {
      votosDiv.textContent = data.error || 'Erro ao registrar voto.';
    }

    buscarAvaliacao();
  } catch (err) {
    votosDiv.textContent = 'Erro ao registrar voto.';
  }
}

// =====================
// INICIALIZAÇÃO
// =====================
if (estrelasDiv && votosDiv) {
  buscarAvaliacao();
}

// =====================
// MENSAGENS INICIAIS
// =====================
console.log("Site carregado com sucesso!");

// =====================
// SMOOTH SCROLL PARA MENU
// =====================
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
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
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach(section => observer.observe(section));
