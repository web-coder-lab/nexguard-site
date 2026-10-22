// Sticky, scroll-led product story. The phone is the real local HTML replica.
import { createApp } from './demo/app.js';
import { createPilot } from './demo/pilot.js';
const host = document.querySelector('[data-stage]');
if (host) {
  const stage = host.querySelector('.stage'), root = host.querySelector('.app'), fit = host.querySelector('.phone-fit');
  const rot = host.querySelector('.phone-rot'), dev = host.querySelector('.phone-dev');
  const chapters = [...host.querySelectorAll('.ch')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allGranted = { grant: true };
  if (stage && root && fit && rot && dev && chapters.length) {
    const app = createApp(root, {
      onUser: () => pilot.cancel(),
      onTheme: theme => dev.style.setProperty('--sb', theme === 'white' || theme === 'goldwhite' ? '#111' : '#fff'),
    });
    const pilot = createPilot(app, root);
    const poses = [[-18,7],[-12,4],[-7,2],[-14,4],[-9,5],[-17,5],[-6,3],[-20,7]];
    const scenes = [
      { start: { stack: ['home'], ...allGranted }, run: async h => { await h.wait(1050); await h.tap('#shield'); } },
      { start: { stack: ['home'], ...allGranted }, run: async h => { await h.wait(550); await h.tap('#s-home [data-act=stop]'); await h.wait(950); await h.tap('#s-home [data-act=start]'); } },
      { start: { stack: ['home'], ...allGranted }, run: async h => { await h.wait(600); await h.tap('#s-home [data-act=diag]'); await h.wait(1800); await h.tap('#dlg [data-act=diag-close]'); } },
      { start: { stack: ['home','settings'], ...allGranted }, run: async h => { await h.wait(500); await h.scrollTo('#st-scroll','#st-batt',75); } },
      { start: { stack: ['home','settings'], ...allGranted }, run: async h => { await h.wait(550); await h.scrollTo('#st-scroll','#st-mon',75); } },
      { start: { stack: ['home','settings'], ...allGranted }, run: async h => { await h.wait(500); for (let i=0;i<2;i++){ await h.tap('#s-settings [data-act=theme]'); await h.wait(800); } } },
      { start: { stack: ['home','settings','apps'], ...allGranted }, run: async h => { await h.wait(800); await h.tap('#s-apps .ap'); await h.wait(450); await h.tap('#s-apps [data-v=user]'); } },
      { start: { stack: ['home'], ...allGranted }, run: async h => { await h.wait(900); await h.tap('#shield'); } },
    ];
    let current = -1, mouseX = 0, mouseY = 0;
    function fitPhone() {
      const mobile = innerWidth <= 760;
      const scale = mobile ? Math.min(.64, (innerHeight * .49) / 812) : Math.min(1.02, (innerHeight - 88) / 812);
      fit.style.setProperty('--s', Math.max(.45, scale).toFixed(3));
    }
    function pose() {
      const factor = innerWidth <= 760 ? .38 : 1, [ry,rx] = poses[Math.max(0,current)];
      rot.style.transform = `rotateY(${ry * factor + mouseX * 5 * factor}deg) rotateX(${rx * factor - mouseY * 4 * factor}deg)`;
    }
    function go(index) {
      if (index === current || index < 0 || index >= scenes.length) return;
      current = index; stage.dataset.ch = String(index);
      chapters.forEach((chapter,j) => { chapter.classList.toggle('on',j===index); chapter.setAttribute('aria-current',j===index?'step':'false'); });
      pose(); pilot.cancel(); app.setup(scenes[index].start); pilot.resetFinger();
      if (!reduced) pilot.run(async h => { await h.wait(420); await scenes[index].run(h); });
    }
    fitPhone(); pose(); window.addEventListener('resize',()=>{fitPhone();pose();},{passive:true});
    if (!reduced) window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || innerWidth <= 760) return;
      mouseX = e.clientX / innerWidth - .5; mouseY = e.clientY / innerHeight - .5; pose();
    }, {passive:true});
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) go(chapters.indexOf(entry.target)); }), {rootMargin:'-45% 0px -45% 0px'});
      chapters.forEach(chapter => observer.observe(chapter));
    }
    go(0);
  }
}
