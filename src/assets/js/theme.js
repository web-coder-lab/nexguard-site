const btn = document.getElementById('theme');
if (btn) {
  const paint = () => { const light = document.documentElement.dataset.theme === 'light'; btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); btn.setAttribute('aria-pressed', String(light)); };
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ng-theme', next); } catch (e) {}
    paint();
  });
  paint();
}
