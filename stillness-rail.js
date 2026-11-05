/**
 * Homepage Stillness Rail — editorial panels + GSAP horizontal scrub (desktop).
 */
(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isMobile() {
    return matchMedia('(max-width: 900px)').matches;
  }

  function shopApi() {
    return window.angilaShopPublic || {};
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function featuredProducts(limit) {
    var data = window.ANGILA_SHOP || { products: [] };
    var items = data.products.filter(function (p) {
      return p.published !== false && p.featured;
    });
    if (!items.length) {
      items = data.products.filter(function (p) {
        return p.published !== false;
      });
    }
    return items.slice(0, limit || 4);
  }

  function piecePanel(product, index) {
    var api = shopApi();
    var img = product.images && product.images[0] ? product.images[0] : '';
    var focus = product.imageFocus ? ' style="object-position:' + product.imageFocus + '"' : '';
    var num = String(index + 1).padStart(2, '0');
    var href = api.productUrl ? api.productUrl(product.slug) : 'product.html?slug=' + encodeURIComponent(product.slug);
    var cat = api.categoryLabel ? api.categoryLabel(product.category) : product.category;
    var price = api.formatPrice ? api.formatPrice(product) : '';
    return (
      '<a class="stillness-rail__piece stillness-rail__panel" href="' +
      escapeHtml(href) +
      '" role="listitem">' +
      '<span class="stillness-rail__index">' +
      num +
      '</span>' +
      '<figure class="stillness-rail__media"><img src="' +
      escapeHtml(img) +
      '" alt="' +
      escapeHtml(product.name) +
      '" loading="eager" decoding="async" fetchpriority="high"' +
      focus +
      '></figure>' +
      '<div class="stillness-rail__copy">' +
      '<span class="stillness-rail__cat">' +
      escapeHtml(cat) +
      '</span>' +
      '<h3>' +
      escapeHtml(product.name) +
      '</h3>' +
      (product.shortDescription
        ? '<p class="stillness-rail__desc">' + escapeHtml(product.shortDescription) + '</p>'
        : '') +
      '<span class="stillness-rail__price">' +
      escapeHtml(price) +
      '</span>' +
      '</div></a>'
    );
  }

  function applyRailI18n(root) {
    if (typeof window.angilaT !== 'function') return;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = window.angilaT(key);
    });
    if (window.angilaI18n && window.angilaI18n.localizeHref) {
      var loc = window.angilaLocale || 'en';
      root.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href) a.setAttribute('href', window.angilaI18n.localizeHref(href, loc));
      });
    }
  }

  function buildRail(products) {
    var track = document.getElementById('stillness-rail-track');
    if (!track) return;

    var verse =
      '<article class="stillness-rail__panel stillness-rail__panel--verse" role="listitem">' +
      '<p class="stillness-rail__line" data-i18n="stillness.p1"></p>' +
      '<p class="stillness-rail__line stillness-rail__line--dim" data-i18n="stillness.p2"></p>' +
      '</article>';

    var pieces = products
      .map(function (p, i) {
        return piecePanel(p, i);
      })
      .join('');

    var finale =
      '<article class="stillness-rail__panel stillness-rail__panel--finale" role="listitem">' +
      '<div class="stillness-actions">' +
      '<a class="btn" href="shop.html" data-i18n="home.stillness.explore">Explore the collection</a>' +
      '<a class="link" href="shop.html#shop-story" data-i18n="home.stillness.howMade">How they’re made</a>' +
      '</div></article>';

    track.innerHTML = verse + pieces + finale;
    applyRailI18n(track);
    document.dispatchEvent(new CustomEvent('angilaStillnessRailBuilt'));
  }

  var railTween = null;

  function killRailMotion() {
    if (railTween) {
      if (railTween.scrollTrigger) railTween.scrollTrigger.kill();
      railTween.kill();
      railTween = null;
    }
    var track = document.getElementById('stillness-rail-track');
    if (track && typeof gsap !== 'undefined') gsap.set(track, { clearProps: 'transform' });
    var hint = document.getElementById('stillness-rail-hint');
    if (hint) hint.style.opacity = '';
  }

  function whenTrackImagesReady(track, cb, maxWaitMs) {
    var wait = maxWaitMs == null ? 2800 : maxWaitMs;
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      cb();
    }
    var imgs = track.querySelectorAll('.stillness-rail__media img');
    if (!imgs.length) {
      finish();
      return;
    }
    var left = imgs.length;
    function step() {
      left -= 1;
      if (left <= 0) finish();
    }
    imgs.forEach(function (img) {
      if (img.complete) step();
      else {
        img.addEventListener('load', step, { once: true });
        img.addEventListener('error', step, { once: true });
      }
    });
    setTimeout(finish, wait);
  }

  function initRailMotion() {
    if (REDUCED || isMobile()) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var pin = document.getElementById('stillness-rail-pin');
    var stage = document.querySelector('.stillness-rail__stage');
    var track = document.getElementById('stillness-rail-track');
    if (!pin || !stage || !track) return;

    killRailMotion();
    gsap.registerPlugin(ScrollTrigger);

    var stDefaults = window.angilaLenis ? { scroller: document.documentElement } : {};

    function getScrollWidth() {
      return Math.max(0, track.scrollWidth - stage.clientWidth);
    }

    railTween = gsap.to(track, {
      x: function () {
        return -getScrollWidth();
      },
      ease: 'none',
      scrollTrigger: Object.assign(
        {
          trigger: pin,
          start: 'top top',
          end: function () {
            return '+=' + Math.max(getScrollWidth(), 1);
          },
          pin: true,
          scrub: 0.72,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var hint = document.getElementById('stillness-rail-hint');
            if (hint) hint.style.opacity = String(Math.max(0, 1 - self.progress * 1.12));
          }
        },
        stDefaults
      )
    });

    document.dispatchEvent(new CustomEvent('angilaStillnessRailReady'));
    ScrollTrigger.refresh();
  }

  window.angilaBuildStillnessRail = function (products) {
    buildRail(products && products.length ? products : featuredProducts(4));
    var track = document.getElementById('stillness-rail-track');
    if (!track) return;
    requestAnimationFrame(function () {
      if (!REDUCED && !isMobile()) initRailMotion();
    });
    whenTrackImagesReady(track, function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  };

  document.addEventListener('angilaI18nReady', function () {
    var track = document.getElementById('stillness-rail-track');
    if (track) applyRailI18n(track);
  });

  document.addEventListener('angilaStillnessRailBuilt', function () {
    var map = window.ANGILA_I18N_BINDINGS;
    if (!map || !map.home) return;
    map.home.forEach(function (entry) {
      if (entry.sel && entry.sel.indexOf('stillness-actions') !== -1) {
        document.querySelectorAll(entry.sel).forEach(function (el) {
          var value = typeof window.angilaT === 'function' ? window.angilaT(entry.key) : '';
          if (value) el.textContent = value;
        });
      }
    });
  });

  window.addEventListener('resize', function () {
    if (!document.getElementById('stillness-rail-track')) return;
    killRailMotion();
    if (!isMobile() && !REDUCED) initRailMotion();
  });

  matchMedia('(max-width: 900px)').addEventListener('change', function () {
    killRailMotion();
    if (!isMobile() && !REDUCED) initRailMotion();
  });
})();
