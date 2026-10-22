// Shared sound control for every page; optional, gentle, and synchronized with the demo player.
import { sound } from './sound.js';
const btn = document.getElementById('gsnd');
const OFF = btn ? btn.innerHTML : '';
const ON = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
function paint() {
  if (!btn) return;
  const on = sound.enabled;
  btn.setAttribute('aria-pressed', String(on));
  btn.setAttribute('aria-label', on ? 'Turn sound effects off' : 'Turn sound effects on');
  btn.title = on ? 'Sound effects on' : 'Sound effects off';
  btn.innerHTML = on ? ON : OFF;
}
if (sound.remembered()) sound.enable(true);
paint(); window.addEventListener('ng-sound', paint);
if (btn) btn.addEventListener('click', () => { sound.wake(); sound.enable(!sound.enabled); if (sound.enabled) { sound.wake(); sound.play('success'); } });
document.addEventListener('click', e => {
  if (!sound.enabled || e.target.closest('.app, #gsnd')) return;
  if (e.target.closest('a,button,[role="button"]')) sound.play('tap');
}, true);
document.addEventListener('pointerdown', () => sound.wake(), { once: true, passive: true });
