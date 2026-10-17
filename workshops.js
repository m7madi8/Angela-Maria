(function () {
  var nav = document.getElementById('nav');
  var sheet = document.getElementById('nav-sheet');
  var menuBtn = document.getElementById('menu-btn');
  var veil = document.getElementById('nav-veil');
  var menuPanel = sheet && sheet.querySelector('.nav-sheet__panel');
  var menuClosing = false;

  function setMenu(open) {
    if (open) {
      menuClosing = false;
      sheet.classList.remove('closing');
      sheet.classList.add('o');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      sheet.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      var f = sheet.querySelector('.nav-sheet__list a');
      f && f.focus({ preventScroll: true });
      return;
    }
    if (!sheet.classList.contains('o') || menuClosing) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sheet.classList.remove('o', 'closing');
      sheet.setAttribute('aria-hidden', 'true');
      return;
    }
    menuClosing = true;
    sheet.classList.add('closing');
    sheet.classList.remove('o');
  }

  function finishMenuClose() {
    if (!menuClosing) return;
    menuClosing = false;
    sheet.classList.remove('closing');
    sheet.setAttribute('aria-hidden', 'true');
  }

  if (menuPanel) {
    menuPanel.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'clip-path' && menuClosing) finishMenuClose();
    });
    menuPanel.addEventListener('transitioncancel', function (e) {
      if (e.propertyName === 'clip-path' && menuClosing) finishMenuClose();
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!sheet.classList.contains('o') && !menuClosing);
    });
  }
  if (veil) veil.addEventListener('click', function () { setMenu(false); });
  if (sheet) {
    sheet.querySelectorAll('.nav-sheet__list a,.nav-sheet__foot .nav-cta').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet.classList.contains('o')) {
      setMenu(false);
      menuBtn && menuBtn.focus();
    }
  });
  matchMedia('(min-width:861px)').addEventListener('change', function (m) {
    if (m.matches) setMenu(false);
  });

  if (nav) {
    var syncNav = function (y) {
      nav.classList.toggle('s', y > 60);
    };
    if (typeof window.angilaOnScroll === 'function') {
      window.angilaOnScroll(syncNav);
      syncNav(typeof window.angilaScrollY === 'function' ? window.angilaScrollY() : window.scrollY);
    } else {
      addEventListener(
        'scroll',
        function () {
          syncNav(window.scrollY);
        },
        { passive: true }
      );
    }
  }

  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('v');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add('v'); });
  }
})();
