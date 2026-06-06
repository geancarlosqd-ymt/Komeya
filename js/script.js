function toggleMenu() {
  const btn = document.getElementById('btn');
  const menu = document.getElementById('menu');
  const open = btn.classList.toggle('is-open');
  menu.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
}

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  const btn = document.getElementById('btn');
  const menu = document.getElementById('menu');
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
});

// Transição de fundo branco para preto ao scrollar (página Sobre)
(function () {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return; // só roda na página Sobre

  const maxScroll = 400;

  // Header/Footer: #1B4D3E para #112920
  const navStart = { r: 27, g: 77, b: 62 };
  const navEnd = { r: 17, g: 41, b: 32 };

  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

  function onScroll() {
    const y = window.scrollY;
    const t = Math.min(1, y / maxScroll);

    // Fundo: branco para preto
    const bg = Math.max(0, Math.round(255 - t * 255));
    document.body.style.backgroundColor = `rgb(${bg}, ${bg}, ${bg})`;

    // Header e Footer: verde para verde escuro profundo
    const r = lerp(navStart.r, navEnd.r, t);
    const g = lerp(navStart.g, navEnd.g, t);
    const b = lerp(navStart.b, navEnd.b, t);
    const navColor = `rgb(${r}, ${g}, ${b})`;
    document.querySelector('header').style.backgroundColor = navColor;
    document.querySelector('footer').style.backgroundColor = navColor;

    // dark-mode a partir de 40%
    if (t > 0.4) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Esconde seta após 80px
    if (y > 80) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// LÓGICA DO MODAL

let servicoAtual = "";

const servicos = {
  "Consulta Veterinária": {
    cachorro: [
      ["Consulta clínica geral", "R$ 120"],
      ["Retorno (até 15 dias)", "R$ 60"],
      ["Consulta de emergência", "R$ 180"],
      ["Consulta domiciliar", "R$ 220"],
      ["Consulta geriátrica", "R$ 140"],
      ["Consulta nutricional", "R$ 110"],
      ["Consulta comportamental", "R$ 130"],
      ["Eutanásia humanizada", "R$ 280"]
    ],
    gato: [
      ["Consulta clínica geral", "R$ 110"],
      ["Retorno (até 15 dias)", "R$ 55"],
      ["Consulta de emergência", "R$ 160"],
      ["Consulta domiciliar", "R$ 200"],
      ["Consulta geriátrica", "R$ 130"],
      ["Consulta nutricional", "R$ 105"],
      ["Consulta comportamental", "R$ 120"],
      ["Eutanásia humanizada", "R$ 230"]
    ]
  },

  "Vacinação": {
    cachorro: [
      ["Vacina V10", "R$ 90"],
      ["Vacina Antirrábica", "R$ 55"],
      ["Vacina Gripe / Bordetella", "R$ 65"],
      ["Vacina Giárdia" , "R$ 70"],
      ["Vacina Leishmaniose" , "R$ 180"],
      ["Vacina FeLV" , "--"],
      ["Vacina FIV" , "--"],
      ["Vacina Calicivírus" , "R$ --"],
      ["Vermifugação" , "R$ 45"],
      ["Antipulgas e carrapatos (dose)" , "R$ 55"],
      ["Microchip (identificação)" , "R$ 90"]
    ],
    gato: [
      ["Vacina V10", "R$ 75"],
      ["Vacina Antirrábica", "R$ 50"],
      ["Vacina Gripe / Bordetella", "--"],
      ["Vacina Giárdia" , "--"],
      ["Vacina Leishmaniose" , "--"],
      ["Vacina FeLV" , "R$ 80"],
      ["Vacina FIV" , "R$ 90"],
      ["Vacina Calicivírus" , "R$ 65"],
      ["Vermifugação" , "R$ 40"],
      ["Antipulgas e carrapatos (dose)" , "R$ 50"],
      ["Microchip (identificação)" , "R$ 90"]
    ]
  },

  "Cirurgia": {
    cachorro: [
      ["Castração macho", "R$ 520"],
      ["Castração fêmea", "R$ 670"],
      ["Cesariana", "R$ 1000"],
      ["Cirurgia ortopédica", "R$ 2000"],
      ["Cirurgia urinária (obstrução)", "--"],
      ["Cirurgia dentária (extração)", "R$ 500"],
      ["Cirurgia de hérnia", "R$ 1400"],
      ["Cirurgia gastrointestinal", "R$ 2000"],
      ["Cirurgia ocular", "R$ 1600"],
      ["Cirurgia de tumor (pequeno)", "R$ 1100"],
      ["Cirurgia de tumor (grande)", "R$ 2200"],
      ["Amputação de membro", "R$ 1800"]
    ],
    gato: [
      ["Castração macho", "R$ 380"],
      ["Castração fêmea", "R$ 500"],
      ["Cesariana", "R$ 880"],
      ["Cirurgia ortopédica", "--"],
      ["Cirurgia urinária (obstrução)", "R$ 1500"],
      ["Cirurgia dentária (extração)", "R$ 460"],
      ["Cirurgia de hérnia", "R$ 1200"],
      ["Cirurgia gastrointestinal", "R$ 1800"],
      ["Cirurgia ocular", "--"],
      ["Cirurgia de tumor (pequeno)", "R$ 950"],
      ["Cirurgia de tumor (grande)", "R$ 1900"],
      ["Amputação de membro", "R$ 1600"]
    ]
  },

  "Higienização": {
    cachorro: [
      ["Banho", "R$ 70"],
      ["Banho + Tosa", "R$ 115"]
    ],
    gato: [
      ["Banho", "R$ 65"],
      ["Banho + Tosa", "R$ 100"]
    ]
  },

  "Exames e Diagnosticos": {
    cachorro: [
      ["Hemograma completo", "R$ 90"],
      ["Bioquímica sérica (perfil)", "R$ 130"],
      ["Ultrassom abdominal", "R$ 210"],
      ["Raio-X (1 projeção)", "R$ 125"],
      ["Raio-X (2 projeções)", "R$ 180"],
      ["Eletrocardiograma",	"R$ 160"],
      ["Ecocardiograma", "R$ 270"],
      ["Endoscopia",	"R$ 500"],
      ["Tomografia (TC)", "R$ 1.200"],
      ["Exame de fezes", "R$ 45"],
      ["Exame de urina (EAS)", "R$ 50"],
      ["Teste FIV/FeLV", "--"],
      ["Citologia",	"R$ 130"],
      ["Teste de alergia cutânea", "R$ 180"],
      ["Pesquisa de hemoparasitas",	"R$ 80"]
    ],
    gato: [
      ["Hemograma completo", "R$ 85"],
      ["Bioquímica sérica (perfil)", "R$ 120"],
      ["Ultrassom abdominal", "R$ 190"],
      ["Raio-X (1 projeção)", "R$ 115"],
      ["Raio-X (2 projeções)", "R$ 165"],
      ["Eletrocardiograma",	"R$ 150"],
      ["Ecocardiograma", "R$ 260"],
      ["Endoscopia",	"R$ 480"],
      ["Tomografia (TC)", "R$ 1.100"],
      ["Exame de fezes", "R$ 40"],
      ["Exame de urina (EAS)", "R$ 45"],
      ["Teste FIV/FeLV", "120"],
      ["Citologia",	"120"],
      ["Teste de alergia cutânea", "--"],
      ["Pesquisa de hemoparasitas",	"R$ 75"]
    ]
  },

  "Terapias e Reabilitação": {
    cachorro: [
      ["Fisioterapia (sessão)", "R$ 130"],
      ["Acupuntura (sessão)", "R$ 150"],
      ["Hidroterapia (sessão)", "R$ 120"],
      ["Laserterapia (sessão)", "R$ 100"],
      ["Quimioterapia (sessão)", "R$ 600"],
      ["Ozonoterapia (sessão)", "R$ 110"],
      ["Homeopatia (consulta)", "R$ 100"]
    ],
    gato: [
      ["Fisioterapia (sessão)", "R$ 120"],
      ["Acupuntura (sessão)", "R$ 140"],
      ["Hidroterapia (sessão)", "--"],
      ["Laserterapia (sessão)", "R$ 90"],
      ["Quimioterapia (sessão)", "R$ 550"],
      ["Ozonoterapia (sessão)", "R$ 100"],
      ["Homeopatia (consulta)", "R$ 95"]
    ]
  }
};

function abrirModal(nomeServico) {
  servicoAtual = nomeServico;
  document.getElementById("modal-servico-nome").textContent = nomeServico;
  document.getElementById("sel-especie").value = "";

  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.body.style.overflow = "";
  resultado.innerHTML = ``;
  resultado.style = ``;
}

// Fecha ao clicar fora do modal
document.getElementById("modal-overlay").addEventListener("click", function (e) {
  if (e.target === this) fecharModal();
});

// Fecha com ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") fecharModal();
});

function atualizarRacas() {
  const especie = document.getElementById("sel-especie").value;
  const resultado = document.getElementById("resultado");

  if (!especie) {
    resultado.style.display = "none";
    resultado.innerHTML = "";
    return;
  }

  const lista = servicos[servicoAtual][especie];

  let html = `
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;">Serviço</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
  `;

  lista.forEach(item => {
    html += `
      <tr>
        <td>${item[0]}</td>
        <td style="text-align:center">${item[1]}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  resultado.innerHTML = html;
  resultado.style.display = "block";
}