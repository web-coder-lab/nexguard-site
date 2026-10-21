// Minimal Markdown to HTML converter for the repository docs (headings, lists, tables, code, links).
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function md(src, base = '') {
  const abs = u => (/^(https?:|mailto:|#)/.test(u) ? u : base + u);
  const inl = s => esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, a, u) => (/^https?:/.test(u) ? `<img src="${u}" alt="${a}">` : ''))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${abs(u)}">${t}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(?<![*\w])\*([^*\n]+)\*(?![*\w])/g, '<i>$1</i>');
  const L = src.replace(/\r/g, '').split('\n'); const out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^```/.test(l)) { const b = []; i++; while (i < L.length && !/^```/.test(L[i])) b.push(L[i++]); i++; out.push(`<pre><code>${esc(b.join('\n'))}</code></pre>`); continue; }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)/))) { out.push(`<h${m[1].length} id="${slug(m[2])}">${inl(m[2])}</h${m[1].length}>`); i++; continue; }
    if (/^\|/.test(l) && /^\|[\s:|-]+\|?\s*$/.test(L[i + 1] || '')) {
      const row = r => r.replace(/^\||\|\s*$/g, '').split('|').map(c => c.trim());
      const h = row(l); i += 2; const rows = [];
      while (i < L.length && /^\|/.test(L[i])) rows.push(row(L[i++]));
      out.push(`<div class="tw"><table><thead><tr>${h.map(c => `<th>${inl(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    if (/^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)) {
      const ord = /^\s*\d+\./.test(l), it = [];
      while (i < L.length && (/^\s*[-*]\s+/.test(L[i]) || /^\s*\d+\.\s+/.test(L[i]))) it.push(L[i++].replace(/^\s*([-*]|\d+\.)\s+/, ''));
      out.push(`<${ord ? 'ol' : 'ul'}>${it.map(x => `<li>${inl(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`); continue;
    }
    if (/^>\s?/.test(l)) { const b = []; while (i < L.length && /^>\s?/.test(L[i])) b.push(L[i++].replace(/^>\s?/, '')); out.push(`<blockquote>${inl(b.join(' '))}</blockquote>`); continue; }
    if (!l.trim()) { i++; continue; }
    const p = []; while (i < L.length && L[i].trim() && !/^(#{1,4}\s|```|\||\s*[-*]\s|\s*\d+\.\s|>)/.test(L[i])) p.push(L[i++]);
    const html = inl(p.join(' ')); if (html.trim()) out.push(`<p>${html}</p>`);
  }
  return out.join('\n');
}
