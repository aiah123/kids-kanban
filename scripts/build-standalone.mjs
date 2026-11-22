import { readFileSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const readAsset = (path) => readFileSync(new URL(path, dist));

const page = readAsset('index.html').toString();
const scripts = [...page.matchAll(/<script type="module" crossorigin src="\/(assets\/[^"]+\.js)"><\/script>/g)];
const styles = [...page.matchAll(/<link rel="stylesheet" crossorigin href="\/(assets\/[^"]+\.css)">/g)];

if (scripts.length !== 1 || styles.length !== 1) {
  throw new Error('Expected one bundled script and one stylesheet in the Vite build.');
}

const [scriptTag, scriptPath] = scripts[0];
const [styleTag, stylePath] = styles[0];
const markup = page
  .replace(scriptTag, '<!-- standalone:script -->')
  .replace(styleTag, '<!-- standalone:style -->')
  .replace(/href="\/(icons\/[^"]+\.png)"/g, (_, path) =>
    `href="data:image/png;base64,${readAsset(path).toString('base64')}"`)
  .replace(/<link rel="manifest"[^>]*>|<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/g, '');

if (/\b(?:src|href)\s*=\s*["'](?!data:|#)/i.test(markup)) {
  throw new Error('The standalone HTML still references an external file.');
}

const script = readAsset(scriptPath).toString();
const style = readAsset(stylePath).toString();
const cssUrls = [...style.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)];
const hasExternalCssUrl = cssUrls.some(([, , url]) => !/^(?:data:|#)/i.test(url.trim()));
if (/<\/script\b/i.test(script) || /<\/style\b|@import\b/i.test(style) || hasExternalCssUrl) {
  throw new Error('The build contains content that cannot safely be inlined.');
}

const html = markup
  .replace('<!-- standalone:script -->', () => `<script type="module">${script}</script>`)
  .replace('<!-- standalone:style -->', () => `<style>${style}</style>`);

writeFileSync(new URL('kids-kanban.html', dist), html);
