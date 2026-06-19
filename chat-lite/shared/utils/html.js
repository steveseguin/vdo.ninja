const FALLBACK_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function encodeHtmlFallback(text) {
  return String(text ?? '').replace(/[&<>"']/g, (char) => FALLBACK_ENTITIES[char] || char);
}

function createScratchElement() {
  if (typeof document !== 'undefined' && document?.createElement) {
    return document.createElement('div');
  }
  return null;
}

export function safeHtml(value) {
  const scratch = createScratchElement();
  if (!scratch) {
    return encodeHtmlFallback(value);
  }
  scratch.textContent = value ?? '';
  return scratch.innerHTML;
}

export function htmlToText(html) {
  const scratch = createScratchElement();
  if (!scratch) {
    if (html == null) {
      return '';
    }
    return String(html).replace(/<[^>]*>/g, '');
  }
  scratch.innerHTML = html ?? '';
  return scratch.textContent || '';
}
