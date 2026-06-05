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


  //PARTE DOS SERVIÇOS

  // ══════════════════════════════════════════════════
    // CONFIGURAÇÕES — EDITE POR AQUI
    // ══════════════════════════════════════════════════

    
    const WA_NUMERO = "5531992824699"; 

    // Raças por espécie
    const RACAS = {
      cachorro: [
        "Labrador", "Golden Retriever", "Bulldog", "Poodle",
        "Shih Tzu", "Yorkshire", "Pastor Alemão", "Beagle",
        "Lulu da Pomerânia", "Dachshund", "SRD (Vira-lata)"
      ],
      gato: [
        "Persa", "Siamês", "Maine Coon", "Ragdoll",
        "Bengal", "British Shorthair", "Angorá", "SRD (Vira-lata)"
      ]
    };

    // Tabela de preços base por serviço + espécie
    // Fórmula: preço = base + (peso x fator)
    const PRECOS = {
      "Consulta Veterinária": {
        cachorro: { base: 120, fator: 2 },
        gato:     { base: 110, fator: 1.5 }
      },
      "Vacinação": {
        cachorro: { base: 80,  fator: 1 },
        gato:     { base: 70,  fator: 0.8 }
      },
      "Cirurgia": {
        cachorro: { base: 600, fator: 20 },
        gato:     { base: 500, fator: 15 }
      },
      // Serviços ainda sem nome
      "Higienização": {
        cachorro: { base: 100, fator: 2 },
        gato:     { base: 90,  fator: 1.5 }
      }
    };


    // LÓGICA DO MODAL

    const divExtra = document.getElementById("div-extra");
    let servicoAtual = "";

    function abrirModal(nomeServico) {
      servicoAtual = nomeServico;
      document.getElementById("modal-servico-nome").textContent = nomeServico;
      document.getElementById("sel-especie").value = "";
      document.getElementById("sel-raca").innerHTML = '<option value="">Selecione a espécie primeiro…</option>';
      document.getElementById("inp-peso").value = "";
      document.getElementById("resultado").style.display = "none";

      if(servicoAtual === "Cirurgia"){
        divExtra.innerHTML = `        
        <label for="">Cirurgia</label>
        <select id="sel-tipo-cirurgia">Selecione o tipo de Cirurgia</select>`;
      }

      if(servicoAtual === "Higienização"){
        divExtra.innerHTML = `        
        <label for="">Higienização</label>
        <select id="sel-tipo-higenização">Selecione o tipo de Higienização</select>`;
      }

      const overlay = document.getElementById("modal-overlay");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function fecharModal() {
      document.getElementById("modal-overlay").classList.remove("active");
      document.body.style.overflow = "";
      divExtra.innerHTML = ``;
    }

    // Fecha ao clicar fora do modal
    document.getElementById("modal-overlay").addEventListener("click", function(e) {
      if (e.target === this) fecharModal();
    });

    // Fecha com ESC
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") fecharModal();
    });

    function atualizarRacas() {
      const especie = document.getElementById("sel-especie").value;
      const sel = document.getElementById("sel-raca");
      sel.innerHTML = "";

      if (!especie) {
        sel.innerHTML = '<option value="">Selecione a espécie primeiro…</option>';
        return;
      }

      sel.innerHTML = '<option value="">Selecione a raça…</option>';
      (RACAS[especie] || []).forEach(r => {
        const opt = document.createElement("option");
        opt.value = r;
        opt.textContent = r;
        sel.appendChild(opt);
      });

      document.getElementById("resultado").style.display = "none";
    }

    function calcular() {
      const divCirirgia = document.getElementById("sel-tipo-higenização").value || "A";
      const divHigeniza = document.getElementById("sel-tipo-cirurgia").value || "A";
      const especie = document.getElementById("sel-especie").value;
      const raca    = document.getElementById("sel-raca").value;
      const peso    = parseFloat(document.getElementById("inp-peso").value);

      if (!especie) { alert("Por favor, selecione a espécie."); return; }
      if (!raca)    { alert("Por favor, selecione a raça."); return; }
      if (!peso || peso <= 0) { alert("Por favor, informe um peso válido."); return; }

      // Busca tabela do serviço
      const tabela = PRECOS[servicoAtual] || PRECOS["_default"];
      const cfg    = tabela[especie] || { base: 100, fator: 2 };

      const valor = cfg.base + (peso * cfg.fator);
      const min   = Math.floor(valor * 0.9);
      const max   = Math.ceil(valor * 1.1);

      // Exibe resultado
      document.getElementById("res-valor-texto").textContent =
        `R$ ${min.toFixed(0)} – R$ ${max.toFixed(0)}`;
      document.getElementById("res-obs-texto").textContent =
        `Estimativa para ${especie} (${raca}) de ${peso} kg. Valor exato confirmado na consulta.`;

      const msg = encodeURIComponent(
        `Olá! Gostaria de agendar *${servicoAtual}* para meu(minha) ${especie} da raça ${raca}, com ${peso} kg.\n` +
        `Vi a estimativa de R$ ${min}–R$ ${max} no site. Poderia confirmar disponibilidade?`
      );
      document.getElementById("btn-whatsapp").href =
        `https://wa.me/${WA_NUMERO}?text=${msg}`;

      document.getElementById("resultado").style.display = "block";
    }