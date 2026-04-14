const weatherConfig = {
  0: { label: "Céu Limpo", icon: "☀️", color: "#00d2ff" },
  1: { label: "Quase Limpo", icon: "🌤️", color: "#00d2ff" },
  2: { label: "Parcialmente Nublado", icon: "⛅", color: "#00d2ff" },
  3: { label: "Nublado", icon: "☁️", color: "#00d2ff" },
  45: { label: "Névoa", icon: "🌫️", color: "#a8a8b3" },
  61: { label: "Chuva Fraca", icon: "🌧️", color: "#00d2ff" },
  80: { label: "Pancadas", icon: "🌦️", color: "#00d2ff" },
};

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 Hora
let unidadeAtual = "C";

// Inicialização
document.addEventListener("DOMContentLoaded", carregarMemoriaComFiltro);

document.getElementById("cidadeInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarClimaReal();
  }
});

// --- LÓGICA DE BUSCA ---
async function buscarClimaReal() {
  const input = document.getElementById("cidadeInput");
  const notificacao = document.getElementById("notificacao-container");

  // Limpa mantendo letras, acentos, hífens e espaços
  let buscaOriginal = input.value.trim().normalize("NFC");
  let buscaLimpa = buscaOriginal.replace(/[^a-zA-ZÀ-ÿ\s-]/g, "");

  if (buscaLimpa.length < 2) return;

  notificacao.innerHTML = `<p style="color: #a8a8b3">Localizando...</p>`;

  try {
    const fetchGeo = async (nome) => {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=10&language=pt&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      return data.results || [];
    };

    // 1. Tenta exatamente como o usuário digitou
    let resultados = await fetchGeo(buscaLimpa);

    // 2. Se falhou e tinha hífen, tenta com espaço
    if (resultados.length === 0 && buscaLimpa.includes("-")) {
      resultados = await fetchGeo(buscaLimpa.replace(/-/g, " "));
    }

    // 3. Se falhou e tinha espaço, tenta com hífen
    if (resultados.length === 0 && buscaLimpa.includes(" ")) {
      resultados = await fetchGeo(buscaLimpa.replace(/\s+/g, "-"));
    }

    // 4. Se ainda assim falhou, tenta sem acentos (Fallback Total)
    if (resultados.length === 0) {
      const buscaSemAcento = buscaLimpa
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      resultados = await fetchGeo(buscaSemAcento);
    }

    // Se após todas as tentativas continuar vazio:
    if (resultados.length === 0) {
      throw new Error(`Não encontramos "${buscaOriginal}".`);
    }

    // Renderização dos resultados
    notificacao.innerHTML = '<div class="lista-selecao"></div>';
    const lista = notificacao.querySelector(".lista-selecao");

    resultados.forEach((local) => {
      // 1. Criamos o container do item
      const item = document.createElement("div");
      item.className = "item-local";

      // 2. Criamos o nome da cidade em negrito (Seguro contra XSS)
      const nomeCidade = document.createElement("strong");
      nomeCidade.textContent = local.name;

      // 3. Criamos a quebra de linha
      const quebra = document.createElement("br");

      // 4. Criamos o texto menor com o Estado e País
      const infoGeografica = document.createElement("small");
      infoGeografica.style.color = "#666";
      const estado = local.admin1 ? `${local.admin1}, ` : "";
      infoGeografica.textContent = `${estado}${local.country}`;

      // 5. Colocamos tudo dentro do item (na ordem correta)
      item.append(nomeCidade, quebra, infoGeografica);

      // 6. Lógica de clique para selecionar a cidade
      item.onclick = () => {
        salvarCidadeNaMemoria(local);
        adicionarCardAoGrid(local);
        notificacao.innerHTML = ""; // Aqui pode limpar com string vazia sem problemas
        input.value = "";
      };

      lista.appendChild(item);
    });
  } catch (e) {
    notificacao.innerHTML = `<p style="color: #ff5555">${e.message}</p>`;
  }
}
// --- LÓGICA DE UNIDADE (C/F) ---
function alternarUnidade() {
  unidadeAtual = unidadeAtual === "C" ? "F" : "C";
  const btn = document.getElementById("btnAlternarUnidade");
  if (btn) btn.innerText = `Mudar para °${unidadeAtual === "C" ? "F" : "C"}`;

  const cards = document.querySelectorAll(".weather-box");
  cards.forEach((card) => {
    const tempC = parseFloat(card.getAttribute("data-temp-c"));
    const displayTemp = card.querySelector(".temp-grande");
    if (displayTemp)
      displayTemp.innerText = `${converterValor(tempC)}°${unidadeAtual}`;
  });
}

function converterValor(celsius) {
  if (unidadeAtual === "F") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// --- LÓGICA DE MEMÓRIA (LOCALSTORAGE) ---
function salvarCidadeNaMemoria(local) {
  let salvas = JSON.parse(localStorage.getItem("climaHub_data")) || [];
  const cidadeComTempo = { ...local, timestamp: new Date().getTime() };

  // Evita duplicados pela coordenada
  salvas = salvas.filter(
    (c) => c.latitude !== local.latitude || c.longitude !== local.longitude,
  );
  salvas.push(cidadeComTempo);
  localStorage.setItem("climaHub_data", JSON.stringify(salvas));
  atualizarVisibilidadeControles();
}

function carregarMemoriaComFiltro() {
  let salvas = JSON.parse(localStorage.getItem("climaHub_data")) || [];
  const agora = new Date().getTime();

  // Filtra apenas as que não expiraram
  const validas = salvas.filter((c) => agora - c.timestamp < EXPIRATION_TIME);
  localStorage.setItem("climaHub_data", JSON.stringify(validas));

  validas.forEach((local) => adicionarCardAoGrid(local));
  atualizarVisibilidadeControles();
}

function removerDaMemoria(lat, lon, elementoCard) {
  let salvas = JSON.parse(localStorage.getItem("climaHub_data")) || [];
  salvas = salvas.filter((c) => c.latitude !== lat || c.longitude !== lon);
  localStorage.setItem("climaHub_data", JSON.stringify(salvas));
  elementoCard.remove();
  atualizarVisibilidadeControles();
}

function limparTodaMemoria() {
  localStorage.removeItem("climaHub_data");
  document.getElementById("weather-container").innerHTML = "";
  atualizarVisibilidadeControles();
}

function atualizarVisibilidadeControles() {
  const painel = document.getElementById("controles-painel");
  if (!painel) return;

  const salvas = JSON.parse(localStorage.getItem("climaHub_data")) || [];
  painel.style.display = salvas.length > 0 ? "flex" : "none";
}

// --- RENDERIZAÇÃO DO CARD ---
// --- RENDERIZAÇÃO SEGURA DO CARD ---
async function adicionarCardAoGrid(local) {
  const container = document.getElementById("weather-container");
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current_weather=true`,
    );
    const clm = await res.json();
    const data = clm.current_weather;

    const config = weatherConfig[data.weathercode] || {
      label: "Estável",
      icon: "🌤️",
      color: "#00d2ff",
    };
    const emojiEstado = data.is_day === 1 ? "☀️" : "🌙";
    const subLocal = `${local.admin1 ? local.admin1 + ", " : ""}${local.country}`;

    const card = document.createElement("div");
    card.className = "weather-box";
    card.style.borderTop = `5px solid ${config.color}`;
    card.setAttribute("data-temp-c", data.temperature);

    // CRIANDO ELEMENTOS DE FORMA SEGURA (XSS PROOF)
    const btnFechar = document.createElement("button");
    btnFechar.className = "btn-fechar";
    btnFechar.textContent = "✕";
    btnFechar.onclick = () =>
      removerDaMemoria(local.latitude, local.longitude, card);

    const titulo = document.createElement("h2");
    titulo.style.margin = "0";
    titulo.textContent = local.name; // SEGURO: Mesmo que o nome seja um script, ele aparece como texto.

    const pLocal = document.createElement("p");
    pLocal.className = "local-info";
    pLocal.textContent = subLocal;

    const divTemp = document.createElement("div");
    divTemp.className = "temp-grande";
    divTemp.style.color = config.color;
    divTemp.textContent = `${converterValor(data.temperature)}°${unidadeAtual}`;

    const divEmoji = document.createElement("div");
    divEmoji.style.fontSize = "1.8rem";
    divEmoji.style.margin = "15px 0";
    divEmoji.textContent = emojiEstado;

    const pEstado = document.createElement("p");
    pEstado.style.fontWeight = "bold";
    pEstado.textContent = `${config.label} ${config.icon}`;

    const pVento = document.createElement("p");
    pVento.className = "vento-texto";
    pVento.textContent = `Vento: ${data.windspeed} km/h`;

    // Montando o card (Append)
    card.append(btnFechar, titulo, pLocal, divTemp, divEmoji, pEstado, pVento);

    container.appendChild(card);
    atualizarVisibilidadeControles();
  } catch (e) {
    console.error("Erro ao carregar clima.");
  }
}
