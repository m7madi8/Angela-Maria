import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = {
  'main.html': 'home',
  'shop.html': 'shop',
  'product.html': 'product',
  'workshops.html': 'workshops',
  'workshop-yoga.html': 'workshop-yoga',
  'workshop-cacao.html': 'workshop-cacao',
  'workshop-womens-circles.html': 'workshop-circles',
};

const headInsert =
  '<script src="site-i18n-locale.js"></script>\n<link rel="stylesheet" href="site-i18n-rtl.css">';

const i18nScripts = [
  '<script src="site-i18n-strings.js"></script>',
  '<script src="site-i18n-bindings.js"></script>',
  '<script src="site-i18n-wa.js"></script>',
  '<script src="site-i18n.js"></script>',
].join('\n');

const shopExtra = [
  '<script src="shop-i18n-strings.js"></script>',
  '<script src="shop-data-i18n.js"></script>',
].join('\n');

for (const [file, page] of Object.entries(pages)) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('site-i18n-locale.js')) {
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${headInsert}`);
  }

  html = html.replace(/<body([^>]*)>/, (match, attrs) => {
    if (attrs.includes('data-i18n-page')) return match;
    return `<body${attrs} data-i18n-page="${page}">`;
  });

  if (!html.includes('id="lang-switch"')) {
    html = html.replace(
      /(<div class="nav-actions">)/,
      '$1\n<div class="lang-switch" id="lang-switch" hidden></div>',
    );
  }

  if (!html.includes('site-i18n-strings.js')) {
    const needsShop = file === 'main.html' || file === 'shop.html' || file === 'product.html';
    const block = needsShop ? `${i18nScripts}\n${shopExtra}` : i18nScripts;

    if (html.includes('<script src="shop-config.js"></script>')) {
      html = html.replace('<script src="shop-config.js"></script>', `${block}\n<script src="shop-config.js"></script>`);
    } else if (html.includes('<script src="workshops.js"></script>')) {
      html = html.replace('<script src="workshops.js"></script>', `${block}\n<script src="workshops.js"></script>`);
    }
  }

  fs.writeFileSync(filePath, html);
}

console.log('Patched HTML files for i18n.');
