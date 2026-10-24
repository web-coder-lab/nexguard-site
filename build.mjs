// Static site generator, no dependencies. Usage: node build.mjs  (set SITE_URL for canonical links and sitemap)
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync } from 'fs';
import { md } from './tools/md.mjs';
import { tree } from './tools/tree.mjs';

const R = (p) => readFileSync(p, 'utf8');
const S = 'src', D = 'dist', URL = (process.env.SITE_URL || '').replace(/\/$/, '');
const J = n => JSON.parse(R(`${S}/data/${n}.json`));
const site = J('site'), feats = J('features'), phones = J('phones'), rels = J('releases'), faq = J('faq'), jny = J('journey'), shots = J('screenshots'), perms = J('permissions');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const li = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const icon = n => R(`${S}/icons/${n}.svg`).trim();
const rawBlob = `${site.repo}/blob/${site.tag}/`;
const rd = f => R(`${S}/content/${f}`, 'utf8');

const FI = { 'notification-monitor': 'bell', 'per-app-control': 'apps', 'local-history': 'lock', diagnostics: 'battery', 'phone-guides': 'phone', 'restart-recovery': 'restart', languages: 'globe', themes: 'palette' };
const shot = (s, i) => `<figure class="shot"><button class="frame" data-full="/assets/img/screens/${s.file}.jpg" aria-label="Enlarge: ${s.title}"><img src="/assets/img/screens/${s.file}-sm.jpg" alt="NEXGUARD ${s.title} screen" width="360" height="760" loading="${i < 3 ? 'eager' : 'lazy'}"></button><figcaption><b>${s.title}</b>${s.caption}</figcaption></figure>`;
const brands = phones.map(p => `<a href="/phones/${p.id}/">${p.name}</a>`).join('');
const G = {
  ...site,
  timeline: [2, 6, 10, 14, 18, 24, 28, 34, 78, 84, 90, 94].map((x, i) => `<i style="left:${x}%;height:${40 + (i * 37 % 60)}%;animation-delay:${i * 70}ms"></i>`).join('') + '<div class="gap">silence</div>',
  ogimg: `${URL}/assets/img/icon-512.png`,
  shotsCarousel: shots.map(shot).join(''),
  shotsGrid: shots.map(shot).join(''),
  featureCards: feats.map(f => `<a class="fcard" href="/features/${f.id}/"><span class="fi">${icon(FI[f.id] || 'check')}</span><h3>${f.name}</h3><p>${f.summary}</p><span class="pill st-${f.status}">${f.status}</span></a>`).join(''),
  featureRows: feats.map(f => `<li><a href="/features/${f.id}/"><b>${f.name}</b><span>${f.summary}</span></a><span class="pill st-${f.status}">${f.status}</span></li>`).join(''),
  marquee: brands + brands.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" '),
  brandBig: phones.map(p => `<a href="/phones/${p.id}/">${p.name}<small>${p.tested ? "Matches the developer's phone" : 'General guidance'}</small></a>`).join(''),
  releaseList: rels.map(r => `<h2>Version ${r.v}</h2><p class="note">${r.date || 'Date not recorded'}</p>${li(r.notes)}`).join(''),
  whatsNew: li(rels[0].notes),
  olderReleases: rels.slice(1).map(r => `<li><a href="${site.repo}/releases/tag/v${r.v}">${icon('tag')}v${r.v}</a><span class="muted">${r.date || ''}</span></li>`).join(''),
  faqList: faq.map(q => `<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join(''),
  jBtns: jny.map(s => `<button aria-pressed="false">${s[0]}</button>`).join(''),
  jPanels: jny.map(s => `<div class="bx jp"><h3>${s[0]}</h3><p>${s[1]}</p><p><b>Can NEXGUARD see this?</b> ${s[2]}</p><p style="margin:0"><b>What your history shows:</b> ${s[3]}</p></div>`).join(''),
  permRows: perms.map(p => `<tr><th><code>${p[0]}</code></th><td>${p[1]}</td></tr>`).join(''),
  readmeHtml: md(rd('README.md'), rawBlob), changelogHtml: md(rd('CHANGELOG.md'), rawBlob), securityMd: md(rd('SECURITY.md'), rawBlob),
  fileTree: tree(J('tree'), rawBlob, icon), fileCount: J('tree').length,
};
const inc = (h, c = {}) => h
  .replace(/\{\{inc:([\w-]+)\}\}/g, (_, n) => inc(R(`${S}/partials/${n}.html`, 'utf8'), c))
  .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => icon(n))
  .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in c ? c[k] : k in G ? G[k] : m));
const parse = t => { const [h, ...b] = t.split('\n---\n'), m = {}; h.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) m[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }); return { m, body: b.join('\n---\n') }; };
const urls = [];
function out(file, m, body) {
  const path = m.path, canon = URL ? `<link rel="canonical" href="${URL}${path}">` : '';
  let head = inc(R(`${S}/partials/header.html`, 'utf8'));
  if (path !== '/') head = head.replace(`href="${path}"`, `href="${path}" aria-current="page"`);
  const css = (m.css ? m.css.split(' ') : []).map(c => `<link rel="stylesheet" href="/assets/css/${c}.css">`).join('');
  const pagejs = (m.js ? m.js.split(' ') : []).map(j => `<script type="module" src="/assets/js/${j}.js"></script>`).join('');
  const html = inc(R(`${S}/layouts/base.html`, 'utf8'), { title: m.title, desc: m.desc, canon, pagecss: css, pagejs, scene: m.scene || 'sub', content: body, header: head });
  const f = file || `${D}${path}index.html`; mkdirSync(f.replace(/\/[^/]*$/, ''), { recursive: true }); writeFileSync(f, html);
  if (!file) urls.push(path);
}
rmSync(D, { recursive: true, force: true }); mkdirSync(D); cpSync(`${S}/assets`, `${D}/assets`, { recursive: true });
for (const f of readdirSync(`${S}/pages`)) { const { m, body } = parse(inc(R(`${S}/pages/${f}`, 'utf8'))); out(m.path === '/404/' ? `${D}/404.html` : null, m, body); }
for (const f of feats) { const { m, body } = parse(inc(R(`${S}/templates/feature.html`, 'utf8'), { ...f, details: li(f.details) })); out(null, m, body); }
phones.forEach((p, i) => {
  const n = phones[(i + 1) % phones.length];
  const c = { ...p, steps: `<ol class="steps">${p.steps.map((x, k) => `<li><span class="n">${k + 1}</span><p>${esc(x)}</p></li>`).join('')}</ol>`, status: p.tested ? `<span class="pill st-Available">Matches the developer's phone</span>` : '<span class="pill st-Soon">General guidance, not tested by the developer</span>', noteHtml: p.note ? `<p class="notice">${p.note}</p>` : '', nextId: n.id, nextName: n.name };
  const { m, body } = parse(inc(R(`${S}/templates/phone.html`, 'utf8'), c)); out(null, m, body);
});
if (URL) { writeFileSync(`${D}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${URL}${u}</loc></url>`).join('')}</urlset>`); writeFileSync(`${D}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${URL}/sitemap.xml\n`); }
else writeFileSync(`${D}/robots.txt`, 'User-agent: *\nAllow: /\n');
console.log('built', urls.length, 'pages');
