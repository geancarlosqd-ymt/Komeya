function toggleMenu() {
  const btn  = document.getElementById('btn');
  const menu = document.getElementById('menu');
  const open = btn.classList.toggle('is-open');
  menu.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open);
}

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  const btn  = document.getElementById('btn');
  const menu = document.getElementById('menu');
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }
});