// Markdown-it plugin for Mermaid code blocks
// Renders ```mermaid fences as <div class="mermaid">content</div>
module.exports = function mermaidPlugin(md) {
  const fence = md.renderer.rules.fence;

  md.renderer.rules.fence = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const lang = token.info.trim().split(/\s+/g)[0];

    if (lang === 'mermaid') {
      const content = md.utils.escapeHtml(token.content);
      return `<div class="mermaid">\n${content}\n</div>\n`;
    }

    return fence(tokens, idx, options, env, self);
  };
};
