function toggleMenu() {
  const btn  = document.getElementById('btn');
  const menu = document.getElementById('menu');
  const open = btn.classList.toggle('is-open');
  menu.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
}

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  const btn  = document.getElementById('btn');
  const menu = document.getElementById('menu');
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
});

// Transição de fundo branco → preto ao scrollar (página Sobre)
(function () {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return; // só roda na página Sobre

  const maxScroll = 400;

  // Header/Footer: #1B4D3E → #112920
  const navStart = { r: 27, g: 77,  b: 62 };
  const navEnd   = { r: 17, g: 41,  b: 32 };

  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

  function onScroll() {
    const y = window.scrollY;
    const t = Math.min(1, y / maxScroll);

    // Fundo: branco → preto
    const bg = Math.max(0, Math.round(255 - t * 255));
    document.body.style.backgroundColor = `rgb(${bg}, ${bg}, ${bg})`;

    // Header e Footer: verde → verde escuro profundo
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