/**
 * Lightweight view transitions for internal navigation (supported browsers only).
 */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!document.startViewTransition) return;

  function sameOrigin(href) {
    try {
      var u = new URL(href, location.href);
      return u.origin === location.origin;
    } catch (e) {
      return false;
    }
  }

  function isInternalNav(a) {
    if (a.target && a.target !== '_self') return false;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('#') === 0) return false;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;
    if (href.indexOf('http') === 0 && !sameOrigin(href)) return false;
    return true;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || !isInternalNav(a)) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

    var href = a.href;
    if (href === location.href) return;

    ev.preventDefault();
    document.startViewTransition(function () {
      location.href = href;
    });
  });
})();
