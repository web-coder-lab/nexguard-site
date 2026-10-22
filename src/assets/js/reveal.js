// Progressive scroll reveal. Content remains visible if IntersectionObserver is unavailable.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced && 'IntersectionObserver' in window) {
  const selectors = '.sec h2,.sec .lead,.bx,.rel,.stats,.tile,.facts,.rows li,.cols3 > *, .info,.platform-card,.status-card,.home-tile,.store-summary,.repo-panel,.final-cta';
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll(selectors).forEach((el, i) => {
    if (el.closest('.stage,.chs,.app,.phone-dev')) return;
    if (el.getBoundingClientRect().top > innerHeight * .92) { el.classList.add('rv'); el.style.setProperty('--reveal-delay', `${Math.min(i % 5, 4) * 55}ms`); io.observe(el); }
  });
}
