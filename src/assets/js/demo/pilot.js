// Cancel-safe guided taps for the on-page HTML replica.
const CANCEL = Symbol('cancel');
export function createPilot(app, root) {
  const finger = root.querySelector('#finger');
  const q = selector => root.querySelector(selector);
  let token = 0, x0 = 180, y0 = 720;
  const scaleOf = () => (root.getBoundingClientRect().width || 360) / 360;
  function helpers(myToken) {
    const alive = () => { if (myToken !== token) throw CANCEL; };
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms)).then(alive);
    async function scrollTo(scrollSelector, targetSelector, offset = 145) {
      const scroller = q(scrollSelector), target = q(targetSelector);
      if (!scroller || !target) return;
      const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
      scroller.scrollTo({ top: Math.max(0, top), behavior: app.motion ? 'smooth' : 'auto' });
      await wait(app.motion ? 820 : 90);
    }
    async function tap(selector) {
      const el = q(selector); if (!el) return;
      alive();
      const scroller = el.closest('.a-scroll');
      if (scroller) {
        const er = el.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
        if (er.bottom > sr.bottom - 10 || er.top < sr.top + 10) await scrollTo(`#${scroller.id}`, selector);
      }
      const bounds = root.getBoundingClientRect(), r = el.getBoundingClientRect(), k = scaleOf();
      const x = (r.left - bounds.left + r.width / 2) / k, y = (r.top - bounds.top + r.height / 2) / k;
      finger.classList.add('show');
      if (typeof finger.animate === 'function') {
        const animation = finger.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x}px,${y}px)` }], {
          duration: app.motion ? 520 : 1, easing: 'cubic-bezier(.2,0,0,1)', fill: 'forwards'
        });
        await animation.finished.catch(() => {});
      } else { finger.style.transform = `translate(${x}px,${y}px)`; await wait(app.motion ? 520 : 1); }
      alive(); x0 = x; y0 = y;
      finger.classList.add('down'); await wait(100); el.click(); await wait(140); finger.classList.remove('down');
    }
    return { wait, tap, scrollTo, alive };
  }
  return {
    async run(fn) {
      const myToken = ++token;
      try { await fn(helpers(myToken)); } catch (error) { if (error !== CANCEL) throw error; }
    },
    cancel() { token++; finger.classList.remove('show', 'down'); if (typeof finger.getAnimations === 'function') finger.getAnimations().forEach(animation => animation.cancel()); },
    resetFinger() { x0 = 180; y0 = 720; },
  };
}
