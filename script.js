const TOTAL_ESTRELAS = 5;
const estrelasDiv = document.getElementById("estrelas");
const votosDiv = document.getElementById("porcentagem-votos");

const API_URL = "https://portfolio-backend-production-6d89.up.railway.app/api";

function getToken() {
  let token = localStorage.getItem("voteToken");
  if (!token) {
    token = crypto.randomUUID(); // gera token único
    localStorage.setItem("voteToken", token);
  }
  return token;
}

const TOKEN = getToken();

async function buscarAvaliacao() {
  try {
    const res = await fetch(`${API_URL}/avaliacao`);
    const data = await res.json();

    const votoUsuario = Number(localStorage.getItem("votoUsuario"));

    const mediaParaRender = votoUsuario || 0;
    renderEstrelas(mediaParaRender);

    if (data.total > 0) {
      const porcentagem = ((data.media / TOTAL_ESTRELAS) * 100).toFixed(1);
      votosDiv.textContent = `Média: ${Number(data.media).toFixed(
        2
      )} (${porcentagem}% de aprovação, ${data.total} voto${
        data.total > 1 ? "s" : ""
      })`;
    } else {
      votosDiv.textContent = "Ainda não há avaliações.";
    }
  } catch (err) {
    votosDiv.textContent = "Erro ao carregar avaliações.";
  }
}

function renderEstrelas(valor) {
  estrelasDiv.innerHTML = "";

  for (let i = 1; i <= TOTAL_ESTRELAS; i++) {
    const img = document.createElement("img");
    const filled = i <= valor; // preenche só se usuário votou ou hover
    img.src = filled ? "img/star.png" : "img/nostar.png";
    img.alt = filled ? "Estrela" : "Sem estrela";
    img.style.width = "32px";
    img.style.height = "32px";
    img.style.cursor = "pointer";
    img.dataset.valor = i;
    img.addEventListener("mouseenter", highlightEstrelas);
    img.addEventListener("mouseleave", () => renderEstrelas(valor));
    img.addEventListener("click", votarEstrela);
    estrelasDiv.appendChild(img);
  }
}

function highlightEstrelas(e) {
  const valor = Number(e.target.dataset.valor);
  const imgs = estrelasDiv.querySelectorAll("img");
  imgs.forEach((img, idx) => {
    img.src = idx < valor ? "img/star.png" : "img/nostar.png";
  });
}

async function votarEstrela(e) {
  const nota = Number(e.target.dataset.valor);

  try {
    const res = await fetch(`${API_URL}/votar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota, token: TOKEN }),
    });

    const data = await res.json();

    if (!data.success) {
      votosDiv.textContent = data.error || "Erro ao registrar voto.";
      return;
    }

    localStorage.setItem("votoUsuario", nota);

    buscarAvaliacao();
  } catch (err) {
    votosDiv.textContent = "Erro ao registrar voto.";
  }
}

if (estrelasDiv && votosDiv) {
  buscarAvaliacao();
}

console.log("Site carregado com sucesso!");

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => observer.observe(section));
