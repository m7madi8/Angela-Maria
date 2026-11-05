/**
 * Applies translations, localized links, SEO tags, and the language switcher.
 */
(function (global) {
  var i18n = global.ANGILA_I18N;
  var api = global.angilaI18n;
  if (!i18n || !api) return;

  var locale = api.detectLocale();
  api.locale = locale;
  global.angilaLocale = locale;
  if (typeof api.syncDocumentLocale === 'function') {
    api.syncDocumentLocale(locale);
  }

  function t(key) {
    var bucket = i18n.strings[locale] || i18n.strings.en;
    if (bucket[key] != null) return bucket[key];
    return i18n.strings.en[key] || '';
  }

  function applyMeta(pageId) {
    var pack = i18n.meta[pageId];
    if (!pack) return;
    var copy = pack[locale] || pack.en;
    if (!copy) return;
    if (copy.title) document.title = copy.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && copy.description) desc.setAttribute('content', copy.description);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && copy.ogTitle) ogTitle.setAttribute('content', copy.ogTitle);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && copy.ogDescription) ogDesc.setAttribute('content', copy.ogDescription);
  }

  function applyBinding(entry) {
    document.querySelectorAll(entry.sel).forEach(function (el) {
      if (entry.waMsg && entry.msgKey) {
        var msg = t(entry.msgKey);
        if (msg) el.setAttribute('data-wa-msg', msg);
        return;
      }
      var value = t(entry.key);
      if (!value) return;
      if (entry.attr) {
        el.setAttribute(entry.attr, value);
        return;
      }
      if (entry.html) {
        el.innerHTML = value;
        return;
      }
      if (entry.keepSvg && el.querySelector('svg')) {
        var svg = el.querySelector('svg').outerHTML;
        el.innerHTML = svg + value;
        return;
      }
      el.textContent = value;
    });
  }

  function applyPageBindings(pageId) {
    var map = global.ANGILA_I18N_BINDINGS;
    if (!map || !map[pageId]) return;
    map[pageId].forEach(applyBinding);
  }

  function applyNodes() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (!key) return;
      el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      raw.split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length < 2) return;
        var attr = parts[0].trim();
        var key = parts.slice(1).join(':').trim();
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  function patchLinks(root) {
    var scope = root || document;
    scope.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var next = api.localizeHref(href, locale);
      if (next !== href) a.setAttribute('href', next);
    });
  }

  function injectHreflang(pageId) {
    var paths = api.pagePaths[pageId];
    if (!paths) return;
    var origin = global.location.origin;
    var search = global.location.search || '';
    var hash = global.location.hash || '';
    [['en', paths.en], ['ar', paths.ar]].forEach(function (entry) {
      var link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = entry[0];
      link.href = origin + entry[1] + search + hash;
      document.head.appendChild(link);
    });
    var x = document.createElement('link');
    x.rel = 'alternate';
    x.hreflang = 'x-default';
    x.href = origin + paths.en + search + hash;
    document.head.appendChild(x);

    var canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = origin + paths[locale] + search + hash;
    document.head.appendChild(canonical);
  }

  function mountLanguageSwitch() {
    var host = document.getElementById('lang-switch');
    if (!host) return;
    host.hidden = false;
    host.className = 'lang-switch';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', t('lang.label'));

    var list = document.createElement('ul');
    list.className = 'lang-switch__list';

    [['en', 'lang.en'], ['ar', 'lang.ar']].forEach(function (item) {
      var code = item[0];
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = api.swapLocaleUrl(code);
      a.hreflang = code;
      a.lang = code;
      a.textContent = t(item[1]);
      if (code === locale) {
        a.setAttribute('aria-current', 'page');
      }
      a.addEventListener('click', function () {
        api.persistLocale(code);
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    host.appendChild(list);
  }

  function applyWaMessages() {
    var wa = global.ANGILA_SITE_I18N;
    if (!wa || !wa[locale]) return;
    Object.keys(wa[locale]).forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.setAttribute('data-wa-msg', wa[locale][selector]);
      });
    });
  }

  function run() {
    var pageId = (document.body && document.body.getAttribute('data-i18n-page')) || 'home';
    applyMeta(pageId);
    applyPageBindings(pageId);
    applyNodes();
    applyWaMessages();
    patchLinks(document);
    injectHreflang(pageId);
    mountLanguageSwitch();

    global.angilaT = t;
    global.dispatchEvent(new CustomEvent('angilaI18nReady', { detail: { locale: locale, pageId: pageId } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})(window);
