// Scroll reveal: elements below the fold fade and rise in once. No effect with reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.sec h2, .sec .lead, .bx, .rel, .stats, .tile, .facts, .rows li, .cols3 > *, .info').forEach(el => {
    if (el.closest('.stage, .chs, .app, .phone-dev')) return;
    if (el.getBoundingClientRect().top > innerHeight * .92) { el.classList.add('rv'); io.observe(el); }
  });
}
