(function () {
  var SITE = window.ANGILA_SITE || { waPhone: '', waDefault: '', igHandle: '' };
  var CFG = window.ANGILA_SHOP_CONFIG || {};
  var DATA = window.ANGILA_SHOP || { categories: [], products: [] };

  var IMAGE_SIZE = {
    'images/mini-store/01.JPG': [1536, 2048],
    'images/mini-store/02.JPG': [1536, 2048],
    'images/mini-store/03.JPG': [1536, 2048],
    'images/mini-store/04.JPG': [1536, 2048],
    'images/mini-store/05.JPG': [1772, 1772],
    'images/mini-store/06.JPG': [1772, 1772],
    'images/mini-store/07.JPG': [1536, 2048],
    'images/mini-store/08.JPG': [1330, 2364],
    'images/mini-store/09.JPG': [1638, 2048],
    'images/mini-store/10.JPG': [2308, 1536],
    'images/mini-store/11.JPG': [2308, 1536],
    'images/mini-store/12.JPG': [1536, 2308]
  };

  function phoneDigits() {
    return SITE.waPhone ? String(SITE.waPhone).replace(/\D/g, '') : '';
  }

  function igName() {
    return SITE.igHandle ? String(SITE.igHandle).replace(/^@/, '') : '';
  }

  function waLink(msg) {
    var m = msg || SITE.waDefault;
    var phone = phoneDigits();
    var shop = document.body.classList.contains('shop-page');
    if (!phone && shop) {
      return document.getElementById('contact') ? '#contact' : '/#contact';
    }
    if (!phone && (!m || m === SITE.waDefault)) {
      var c = document.getElementById('contact');
      if (c) return '#contact';
    }
    var base = phone ? 'https://wa.me/' + phone : 'https://wa.me/';
    return base + '?text=' + encodeURIComponent(m);
  }

  function igLink() {
    var name = igName();
    return name ? 'https://instagram.com/' + name : 'https://instagram.com/';
  }

  function contactLede(piece, phone) {
    if (phone) return piece ? 'Ask me about ' + piece + '.' : 'A piece, a session, a question.';
    return piece
      ? 'Ask me about ' + piece + '. WhatsApp isn’t linked here yet.'
      : 'Ask me directly. WhatsApp isn’t linked here yet.';
  }

  function bindContact() {
    var phone = phoneDigits();
    var shop = document.body.classList.contains('shop-page');
    var ig = igName();

    document.querySelectorAll('[data-contact="wa"]').forEach(function (a) {
      if (shop && a.hasAttribute('data-wa-direct')) a.hidden = !phone;
      a.href = waLink(a.getAttribute('data-wa-msg'));
      a.setAttribute('rel', 'noopener');
      if (a.getAttribute('href').indexOf('http') === 0) a.setAttribute('target', '_blank');
      else a.removeAttribute('target');
    });

    document.querySelectorAll('[data-contact="ig"]').forEach(function (a) {
      if (shop) a.hidden = !ig;
      a.href = igLink();
      a.setAttribute('rel', 'noopener noreferrer');
      if (ig) a.setAttribute('target', '_blank');
    });

    document.querySelectorAll('[data-inquire]').forEach(function (a) {
      a.textContent = phone ? 'Inquire on WhatsApp' : 'Ask about this piece';
    });

    if (!shop) return;

    var actions = document.getElementById('contact-actions');
    if (actions) actions.hidden = !(phone || ig);
    var lede = document.getElementById('contact-lede');
    if (lede) lede.textContent = contactLede(document.body.getAttribute('data-inquiry') || '', phone);
  }

  function formatPrice(product) {
    if (product.price == null || product.price === '') return 'Price on request';
    try {
      return new Intl.NumberFormat(CFG.locale || 'en-GB', {
        style: 'currency',
        currency: CFG.currency || 'EUR',
        maximumFractionDigits: 0
      }).format(product.price);
    } catch (e) {
      return product.price + ' ' + (CFG.currency || 'EUR');
    }
  }

  function productUrl(slug) {
    return 'product.html?slug=' + encodeURIComponent(slug);
  }

  function getProduct(slug) {
    return DATA.products.find(function (p) {
      return p.slug === slug;
    });
  }

  function publishedProducts() {
    return DATA.products.filter(function (p) {
      return p.published !== false;
    });
  }

  function categoriesWithProducts() {
    var prods = publishedProducts();
    return DATA.categories.filter(function (cat) {
      return prods.some(function (p) {
        return p.category === cat.id;
      });
    });
  }

  function categoryLabel(id) {
    var c = DATA.categories.find(function (x) {
      return x.id === id;
    });
    return c ? c.label : id;
  }

  function countLabel(n) {
    return n + (n === 1 ? ' piece' : ' pieces');
  }

  function catalogIntro(filterId) {
    if (!filterId || filterId === 'all') {
      return 'Each piece, one of a kind. Ask me.';
    }
    var cat = DATA.categories.find(function (c) {
      return c.id === filterId;
    });
    return cat && cat.intro
      ? cat.intro
      : 'Ask me.';
  }

  function waProductMsg(product) {
    return (
      "Hi Angela-Maria, I'd like to inquire about \"" +
      product.name +
      '" from The Art of Stillness.'
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sizeOf(src) {
    return IMAGE_SIZE[src] || null;
  }

  function absUrl(path) {
    try {
      return new URL(path, location.href).href;
    } catch (e) {
      return path;
    }
  }

  function upsertJsonLd(id, data) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  var SLUG_ALIASES = {
    'natural-feather-dreamcatcher': 'turquoise-sage-dreamcatcher',
    'teal-dreamcatcher': 'teal-tiered-dreamcatcher',
    'sage-dreamcatcher': 'sage-tiered-dreamcatcher'
  };

  function resolveSlug(slug) {
    return SLUG_ALIASES[slug] || slug;
  }

  function productCardHtml(product, opts) {
    opts = opts || {};
    var focus = product.imageFocus ? ' style="object-position:' + product.imageFocus + '"' : '';
    var img = product.images && product.images[0] ? product.images[0] : '';
    var avail =
      product.available === false
        ? '<span class="shop-pcard__link">Currently unavailable</span>'
        : '<span class="shop-pcard__link">View piece →</span>';
    var cls = 'shop-pcard rv' + (product.available === false ? ' shop-pcard--soon' : '');
    if (product.layout === 'feature') cls += ' shop-pcard--feature';
    if (opts.compact) cls += ' shop-pcard--compact';

    return (
      '<a class="' +
      cls +
      '" href="' +
      productUrl(product.slug) +
      '">' +
      '<div class="shop-pcard__media">' +
      '<img src="' +
      escapeHtml(img) +
      '" alt="' +
      escapeHtml(product.name) +
      '" loading="lazy" decoding="async"' +
      focus +
      '>' +
      '</div>' +
      '<div class="shop-pcard__body">' +
      '<span class="shop-pcard__cat">' +
      escapeHtml(categoryLabel(product.category)) +
      '</span>' +
      '<h3>' +
      escapeHtml(product.name) +
      '</h3>' +
      '<p class="shop-pcard__desc">' +
      escapeHtml(product.shortDescription || '') +
      '</p>' +
      '<div class="shop-pcard__foot">' +
      '<span class="shop-pcard__price">' +
      escapeHtml(formatPrice(product)) +
      '</span>' +
      avail +
      '</div>' +
      '</div></a>'
    );
  }

  function pointsHtml(product) {
    if (!product.points || !product.points.length) return '';
    return (
      '<ul class="shop-pd__points">' +
      product.points
        .map(function (point) {
          return '<li>' + escapeHtml(point) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }

  function pieceHtml(product, mode, flip) {
    var src = product.images && product.images[0] ? product.images[0] : '';
    var size = sizeOf(src);
    var land = size && size[0] > size[1];
    var cls = 'shop-piece shop-piece--' + mode;
    if (flip) cls += ' shop-piece--flip';
    if (land) cls += ' shop-piece--land';
    if (product.available === false) cls += ' shop-piece--soon';
    var dims = size ? ' width="' + size[0] + '" height="' + size[1] + '"' : '';
    var blurb = product.shortDescription || '';
    var view = product.available === false ? 'Currently unavailable' : 'View piece';
    var alt = product.name;

    return (
      '<article class="' +
      cls +
      '">' +
      '<a class="shop-piece__link" href="' +
      productUrl(product.slug) +
      '">' +
      '<figure class="shop-piece__media"' +
      (size ? ' style="aspect-ratio:' + size[0] + ' / ' + size[1] + '"' : '') +
      '>' +
      '<img src="' +
      escapeHtml(src) +
      '" alt="' +
      escapeHtml(alt) +
      '"' +
      dims +
      ' loading="lazy" decoding="async">' +
      '</figure>' +
      '<div class="shop-piece__copy">' +
      '<p class="shop-piece__cat">' +
      escapeHtml(categoryLabel(product.category)) +
      '</p>' +
      '<h3 class="shop-piece__name">' +
      escapeHtml(product.name) +
      '</h3>' +
      (blurb ? '<p class="shop-piece__desc">' + escapeHtml(blurb) + '</p>' : '') +
      '<p class="shop-piece__row">' +
      '<span class="shop-piece__price">' +
      escapeHtml(formatPrice(product)) +
      '</span>' +
      '<span class="shop-piece__view">' +
      escapeHtml(view) +
      '</span>' +
      '</p></div></a></article>'
    );
  }

  function railPrice(product) {
    if (product.price == null || product.price === '') return 'On request';
    return formatPrice(product);
  }

  function railCardHtml(product) {
    var src = product.images && product.images[0] ? product.images[0] : '';
    var soon = product.available === false ? ' shop-card--soon' : '';
    return (
      '<a class="shop-card' +
      soon +
      '" href="' +
      productUrl(product.slug) +
      '">' +
      '<figure class="shop-card__media">' +
      '<img src="' +
      escapeHtml(src) +
      '" alt="' +
      escapeHtml(product.name) +
      '" loading="lazy" decoding="async">' +
      '</figure>' +
      '<h3 class="shop-card__name">' +
      escapeHtml(product.name) +
      '</h3>' +
      '<p class="shop-card__price">' +
      escapeHtml(railPrice(product)) +
      '</p></a>'
    );
  }

  function galleryHtml(items) {
    if (!items.length) {
      return '<p class="shop-empty">Nothing here yet. <a href="#contact">Ask me</a>.</p>';
    }
    return (
      '<div class="shop-rail">' +
      '<div class="shop-rail__nav">' +
      '<button type="button" class="shop-rail__btn" data-dir="-1" aria-label="Previous pieces">Prev</button>' +
      '<button type="button" class="shop-rail__btn" data-dir="1" aria-label="Next pieces">Next</button>' +
      '</div>' +
      '<div class="shop-rail__track" tabindex="0" role="region" aria-label="Pieces">' +
      items.map(railCardHtml).join('') +
      '</div></div>'
    );
  }

  var railResizeBound = false;

  function bindShopRail(root) {
    if (!root) return;
    var track = root.querySelector('.shop-rail__track');
    var prev = root.querySelector('[data-dir="-1"]');
    var next = root.querySelector('[data-dir="1"]');
    if (!track) return;
    function distance() {
      var card = track.querySelector('.shop-card');
      if (!card) return Math.round(track.clientWidth * 0.8);
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return card.offsetWidth + gap;
    }
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var overflow = max > 8;
      var nav = root.querySelector('.shop-rail__nav');
      if (nav) nav.hidden = !overflow;
      if (!overflow) return;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    function go(dir) {
      track.scrollBy({ left: dir * distance(), behavior: 'auto' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('scroll', sync, { passive: true });
    root._syncRail = sync;
    if (!railResizeBound) {
      railResizeBound = true;
      addEventListener('resize', function () {
        document.querySelectorAll('.shop-rail').forEach(function (el) {
          if (el._syncRail) el._syncRail();
        });
      });
    }
    sync();
  }

  var activeFilter = 'all';

  function filteredProducts() {
    var items = publishedProducts();
    if (activeFilter && activeFilter !== 'all') {
      items = items.filter(function (p) {
        return p.category === activeFilter;
      });
    }
    return items;
  }

  function rememberFilter(id) {
    if (!document.getElementById('shop-filters')) return;
    try {
      var url = new URL(location.href);
      if (!id || id === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', id);
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  function updateCatalogChrome(items) {
    var count = document.getElementById('shop-catalog-count');
    if (count) count.textContent = countLabel(items.length);
    var lede = document.getElementById('shop-catalog-lede');
    if (lede) lede.textContent = catalogIntro(activeFilter);
    var status = document.getElementById('shop-status');
    if (status) status.textContent = countLabel(items.length) + ' shown';
  }

  function updateHeroMeta() {
    var el = document.getElementById('shop-hero-meta');
    if (!el) return;
    var items = publishedProducts();
    if (!items.length) {
      el.textContent = 'Pieces are being prepared';
      return;
    }
    var priced = items.some(function (p) {
      return p.price != null && p.price !== '';
    });
    var label = countLabel(items.length);
    el.textContent = priced ? label : label + ' · Price on request';
  }

  function renderCatalogGrid(container) {
    if (!container) return;
    var items = filteredProducts();
    updateCatalogChrome(items);
    container.innerHTML = galleryHtml(items);
    bindShopRail(container.querySelector('.shop-rail'));
  }

  function renderFilters(nav) {
    if (!nav) return;
    var cats = categoriesWithProducts();
    if (cats.length < 2) {
      nav.hidden = true;
      return;
    }
    nav.hidden = false;
    var buttons =
      '<button type="button" class="shop-filter' +
      (activeFilter === 'all' ? ' is-active' : '') +
      '" data-filter="all" aria-pressed="' +
      (activeFilter === 'all' ? 'true' : 'false') +
      '">All</button>' +
      cats
        .map(function (c) {
          var on = activeFilter === c.id;
          return (
            '<button type="button" class="shop-filter' +
            (on ? ' is-active' : '') +
            '" data-filter="' +
            escapeHtml(c.id) +
            '" aria-pressed="' +
            (on ? 'true' : 'false') +
            '">' +
            escapeHtml(c.label) +
            '</button>'
          );
        })
        .join('');
    nav.innerHTML = buttons;
    nav.querySelectorAll('.shop-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter') || 'all';
        nav.querySelectorAll('.shop-filter').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        rememberFilter(activeFilter);
        renderCatalogGrid(document.getElementById('shop-catalog-mount'));
        btn.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      });
    });
  }

  function renderCatalog(container) {
    if (!container) return;
    if (!publishedProducts().length) {
      container.innerHTML =
        '<p class="shop-empty">Pieces are on their way. <a href="#contact">Ask me</a>.</p>';
      updateCatalogChrome([]);
      return;
    }
    renderCatalogGrid(container);
  }

  function writeShopJsonLd() {
    if (!document.getElementById('shop-catalog-mount')) return;
    var items = publishedProducts();
    upsertJsonLd('shop-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: (CFG.shopName || 'The Art of Stillness') + ' — Angela-Maria',
      numberOfItems: items.length,
      itemListElement: items.map(function (p, i) {
        var img = p.images && p.images[0] ? absUrl(p.images[0]) : undefined;
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.shortDescription || undefined,
            image: img,
            category: categoryLabel(p.category),
            brand: { '@type': 'Brand', name: 'Angela-Maria' },
            url: absUrl(productUrl(p.slug))
          }
        };
      })
    });
  }

  function renderFeatured(container) {
    if (!container) return;
    var items = publishedProducts().filter(function (p) {
      return p.featured;
    });
    if (!items.length) items = publishedProducts();
    items = items.slice(0, 3);
    container.innerHTML =
      '<div class="shop-editorial-grid stillness-grid">' +
      items
        .map(function (p) {
          return productCardHtml(p);
        })
        .join('') +
      '</div>';
    observeReveal(container.querySelectorAll('.rv'));
  }

  function renderProductPage(mount) {
    if (!mount) return;
    var params = new URLSearchParams(location.search);
    var slug = params.get('slug');
    if (slug) slug = resolveSlug(slug);
    var product = slug ? getProduct(slug) : null;

    if (!product || product.published === false) {
      document.title = 'Piece not found — Angela-Maria';
      document.body.removeAttribute('data-inquiry');
      mount.innerHTML =
        '<div class="wrap shop-not-found">' +
        '<h1>This piece isn’t here.</h1>' +
        '<p class="lede" style="margin:1rem auto 0">It may have sold. Browse the collection.</p>' +
        '<div class="actions" style="justify-content:center">' +
        '<a class="btn" href="shop.html">Back to the shop</a></div></div>';
      return;
    }

    document.title = product.name + ' — The Art of Stillness — Angela-Maria';
    document.body.setAttribute('data-inquiry', product.name);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', product.shortDescription || '');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', product.name + ' — Angela-Maria');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', product.shortDescription || '');

    var imgs = product.images && product.images.length ? product.images : [];
    var img = imgs[0] || '';
    var size = sizeOf(img);
    var dims = size ? ' width="' + size[0] + '" height="' + size[1] + '"' : '';
    var alt = product.name;
    var thumbs =
      imgs.length > 1
        ? '<div class="shop-pd__thumbs" role="group" aria-label="More photographs">' +
          imgs
            .map(function (src, i) {
              var thumbSize = sizeOf(src);
              var thumbDims = thumbSize ? ' width="' + thumbSize[0] + '" height="' + thumbSize[1] + '"' : '';
              return (
                '<button type="button" class="shop-pd__thumb' +
                (i === 0 ? ' is-active' : '') +
                '" data-src="' +
                escapeHtml(src) +
                '" aria-label="Show photograph ' +
                (i + 1) +
                ' of ' +
                imgs.length +
                '" aria-pressed="' +
                (i === 0 ? 'true' : 'false') +
                '"><img src="' +
                escapeHtml(src) +
                '" alt=""' +
                thumbDims +
                ' loading="lazy" decoding="async"></button>'
              );
            })
            .join('') +
          '</div>'
        : '';

    var avail =
      product.available === false
        ? '<p class="shop-pd__avail is-out">Sold — ask to be told when one returns.</p>'
        : '<p class="shop-pd__avail">Made to order</p>';
    var note = 'We confirm together. No checkout.';

    var specs = '';
    if (product.materials) specs += '<div><dt>Materials</dt><dd>' + escapeHtml(product.materials) + '</dd></div>';
    if (product.dimensions) specs += '<div><dt>Dimensions</dt><dd>' + escapeHtml(product.dimensions) + '</dd></div>';
    if (product.care) specs += '<div><dt>Care</dt><dd>' + escapeHtml(product.care) + '</dd></div>';

    var related = publishedProducts()
      .filter(function (p) {
        return p.slug !== product.slug && p.category === product.category;
      })
      .slice(0, 2);
    if (related.length < 2) {
      publishedProducts().some(function (p) {
        if (p.slug === product.slug) return false;
        if (related.some(function (r) { return r.slug === p.slug; })) return false;
        related.push(p);
        return related.length >= 2;
      });
    }

    var relatedHtml = related.length
      ? '<div class="shop-pd__more"><h2>More from the collection</h2>' + galleryHtml(related) + '</div>'
      : '';

    var contactBtn = document.querySelector('#contact [data-wa-direct]');
    if (contactBtn) contactBtn.setAttribute('data-wa-msg', waProductMsg(product));

    mount.innerHTML =
      '<article class="wrap shop-pd">' +
      '<nav class="shop-pd__crumb" aria-label="Breadcrumb">' +
      '<a href="shop.html">Shop</a>' +
      '<span aria-hidden="true"> / </span>' +
      '<a href="shop.html?category=' +
      encodeURIComponent(product.category) +
      '">' +
      escapeHtml(categoryLabel(product.category)) +
      '</a>' +
      '</nav>' +
      '<div class="shop-pd__grid">' +
      '<div class="shop-pd__gallery">' +
      '<figure class="shop-pd__main-img">' +
      '<img id="shop-pd-main-img" src="' +
      escapeHtml(img) +
      '" alt="' +
      escapeHtml(alt) +
      '"' +
      dims +
      ' fetchpriority="high" decoding="async">' +
      '</figure>' +
      thumbs +
      '</div>' +
      '<div class="shop-pd__meta">' +
      '<p class="meta">' +
      escapeHtml(categoryLabel(product.category)) +
      '</p>' +
      '<h1>' +
      escapeHtml(product.name) +
      '</h1>' +
      '<p class="shop-pd__price">' +
      escapeHtml(formatPrice(product)) +
      '</p>' +
      avail +
      (product.shortDescription
        ? '<p class="shop-pd__lead">' + escapeHtml(product.shortDescription) + '</p>'
        : '') +
      pointsHtml(product) +
      '<div class="shop-pd__actions">' +
      '<a class="btn" href="#contact" data-inquire data-contact="wa" data-wa-msg="' +
      escapeHtml(waProductMsg(product)) +
      '">Ask about this piece</a>' +
      '</div>' +
      '<p class="shop-pd__note">' +
      escapeHtml(note) +
      '</p>' +
      (specs ? '<div class="shop-pd__specs"><h2>Details</h2><dl>' + specs + '</dl></div>' : '') +
      '</div></div>' +
      relatedHtml +
      '</article>';

    bindShopRail(mount.querySelector('.shop-rail'));

    var mainImg = mount.querySelector('#shop-pd-main-img');
    mount.querySelectorAll('.shop-pd__thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-src');
        if (mainImg && src) {
          mainImg.src = src;
          var next = sizeOf(src);
          if (next) {
            mainImg.width = next[0];
            mainImg.height = next[1];
          }
        }
        mount.querySelectorAll('.shop-pd__thumb').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });

    upsertJsonLd('product-jsonld', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription || undefined,
          image: imgs.map(absUrl),
          category: categoryLabel(product.category),
          brand: { '@type': 'Brand', name: 'Angela-Maria' },
          url: absUrl(productUrl(product.slug))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Shop', item: absUrl('shop.html') },
            {
              '@type': 'ListItem',
              position: 2,
              name: categoryLabel(product.category),
              item: absUrl('shop.html?category=' + encodeURIComponent(product.category))
            },
            { '@type': 'ListItem', position: 3, name: product.name, item: absUrl(productUrl(product.slug)) }
          ]
        }
      ]
    });
  }

  function observeReveal(els) {
    if (!els || !els.length) return;
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
      els.forEach(function (e) {
        io.observe(e);
      });
    } else {
      els.forEach(function (e) {
        e.classList.add('v');
      });
    }
  }

  function initNav() {
    if (!document.body.classList.contains('shop-page')) return;
    var nav = document.getElementById('nav');
    var sheet = document.getElementById('nav-sheet');
    var menuBtn = document.getElementById('menu-btn');
    var veil = document.getElementById('nav-veil');
    var menuPanel = sheet && sheet.querySelector('.nav-sheet__panel');
    var menuClosing = false;

    function setMenu(open) {
      if (!sheet || !menuBtn) return;
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
      if (!menuClosing || !sheet) return;
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
    if (veil) veil.addEventListener('click', function () {
      setMenu(false);
    });
    if (sheet) {
      sheet.querySelectorAll('.nav-sheet__list a,.nav-sheet__foot .nav-cta').forEach(function (a) {
        a.addEventListener('click', function () {
          setMenu(false);
        });
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet && sheet.classList.contains('o')) {
        setMenu(false);
        menuBtn && menuBtn.focus();
      }
    });
    matchMedia('(min-width:861px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
    if (nav) {
      var pinNav = document.body.classList.contains('product-page');
      var syncNav = function () {
        nav.classList.toggle('s', pinNav || scrollY > 60);
      };
      syncNav();
      addEventListener('scroll', syncNav, { passive: true });
    }
  }

  function init() {
    initNav();

    var filters = document.getElementById('shop-filters');
    if (filters) {
      var start = new URLSearchParams(location.search).get('category');
      if (
        start &&
        categoriesWithProducts().some(function (c) {
          return c.id === start;
        })
      ) {
        activeFilter = start;
      }
      renderFilters(filters);
    }

    updateHeroMeta();

    var catalog = document.getElementById('shop-catalog-mount');
    if (catalog) {
      renderCatalog(catalog);
      writeShopJsonLd();
    }

    var featured = document.getElementById('stillness-featured');
    if (featured && !featured.hasAttribute('data-static')) renderFeatured(featured);

    var productMount = document.getElementById('product-mount');
    if (productMount) renderProductPage(productMount);

    bindContact();
    observeReveal(document.querySelectorAll('.rv:not(.v)'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
