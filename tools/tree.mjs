// Renders a nested, collapsible file tree with links to the tagged source on GitHub.
const fmt = s => (s < 1024 ? s + ' B' : s < 1048576 ? (s / 1024).toFixed(1) + ' KB' : (s / 1048576).toFixed(1) + ' MB');
export function tree(list, base, icon) {
  const root = {};
  for (const f of list) { let n = root; const parts = f.p.split('/'); parts.forEach((x, i) => { n = n[x] ??= i === parts.length - 1 ? { __f: f.s } : {}; }); }
  const isDir = n => n.__f === undefined;
  const rec = (n, path, depth) => Object.keys(n).filter(k => k !== '__f')
    .sort((a, b) => (isDir(n[a]) === isDir(n[b]) ? a.localeCompare(b) : isDir(n[a]) ? -1 : 1))
    .map(k => { const c = n[k], p = path ? `${path}/${k}` : k;
      return isDir(c)
        ? `<li><details${depth < 1 ? ' open' : ''}><summary>${icon('folder')}${k}/</summary><ul>${rec(c, p, depth + 1)}</ul></details></li>`
        : `<li class="fl"><a href="${base}${p}">${icon('file')}${k}</a><small>${fmt(c.__f)}</small></li>`; }).join('');
  return `<ul class="tree">${rec(root, '', 0)}</ul>`;
}
