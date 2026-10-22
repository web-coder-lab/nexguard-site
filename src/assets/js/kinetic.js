// Headline word reveal. Existing inline styling is preserved; reduced-motion users see plain text.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-kinetic]').forEach(head => {
    if (head.dataset.kineticReady) return;
    head.dataset.kineticReady = '1';
    head.setAttribute('aria-label', head.textContent.trim().replace(/\s+/g, ' '));
    let delay = 0;
    const walk = node => [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const words = child.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        words.forEach(word => {
          if (!word.trim()) { frag.append(document.createTextNode(word)); return; }
          const span = document.createElement('span'); span.className = 'wd'; span.setAttribute('aria-hidden', 'true');
          span.style.animationDelay = `${delay++ * 65}ms`; span.textContent = word; frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    });
    walk(head);
  });
}
