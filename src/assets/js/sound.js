// Optional synthesized UI sounds. No audio files or network requests; disabled unless opted in.
const AC = window.AudioContext || window.webkitAudioContext;
let ctx = null, enabled = false;
const ensure = () => {
  if (!AC) return false;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return true;
};
function tone(f1, f2, dur, gain = .055, type = 'sine', delay = 0) {
  if (!ctx) return;
  const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(40, f2), t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
}
function whoosh() {
  if (!ctx) return;
  const t = ctx.currentTime, n = Math.floor(ctx.sampleRate * .22), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = b; f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(450, t); f.frequency.exponentialRampToValueAtTime(2100, t + .2);
  g.gain.setValueAtTime(.035, t); g.gain.exponentialRampToValueAtTime(.0001, t + .22); s.connect(f).connect(g).connect(ctx.destination); s.start(t);
}
const FX = {
  tap: () => tone(1050, 760, .032, .045, 'triangle'),
  pop: () => tone(540, 920, .075, .05),
  on: () => tone(520, 820, .09, .055),
  off: () => tone(820, 500, .09, .045),
  success: () => { tone(660, 660, .08, .05); tone(990, 990, .13, .05, 'sine', .085); },
  whoosh,
};
function announce() { window.dispatchEvent(new Event('ng-sound')); }
export const sound = {
  get enabled() { return enabled; },
  enable(v) { enabled = !!v; if (enabled) ensure(); try { localStorage.setItem('ng-sound', enabled ? '1' : '0'); } catch (e) {} announce(); },
  wake() { if (enabled) ensure(); },
  play(name) { if (enabled && ctx && FX[name]) { try { FX[name](); } catch (e) {} } },
  remembered() { try { return localStorage.getItem('ng-sound') === '1'; } catch (e) { return false; } },
};
