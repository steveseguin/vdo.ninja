const ACTIVE_LOADS = new Map();

function buildKey(url, attrs) {
  if (!attrs) return url;
  const attrKey = Object.entries(attrs)
    .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${url}::${attrKey}`;
}

export function loadScript(url, { attributes = {}, timeout = 15000 } = {}) {
  const key = buildKey(url, attributes);
  if (ACTIVE_LOADS.has(key)) {
    return ACTIVE_LOADS.get(key);
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = url;

    Object.entries(attributes || {}).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(name, value);
      }
    });

    let timer = null;
    if (timeout && Number.isFinite(timeout)) {
      timer = window.setTimeout(() => {
        script.remove();
        const error = new Error(`Loading timed out for ${url}`);
        ACTIVE_LOADS.delete(key);
        reject(error);
      }, timeout);
    }

    script.addEventListener('load', () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      ACTIVE_LOADS.delete(key);
      resolve(script);
    });

    script.addEventListener('error', () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      script.remove();
      ACTIVE_LOADS.delete(key);
      reject(new Error(`Failed to load script ${url}`));
    });

    document.head.appendChild(script);
  });

  ACTIVE_LOADS.set(key, promise);
  return promise;
}

export async function loadScriptSequential(urls, options) {
  const sources = Array.isArray(urls) ? urls : [urls];
  let lastError = null;
  for (const entry of sources) {
    const url = typeof entry === 'string' ? entry : entry?.url || entry?.src;
    if (!url) {
      continue;
    }
    const attrs = typeof entry === 'object' && entry !== null ? entry.attributes : undefined;
    try {
      await loadScript(url, {
        ...(options || {}),
        attributes: { ...(options?.attributes || {}), ...(attrs || {}) }
      });
      return url;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('No script sources could be loaded.');
}
