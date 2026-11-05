(function (global) {
  function shared() {
    return [
      { sel: 'a.skip', key: 'skip.main' },
      { sel: '#nav .nav-links a[href*="yoga.html"]', key: 'nav.yoga' },
      { sel: '#nav .nav-links a[href*="workshops.html"]', key: 'nav.experiences' },
      { sel: '#nav .nav-links a[href="#workshops"]', key: 'nav.experiences' },
      { sel: '#nav .nav-links a[href="#oneone"], #nav .nav-links a[href*="#oneone"]', key: 'nav.oneone' },
      { sel: '#nav .nav-links a[href*="shop.html"], #nav .nav-links a[href*="/shop"]', key: 'nav.shop' },
      { sel: '#nav .nav-links a[href*="about.html"], #nav .nav-links a[href="#about"]', key: 'nav.about' },
      { sel: '.nav-sheet__list a[href*="yoga.html"]', key: 'nav.yoga' },
      { sel: '.nav-sheet__list a[href*="workshops.html"]', key: 'nav.experiences' },
      { sel: '.nav-sheet__list a[href="#workshops"]', key: 'nav.experiences' },
      { sel: '.nav-sheet__list a[href*="#oneone"]', key: 'nav.mobileOneone' },
      { sel: '.nav-sheet__list a[href*="shop.html"], .nav-sheet__list a[href*="/shop"]', key: 'nav.shop' },
      { sel: '.nav-sheet__list a[href*="#about"]', key: 'nav.about' },
      { sel: '.nav-sheet__list a[href="#contact"]', key: 'nav.sayHello' },
      { sel: '#nav .logo', key: 'nav.logoAria', attr: 'aria-label' },
      { sel: '#menu-btn', key: 'nav.openMenu', attr: 'aria-label' },
      { sel: '.nav-sheet__social a[data-contact="wa"]', key: 'social.whatsapp', keepSvg: true },
      { sel: '.nav-sheet__social a[data-contact="ig"]', key: 'social.instagram' },
      { sel: '#contact .contact-social a[data-contact="ig"]', key: 'social.instagram' },
      { sel: '#contact .contact-social a.btn-wa', key: 'social.whatsapp', keepSvg: true }
    ];
  }

  var pages = {
    home: shared().concat([
      { sel: '#nav .nav-cta', key: 'nav.bookSession' },
      { sel: '.nav-sheet__foot .nav-cta', key: 'nav.bookSession' },
      { sel: '#hero .hx-line:nth-child(1) span', key: 'home.hero.line1' },
      { sel: '#hero .hx-line:nth-child(2) span', key: 'home.hero.line2' },
      { sel: '#hero .hx-lede', key: 'home.hero.lede' },
      { sel: '#hero .hx-cta', key: 'home.hero.ctaBook' },
      { sel: '#hero .hx-link', key: 'home.hero.ctaWays' },
      { sel: '#hero img', key: 'home.hero.imgAlt', attr: 'alt' },
      { sel: '#workshops .ws-kicker', key: 'home.ws.kicker' },
      { sel: '#workshops-title', key: 'home.ws.title' },
      { sel: '#workshops .ws-intro', key: 'home.ws.intro', html: true },
      { sel: '#ws-swipe', key: 'home.ws.swipe', html: true },
      { sel: '#ws-cards', key: 'home.ws.cardsLabel', attr: 'aria-label' },
      { sel: '#workshops .gt-card--yoga img', key: 'home.card.yoga.alt', attr: 'alt' },
      { sel: '#workshops .gt-card--yoga .gt-card__t', key: 'home.card.yoga.title' },
      { sel: '#workshops .gt-card--yoga .gt-card__p', key: 'home.card.yoga.body' },
      { sel: '#workshops .gt-card--yoga .gt-card__cta', key: 'home.card.yoga.cta' },
      { sel: '#workshops .gt-card--cacao img', key: 'home.card.cacao.alt', attr: 'alt' },
      { sel: '#workshops .gt-card--cacao .gt-card__t', key: 'home.card.cacao.title' },
      { sel: '#workshops .gt-card--cacao .gt-card__p', key: 'home.card.cacao.body' },
      { sel: '#workshops .gt-card--cacao .gt-card__cta', key: 'home.card.cacao.cta' },
      { sel: '#workshops .gt-card--circles img', key: 'home.card.circles.alt', attr: 'alt' },
      { sel: '#workshops .gt-card--circles .gt-card__t', key: 'home.card.circles.title' },
      { sel: '#workshops .gt-card--circles .gt-card__p', key: 'home.card.circles.body' },
      { sel: '#workshops .gt-card--circles .gt-card__cta', key: 'home.card.circles.cta' },
      { sel: '#workshops .actions .link', key: 'home.ws.allGatherings' },
      { sel: '#philosophy .home-philosophy__kicker', key: 'home.philosophy.kicker' },
      { sel: '#philosophy .home-philosophy__quote', key: 'home.philosophy.lead' },
      { sel: '#philosophy .home-philosophy__body p', key: 'home.philosophy.p2' },
      { sel: '#philosophy .home-philosophy__more', key: 'home.philosophy.more' },
      { sel: '#oneone-title', key: 'home.oneone.title' },
      { sel: '#oneone .lede', key: 'home.oneone.lede' },
      { sel: '#oneone .bullets li:nth-child(1)', key: 'home.oneone.b1' },
      { sel: '#oneone .bullets li:nth-child(2)', key: 'home.oneone.b2' },
      { sel: '#oneone .bullets li:nth-child(3)', key: 'home.oneone.b3' },
      { sel: '#oneone .btn', key: 'home.oneone.book' },
      { sel: '#oneone img', key: 'home.oneone.imgAlt', attr: 'alt' },
      { sel: '#about .ab-kicker', key: 'home.about.kicker' },
      { sel: '#about-title', key: 'home.about.title' },
      { sel: '#about .home-about-teaser p', key: 'home.about.teaser' },
      { sel: '#about .home-about-teaser .link', key: 'home.about.read' },
      { sel: '#about img', key: 'home.about.imgAlt', attr: 'alt' },
      { sel: '#stillness .kick', key: 'home.stillness.kick' },
      { sel: '#stillness-title', key: 'home.stillness.title' },
      { sel: '#stillness .stillness-head .lede', key: 'home.stillness.lede' },
      { sel: '#stillness-rail-track', key: 'home.stillness.featured', attr: 'aria-label' },
      { sel: '#stillness-rail-hint', key: 'home.stillness.scrollHint' },
      { sel: '#stillness .stillness-actions .btn', key: 'home.stillness.explore' },
      { sel: '#stillness .stillness-actions .link', key: 'home.stillness.howMade' },
      { sel: '#contact-title', key: 'home.contact.title' },
      { sel: '#contact .lede', key: 'home.contact.lede' },
      { sel: '#dock .btn', key: 'home.dock.cta' }
    ]),
    workshops: shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.bookSession' },
      { sel: '#hero .kick', key: 'workshops.hero.kick' },
      { sel: '#page-title .l1 .mi', key: 'workshops.hero.title1' },
      { sel: '#page-title .l2 .mi', key: 'workshops.hero.title2' },
      { sel: '#hero .pg__lede', key: 'workshops.hero.lede' },
      { sel: '#hero img', key: 'workshops.hero.imgAlt', attr: 'alt' },
      { sel: '#gatherings .kick', key: 'workshops.list.kick' },
      { sel: '#gatherings-title', key: 'workshops.list.title' },
      { sel: '#gatherings .gt-card--yoga .gt-card__t', key: 'home.card.yoga.title' },
      { sel: '#gatherings .gt-card--yoga .gt-card__p', key: 'home.card.yoga.body' },
      { sel: '#gatherings .gt-card--yoga .gt-card__cta', key: 'workshops.card.yoga.cta' },
      { sel: '#gatherings .gt-card--cacao .gt-card__t', key: 'home.card.cacao.title' },
      { sel: '#gatherings .gt-card--cacao .gt-card__p', key: 'home.card.cacao.body' },
      { sel: '#gatherings .gt-card--cacao .gt-card__cta', key: 'workshops.card.cacao.cta' },
      { sel: '#gatherings .gt-card--circles .gt-card__t', key: 'home.card.circles.title' },
      { sel: '#gatherings .gt-card--circles .gt-card__p', key: 'home.card.circles.body' },
      { sel: '#gatherings .gt-card--circles .gt-card__cta', key: 'workshops.card.circles.cta' },
      { sel: '#ws-practical-title', key: 'workshops.practical.title' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(1) .pg-practical__k', key: 'workshops.practical.formatK' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(1) .pg-practical__v', key: 'workshops.practical.formatV' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(2) .pg-practical__k', key: 'workshops.practical.programsK' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(2) .pg-practical__v', key: 'workshops.practical.programsV' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(3) .pg-practical__k', key: 'workshops.practical.bookingK' },
      { sel: '#ws-practical .pg-practical__list li:nth-child(3) .pg-practical__v', key: 'workshops.practical.bookingV' },
      { sel: '#contact-title', key: 'shared.contact.title' },
      { sel: '#contact .lede', key: 'workshops.contact.lede' }
    ]),
    about: shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.bookSession' },
      { sel: '#about-hero-title', key: 'about.hero.title' },
      { sel: '#contact .lede', key: 'contact.lede.general' }
    ]),
    yoga: shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.bookSession' },
      { sel: '#yoga-details-title', key: 'yoga.details.title' },
      { sel: '[data-i18n="yoga.placeholder.title"]', key: 'yoga.placeholder.title' },
      { sel: '[data-i18n="yoga.placeholder.body"]', key: 'yoga.placeholder.body' },
      { sel: '#contact .lede', key: 'contact.lede.general' }
    ]),
    'workshop-yoga': workshopDetail('yoga'),
    'workshop-cacao': workshopDetail('cacao'),
    'workshop-circles': workshopDetail('circles'),
    shop: shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.askPiece' },
      { sel: '.shop-hero__kick', key: 'shop.hero.kick' },
      { sel: '#shop-title', key: 'shop.hero.title', html: true },
      { sel: '#shop-hero-meta', key: 'shop.hero.meta' },
      { sel: '.shop-hero__inquiry', key: 'shop.hero.inquiry' },
      { sel: '.shop-hero__jump', key: 'shop.hero.browse' },
      { sel: '.shop-hero__link', key: 'contact.whatsappAsk' },
      { sel: '.shop-hero__link[data-wa-direct]', msgKey: 'wa.shop', waMsg: true },
      { sel: '#contact .btn-wa[data-wa-direct]', msgKey: 'wa.shop', waMsg: true },
      { sel: '#shop-story .meta', key: 'shop.story.label' },
      { sel: '#shop-story-title', key: 'shop.story.title' },
      { sel: '.shop-prelude__fine', key: 'shop.story.fine' },
      { sel: '.shop-prelude__more', key: 'shop.story.about' },
      { sel: '#shop-custom-title', key: 'shop.custom.title' },
      { sel: '#shop-custom-lede', key: 'shop.custom.lede' },
      { sel: '#shop-custom-placeholder', key: 'shop.custom.placeholder' },
      { sel: 'label[for="custom-notes"]', key: 'shop.custom.notesLabel' },
      { sel: '#custom-notes', key: 'shop.custom.notesPlaceholder', attr: 'placeholder' },
      { sel: '#custom-order-submit', key: 'shop.custom.submit' },
      { sel: '#custom-order-submit', msgKey: 'wa.custom', waMsg: true },
      { sel: '#shop-catalog-title', key: 'shop.catalog.title' },
      { sel: '#shop-catalog-count', key: 'shop.catalog.count' },
      { sel: '#shop-catalog-lede', key: 'shop.catalog.lede' },
      { sel: '#shop-filters', key: 'shop.filters.label', attr: 'aria-label' },
      { sel: '#shop-catalog-mount noscript p', key: 'shop.noscript' },
      { sel: '#contact-title', key: 'shop.contact.title' },
      { sel: '#contact-lede', key: 'shop.contact.lede' }
    ]),
    product: shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.askPiece' },
      { sel: '#product-mount noscript h1', key: 'product.noscript.title' },
      { sel: '#product-mount noscript p.lede', key: 'product.noscript.lede' },
      { sel: '#product-mount noscript .btn', key: 'product.noscript.back' },
      { sel: '#contact-title', key: 'shop.contact.title' },
      { sel: '#contact-lede', key: 'product.contact.lede' }
    ])
  };

  function workshopDetail(kind) {
    var prefix = kind;
    var waKey = 'wa.' + kind;
    return shared().concat([
      { sel: '#nav .nav-cta, .nav-sheet__foot .nav-cta', key: 'nav.bookSession' },
      { sel: '.pg-back', key: 'pg.back' },
      { sel: '#pg-hero .kick', key: prefix + '.kick' },
      { sel: '#pg-title', key: prefix + '.title' },
      { sel: '#pg-hero .pg__lede', key: prefix + '.lede' },
      { sel: '#pg-story-title', key: prefix + '.storyLabel' },
      { sel: '.pg-story__big', key: prefix + '.storyBig', html: true },
      { sel: '.pg-points li:nth-child(1)', key: prefix + '.p1' },
      { sel: '.pg-points li:nth-child(2)', key: prefix + '.p2' },
      { sel: '.pg-points li:nth-child(3)', key: prefix + '.p3' },
      { sel: '#pg-practical-title', key: 'pg.practical.title' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(1) .pg-practical__k', key: 'pg.practical.formatK' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(1) .pg-practical__v', key: 'pg.practical.formatV' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(2) .pg-practical__k', key: 'pg.practical.groupK' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(2) .pg-practical__v', key: prefix + '.groupV' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(3) .pg-practical__k', key: 'pg.practical.bookingK' },
      { sel: '#pg-practical .pg-practical__list li:nth-child(3) .pg-practical__v', key: 'pg.practical.bookingV' },
      { sel: '#pg-book h2.disp', key: prefix + '.bookTitle' },
      { sel: '#pg-book .btn', key: 'contact.whatsappAsk' },
      { sel: '#pg-book .btn[data-wa-msg]', msgKey: waKey, waMsg: true },
      { sel: '#contact .btn-wa[data-wa-msg]', msgKey: waKey, waMsg: true },
      { sel: '#pg-more .kick', key: 'pg.more.kick' },
      { sel: '#pg-more-title', key: 'pg.more.title' },
      { sel: '#contact-title', key: 'shared.contact.title' },
      { sel: '#contact .lede', key: 'pg.contact.lede' },
      { sel: '#pg-more .gt-card__cta', key: 'shared.card.viewProgram' }
    ]).concat(moreCards(kind));
  }

  function moreCards(kind) {
    if (kind === 'yoga') {
      return [
        { sel: '#pg-more .gt-card--cacao .gt-card__p', key: 'yoga.card.cacao.body' },
        { sel: '#pg-more .gt-card--circles .gt-card__p', key: 'yoga.card.circles.body' },
        { sel: '#pg-more .gt-card--cacao .gt-card__t', key: 'home.card.cacao.title' },
        { sel: '#pg-more .gt-card--circles .gt-card__t', key: 'home.card.circles.title' }
      ];
    }
    if (kind === 'cacao') {
      return [
        { sel: '#pg-more .gt-card--yoga .gt-card__p', key: 'shared.card.landBody' },
        { sel: '#pg-more .gt-card--circles .gt-card__p', key: 'shared.card.comeHome' },
        { sel: '#pg-more .gt-card--yoga .gt-card__t', key: 'home.card.yoga.title' },
        { sel: '#pg-more .gt-card--circles .gt-card__t', key: 'home.card.circles.title' }
      ];
    }
    return [
      { sel: '#pg-more .gt-card--yoga .gt-card__p', key: 'shared.card.landBody' },
      { sel: '#pg-more .gt-card--cacao .gt-card__p', key: 'shared.card.openHeart' },
      { sel: '#pg-more .gt-card--yoga .gt-card__t', key: 'home.card.yoga.title' },
      { sel: '#pg-more .gt-card--cacao .gt-card__t', key: 'home.card.cacao.title' }
    ];
  }

  global.ANGILA_I18N_BINDINGS = pages;
})(window);
