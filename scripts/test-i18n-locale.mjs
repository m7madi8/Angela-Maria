import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadLocale(pathname, search) {
  const sandbox = {
    window: {},
    document: { documentElement: { setAttribute() {} } },
    location: { pathname, search: search || '', hash: '' },
    URLSearchParams: globalThis.URLSearchParams,
  };
  sandbox.window = sandbox;
  const src = fs.readFileSync(new URL('../site-i18n-locale.js', import.meta.url), 'utf8');
  vm.runInNewContext(src, sandbox);
  return sandbox.window.angilaI18n;
}

const root = loadLocale('/', '');
assert.equal(root.locale, 'en');
assert.equal(loadLocale('/', '?lang=ar').locale, 'ar');
assert.equal(loadLocale('/ar', '').locale, 'ar');
assert.equal(root.localizeHref('shop.html', 'ar'), '/shop?lang=ar');

const arClean = loadLocale('/ar', '');
assert.equal(arClean.localizeHref('/ar/shop', 'en'), '/shop');
assert.equal(arClean.localizeHref('/#courses', 'ar'), '/ar/#courses');

const arQuery = loadLocale('/', '?lang=ar');
assert.equal(arQuery.localizeHref('/#courses', 'ar'), '/?lang=ar#courses');

console.log('i18n locale helpers OK');
