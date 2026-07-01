// VuePress 1.x enhanceApp — Mermaid diagram rendering (browser only)
// Uses CDN-loaded mermaid since webpack 4 can't bundle the ESM-only mermaid package
export default ({ router }) => {
  // Guard: only run Mermaid in browser, skip during SSR (static HTML generation)
  if (typeof window === 'undefined') return;

  // Load mermaid from CDN
  function loadMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@8/dist/mermaid.min.js';
      s.onload = () => {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default' });
        resolve(window.mermaid);
      };
      document.head.appendChild(s);
    });
  }

  const ready = loadMermaid();

  // Render diagrams on each route change
  router.afterEach(() => {
    setTimeout(() => {
      const els = document.querySelectorAll('.mermaid:not(.rendered)');
      if (!els.length) return;
      ready.then(mermaid => {
        els.forEach((el, i) => {
          mermaid.render('m_' + i, el.textContent, (svg) => {
            el.innerHTML = svg;
            el.classList.add('rendered');
          });
        });
      });
    }, 200);
  });
};
