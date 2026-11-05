/**
 * Locale detection and URL helpers for the static Angela-Maria site.
 * Load synchronously in <head> before first paint.
 */
(function (global) {
  var STORAGE_KEY = 'angila-locale';
  var SUPPORTED = { en: true, ar: true };

  function normalizePath(path) {
    if (!path || path === '') return '/';
    var p = path.split('?')[0].split('#')[0];
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  function localeFromSearch() {
    var params = new URLSearchParams(global.location.search || '');
    var q = params.get('lang');
    if (q === 'ar' || q === 'en') return q;
    return null;
  }

  function usesCleanLocalePaths() {
    var p = normalizePath(global.location.pathname);
    return p === '/ar' || p.indexOf('/ar/') === 0;
  }

  function detectLocale() {
    var fromQuery = localeFromSearch();
    if (fromQuery) return fromQuery;

    var p = normalizePath(global.location.pathname);
    if (p === '/ar' || p.indexOf('/ar/') === 0) return 'ar';
    return 'en';
  }

  function syncDocumentLocale(locale) {
    var root = document.documentElement;
    root.setAttribute('lang', locale === 'ar' ? 'ar' : 'en');
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }

  var FILE_ROUTES = {
    '/': 'home',
    '/main.html': 'home',
    '/ar': 'home',
    '/shop': 'shop',
    '/shop.html': 'shop',
    '/ar/shop': 'shop',
    '/product': 'product',
    '/product.html': 'product',
    '/ar/product': 'product',
    '/workshops.html': 'workshops',
    '/ar/workshops.html': 'workshops',
    '/workshop-yoga.html': 'workshop-yoga',
    '/ar/workshop-yoga.html': 'workshop-yoga',
    '/workshop-cacao.html': 'workshop-cacao',
    '/ar/workshop-cacao.html': 'workshop-cacao',
    '/workshop-womens-circles.html': 'workshop-circles',
    '/ar/workshop-womens-circles.html': 'workshop-circles',
    '/about.html': 'about',
    '/ar/about.html': 'about',
    '/yoga.html': 'yoga',
    '/ar/yoga.html': 'yoga'
  };

  var PAGE_PATHS = {
    home: { en: '/', ar: '/ar' },
    shop: { en: '/shop', ar: '/ar/shop' },
    product: { en: '/product', ar: '/ar/product' },
    workshops: { en: '/workshops.html', ar: '/ar/workshops.html' },
    'workshop-yoga': { en: '/workshop-yoga.html', ar: '/ar/workshop-yoga.html' },
    'workshop-cacao': { en: '/workshop-cacao.html', ar: '/ar/workshop-cacao.html' },
    'workshop-circles': { en: '/workshop-womens-circles.html', ar: '/ar/workshop-womens-circles.html' },
    about: { en: '/about.html', ar: '/ar/about.html' },
    yoga: { en: '/yoga.html', ar: '/ar/yoga.html' }
  };

  function stripLocalePrefix(path) {
    var p = normalizePath(path);
    if (p === '/ar') return '/';
    if (p.indexOf('/ar/') === 0) return p.slice(3) || '/';
    return p;
  }

  function pathToPageId(path) {
    var bare = stripLocalePrefix(path);
    if (FILE_ROUTES[bare]) return FILE_ROUTES[bare];
    if (bare.indexOf('/product') === 0) return 'product';
    return null;
  }

  function resolveInternalFile(href) {
    var clean = href.split('?')[0].split('#')[0];
    if (clean === '/' || clean === '') return 'home';
    if (clean === '/shop' || clean === 'shop.html') return 'shop';
    if (clean === '/product' || clean === 'product.html') return 'product';
    if (clean === 'workshops.html' || clean === '/workshops.html') return 'workshops';
    if (clean === 'workshop-yoga.html') return 'workshop-yoga';
    if (clean === 'workshop-cacao.html') return 'workshop-cacao';
    if (clean === 'workshop-womens-circles.html') return 'workshop-circles';
    if (clean === 'about.html' || clean === '/about.html') return 'about';
    if (clean === 'yoga.html' || clean === '/yoga.html') return 'yoga';
    if (clean === 'main.html') return 'home';
    return null;
  }

  function withHash(base, hash) {
    if (!hash) return base;
    if (base.indexOf('?') !== -1) return base + hash;
    if (base === '/') return '/' + hash;
    return (base.endsWith('/') ? base : base + '/') + hash;
  }

  function localizeHref(href, locale) {
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return href;
    if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) return href;
    if (href.indexOf('#') === 0) return href;

    var hash = '';
    var query = '';
    var path = href;
    var hashIdx = path.indexOf('#');
    if (hashIdx >= 0) {
      hash = path.slice(hashIdx);
      path = path.slice(0, hashIdx);
    }
    var qIdx = path.indexOf('?');
    if (qIdx >= 0) {
      query = path.slice(qIdx);
      path = path.slice(0, qIdx);
    }

    if (path.indexOf('/#') === 0) {
      path = path.slice(1);
    }

    var barePath = path;
    if (barePath.indexOf('/ar/') === 0) barePath = barePath.slice(3) || '/';
    else if (barePath === '/ar') barePath = '/';

    var pageId = resolveInternalFile(barePath);
    if (pageId && PAGE_PATHS[pageId]) {
      var params = new URLSearchParams(query ? query.slice(1) : '');
      var useClean = usesCleanLocalePaths();
      var targetPath = useClean ? PAGE_PATHS[pageId][locale] : PAGE_PATHS[pageId].en;
      if (!useClean) {
        if (locale === 'ar') params.set('lang', 'ar');
        else params.delete('lang');
      } else {
        params.delete('lang');
      }
      var qs = params.toString();
      return withHash(targetPath + (qs ? '?' + qs : ''), hash);
    }

    if (path.charAt(0) === '#') {
      return href;
    }

    if (path === '/' || path === '') {
      var homeParams = new URLSearchParams(query ? query.slice(1) : '');
      if (usesCleanLocalePaths()) {
        homeParams.delete('lang');
        var cleanHome = locale === 'ar' ? '/ar' : '/';
        var cleanHomeQs = homeParams.toString();
        return withHash(cleanHome + (cleanHomeQs ? '?' + cleanHomeQs : ''), hash);
      }
      if (locale === 'ar') homeParams.set('lang', 'ar');
      else homeParams.delete('lang');
      var homeQs = homeParams.toString();
      return withHash('/' + (homeQs ? '?' + homeQs : ''), hash);
    }

    if (path.indexOf('/') === 0 && path.indexOf('/ar') !== 0) {
      if (usesCleanLocalePaths() && locale === 'ar') return '/ar' + path + query + hash;
      var fallbackParams = new URLSearchParams(query ? query.slice(1) : '');
      if (locale === 'ar') fallbackParams.set('lang', 'ar');
      else fallbackParams.delete('lang');
      var fallbackQs = fallbackParams.toString();
      return path + (fallbackQs ? '?' + fallbackQs : '') + hash;
    }

    if (locale === 'ar' && !usesCleanLocalePaths() && !/^(mailto|tel|javascript):/i.test(href)) {
      var relParams = new URLSearchParams(query ? query.slice(1) : '');
      relParams.set('lang', 'ar');
      var relQs = relParams.toString();
      return path + (relQs ? '?' + relQs : '') + hash;
    }

    return href;
  }

  function swapLocaleUrl(targetLocale) {
    var pageId =
      (document.body && document.body.getAttribute('data-i18n-page')) ||
      pathToPageId(global.location.pathname) ||
      'home';
    var hash = global.location.hash || '';
    var params = new URLSearchParams(global.location.search || '');

    if (usesCleanLocalePaths()) {
      params.delete('lang');
      var cleanBase = PAGE_PATHS[pageId] ? PAGE_PATHS[pageId][targetLocale] : targetLocale === 'ar' ? '/ar' : '/';
      var cleanQs = params.toString();
      return cleanBase + (cleanQs ? '?' + cleanQs : '') + hash;
    }

    var base = PAGE_PATHS[pageId] ? PAGE_PATHS[pageId].en : '/';
    if (targetLocale === 'ar') params.set('lang', 'ar');
    else params.delete('lang');
    var qs = params.toString();
    return base + (qs ? '?' + qs : '') + hash;
  }

  function persistLocale(locale) {
    try {
      global.localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {
      /* ignore */
    }
  }

  function readPersistedLocale() {
    try {
      var v = global.localStorage.getItem(STORAGE_KEY);
      return v && SUPPORTED[v] ? v : null;
    } catch (e) {
      return null;
    }
  }

  var locale = detectLocale();
  global.angilaLocale = locale;
  global.angilaI18n = {
    locale: locale,
    detectLocale: detectLocale,
    syncDocumentLocale: syncDocumentLocale,
    usesCleanLocalePaths: usesCleanLocalePaths,
    stripLocalePrefix: stripLocalePrefix,
    pathToPageId: pathToPageId,
    localizeHref: localizeHref,
    swapLocaleUrl: swapLocaleUrl,
    persistLocale: persistLocale,
    readPersistedLocale: readPersistedLocale,
    pagePaths: PAGE_PATHS
  };

  syncDocumentLocale(locale);
})(window);
