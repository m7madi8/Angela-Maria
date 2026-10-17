/**
 * Lenis smooth scroll + scroll hooks for the public static site.
 * Skipped when prefers-reduced-motion or Lenis is unavailable.
 */
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touchOnly =
    matchMedia('(hover: none) and (pointer: coarse)').matches &&
    !matchMedia('(min-width: 1024px)').matches;

  function scrollY() {
    return window.angilaLenis ? window.angilaLenis.scroll : window.scrollY;
  }

  window.angilaScrollY = scrollY;

  window.angilaOnScroll = function (fn) {
    if (typeof fn !== 'function') return;
    if (window.angilaLenis) {
      window.angilaLenis.on('scroll', function (e) {
        fn(e.scroll);
      });
    } else {
      window.addEventListener(
        'scroll',
        function () {
          fn(window.scrollY);
        },
        { passive: true }
      );
    }
  };

  function skipSmoothScroll() {
    var body = document.body;
    if (body && body.classList.contains('shop-page')) return true;
    var path = (location.pathname || '').replace(/\/$/, '');
    var base = path.split('/').pop() || '';
    if (base === 'workshops.html' || path === '/workshops') return true;
    return false;
  }

  if (reduced || touchOnly || typeof window.Lenis !== 'function' || skipSmoothScroll()) {
    return;
  }

  if (window.angilaLenis) return;

  var lenis = new Lenis({
    autoRaf: true,
    lerp: 0.12,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
    wheelMultiplier: 0.9
  });

  window.angilaLenis = lenis;

  var scrollEndTimer;
  lenis.on('scroll', function () {
    document.documentElement.classList.add('is-scrolling');
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(function () {
      document.documentElement.classList.remove('is-scrolling');
    }, 140);
  });

  var menuObserver = new MutationObserver(function () {
    if (document.body.classList.contains('menu-open')) lenis.stop();
    else lenis.start();
  });
  menuObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('pagehide', function () {
    menuObserver.disconnect();
    lenis.destroy();
    window.angilaLenis = null;
  });
})();
