/**
 * Central translation catalog for the public static site.
 * Keys referenced via data-i18n, data-i18n-html, and data-i18n-attr on markup.
 */
(function (global) {
  var meta = {
    home: {
      en: {
        title: 'Angela-Maria — Yoga, Breath & Movement',
        description: 'Yoga, breath and gatherings with Angela-Maria. Sessions, workshops and handmade pieces.',
        ogTitle: 'Angela-Maria — Yoga, Breath & Movement',
        ogDescription: 'Sessions, workshops and handmade pieces with Angela-Maria.'
      },
      ar: {
        title: 'أنجela-Maria — يoga، تنفس وحركة',
        description: 'يوغا وتنفس ولقاءات مع Angela-Maria. جلسات وورش وقطع يدوية.',
        ogTitle: 'Angela-Maria — يوغا وتنفس وحركة',
        ogDescription: 'جلسات وورش وقطع يدوية مع Angela-Maria.'
      }
    },
    shop: {
      en: {
        title: 'The Art of Stillness — Handmade shop — Angela-Maria',
        description: 'Handmade pieces by Angela-Maria. Numbered, one of a kind. Ask for a price.',
        ogTitle: 'The Art of Stillness — Angela-Maria',
        ogDescription: 'A small numbered collection. Made slowly. Price on request.'
      },
      ar: {
        title: 'فن السكون — متجر يدوي — Angela-Maria',
        description: 'قطع يدوية من Angela-Maria. مرقّمة وفريدة. اسألي عن السعر.',
        ogTitle: 'فن السكون — Angela-Maria',
        ogDescription: 'مجموعة صغيرة مرقّمة. صُنعت ببطء. السعر عند الطلب.'
      }
    },
    product: {
      en: {
        title: 'Piece — The Art of Stillness — Angela-Maria',
        description: 'A handmade piece from The Art of Stillness by Angela-Maria. Price on request.',
        ogTitle: 'The Art of Stillness — Angela-Maria',
        ogDescription: 'A handmade piece from Angela-Maria’s collection. Price on request.'
      },
      ar: {
        title: 'قطعة — فن السكون — Angela-Maria',
        description: 'قطعة يدوية من فن السكون لـ Angela-Maria. السعر عند الطلب.',
        ogTitle: 'فن السكون — Angela-Maria',
        ogDescription: 'قطعة يدوية من مجموعة Angela-Maria. السعر عند الطلب.'
      }
    },
    workshops: {
      en: {
        title: 'In-person gatherings — Angela-Maria',
        description: "Yoga workshops, cacao ceremonies and women's circles with Angela-Maria. Choose your in-person gathering."
      },
      ar: {
        title: 'لقاءات حضورية — Angela-Maria',
        description: 'ورش يوغا واحتفالات الكاكاو ودوائر نسائية مع Angela-Maria. اختاري لقاءك الحضوري.'
      }
    },
    'workshop-yoga': {
      en: {
        title: 'Yoga workshops — Angela-Maria',
        description: 'In-person yoga workshops with Angela-Maria. Movement and breath in a small, welcoming group.'
      },
      ar: {
        title: 'ورش يوغا — Angela-Maria',
        description: 'ورش يوغا حضورية مع Angela-Maria. حركة وتنفس في مجموعة صغيرة ودافئة.'
      }
    },
    'workshop-cacao': {
      en: {
        title: 'Cacao ceremonies — Angela-Maria',
        description: 'Cacao ceremonies with Angela-Maria. Open the heart and sit together in a small circle.'
      },
      ar: {
        title: 'احتفالات الكاكاو — Angela-Maria',
        description: 'احتفالات كاكاو مع Angela-Maria. افتحي القلب واجلسي معًا في دائرة صغيرة.'
      }
    },
    'workshop-circles': {
      en: {
        title: "Women's circles — Angela-Maria",
        description: "Women's circles with Angela-Maria. Listen, share, and come home to yourself."
      },
      ar: {
        title: 'دوائر نسائية — Angela-Maria',
        description: 'دوائر نسائية مع Angela-Maria. استمعي، شاركي، وعودي إلى نفسك.'
      }
    },
    about: {
      en: {
        title: 'About Angelina — Angela-Maria',
        description: 'Angelina’s journey with yoga, creation, and The Art of Stillness — in her own words.'
      },
      ar: {
        title: 'About Angelina — Angela-Maria',
        description: 'Angelina’s journey with yoga, creation, and The Art of Stillness — in her own words.'
      }
    },
    yoga: {
      en: {
        title: 'Yoga & Movement — Angela-Maria',
        description: 'Angelina’s intention behind yoga and movement — space to slow down, reconnect, and practice beyond the mat.'
      },
      ar: {
        title: 'Yoga & Movement — Angela-Maria',
        description: 'Angelina’s intention behind yoga and movement — space to slow down, reconnect, and practice beyond the mat.'
      }
    }
  };

  var strings = {
    en: {
      'skip.main': 'Skip to content',
      'nav.yoga': 'Yoga',
      'nav.experiences': 'Experiences',
      'nav.workshops': 'Workshops',
      'nav.courses': 'Courses',
      'nav.oneone': '1:1',
      'nav.shop': 'Shop',
      'nav.about': 'About',
      'nav.readStory': 'Read Angelina’s story',
      'nav.mobileCourses': 'Online courses',
      'nav.mobileOneone': '1:1 online',
      'nav.sayHello': 'Say hello',
      'nav.bookSession': 'Book a session',
      'nav.askPiece': 'Ask about a piece',
      'nav.openMenu': 'Open menu',
      'nav.closeMenu': 'Close menu',
      'nav.logoAria': 'Angela — Yoga and Movement',
      'lang.label': 'Language',
      'lang.en': 'English',
      'lang.ar': 'العربية',
      'social.whatsapp': 'WhatsApp',
      'social.instagram': 'Instagram',
      'contact.whatsappAsk': 'Ask on WhatsApp',
      'contact.bookWhatsapp': 'Book on WhatsApp',
      'contact.inquireWhatsapp': 'Inquire on WhatsApp',
      'contact.sayHelloShort': 'Say hello',
      'contact.igBelow': 'Say hello on Instagram below.',
      'contact.waNotLinked': 'WhatsApp isn’t linked here yet.',
      'contact.askThisPiece': 'Ask about this piece',
      'contact.lede.piece': 'Ask me about {piece}.',
      'contact.lede.shop': 'Message me about any piece — we confirm details together. No cart here.',
      'contact.lede.general': 'A piece, a session, a question.',
      'contact.lede.pieceIg': 'Ask me about {piece}. Say hello on Instagram below.',
      'contact.lede.pieceNoWa': 'Ask me about {piece}. WhatsApp isn’t linked here yet.',
      'home.hero.line1': 'Yoga, breath',
      'home.hero.line2': 'and movement.',
      'home.hero.lede': 'Sessions, workshops and women\'s circles in person. 1:1 sessions online.',
      'home.hero.ctaBook': 'Book a private session',
      'home.hero.ctaWays': 'See ways to practice',
      'home.hero.imgAlt': 'Angela-Maria seated in a yoga twist on a mat in the desert',
      'home.ws.kicker': 'In person',
      'home.ws.title': 'Workshops & gatherings.',
      'home.ws.intro': 'Move, breathe, or sit together. Handmade work lives in <a class="ws-intro__link" href="shop.html">The Art of Stillness</a>.',
      'home.ws.swipe': 'Swipe <span aria-hidden="true">→</span>',
      'home.ws.cardsLabel': 'Workshops',
      'home.card.yoga.alt': 'Yoga',
      'home.card.yoga.title': 'Yoga',
      'home.card.yoga.body': 'Land in your body.',
      'home.card.yoga.cta': 'View program',
      'home.card.cacao.alt': 'Cacao ceremony',
      'home.card.cacao.title': 'Cacao ceremony',
      'home.card.cacao.body': 'Open the heart. Sit together.',
      'home.card.cacao.cta': 'View program',
      'home.card.circles.alt': "Women's circle",
      'home.card.circles.title': "Women's circles",
      'home.card.circles.body': 'Listen, share, come home.',
      'home.card.circles.cta': 'View program',
      'home.ws.allGatherings': 'All gatherings',
      'home.courses.title': 'Online courses.',
      'home.courses.lede': 'Come back whenever you need.',
      'home.courses.b1': 'Recorded classes',
      'home.courses.b2': 'Your pace, your home',
      'home.courses.b3': 'Movement and breath',
      'home.courses.ask': 'Ask about courses',
      'home.courses.imgAlt': 'Online practice',
      'home.oneone.title': '1:1 online sessions.',
      'home.oneone.lede': 'A practice that starts with you.',
      'home.oneone.b1': 'Guidance shaped around you',
      'home.oneone.b2': 'Talk, then move and breathe',
      'home.oneone.b3': 'One session, or a few',
      'home.oneone.book': 'Book on WhatsApp',
      'home.oneone.imgAlt': 'Private session',
      'home.philosophy.kicker': 'What connects everything',
      'home.philosophy.lead': '',
      'home.philosophy.p2': '',
      'home.philosophy.more': 'Read Angelina’s story',
      'home.about.kicker': 'About Angelina',
      'home.about.title': 'A little about me',
      'home.about.teaser': '',
      'home.about.read': 'Read Angelina’s story',
      'home.about.imgAlt': 'Angelina',
      'home.stillness.kick': 'The Art of Stillness',
      'home.stillness.title': 'Handcrafted for quiet space.',
      'home.stillness.lede': 'Woven slowly. Made to be lived with. Art from the same quiet hands.',
      'home.stillness.featured': 'Featured pieces',
      'home.stillness.swipe': 'Swipe <span aria-hidden="true">→</span>',
      'home.stillness.explore': 'Explore the collection',
      'home.stillness.howMade': 'How they’re made',
      'home.stillness.scrollHint': 'Scroll to wander through the pieces',
      'home.contact.title': 'Say hello.',
      'home.contact.lede': 'A session, a workshop, a piece. Just say hello.',
      'home.dock.cta': 'Book a private session',
      'workshops.hero.kick': 'In person',
      'workshops.hero.title1': 'Gather',
      'workshops.hero.title2': 'with us.',
      'workshops.hero.lede': 'Yoga, cacao, or a circle.',
      'workshops.hero.imgAlt': 'Angela-Maria',
      'workshops.list.kick': 'The programs',
      'workshops.list.title': 'Choose your gathering.',
      'workshops.card.yoga.cta': 'Explore yoga',
      'workshops.card.cacao.cta': 'Explore cacao',
      'workshops.card.circles.cta': 'Explore circles',
      'workshops.practical.title': 'Good to know',
      'workshops.practical.formatK': 'Format',
      'workshops.practical.formatV': 'In-person gatherings',
      'workshops.practical.programsK': 'Programs',
      'workshops.practical.programsV': "Yoga, cacao ceremony, women's circles",
      'workshops.practical.bookingK': 'Booking',
      'workshops.practical.bookingV': 'Message on WhatsApp — Angela-Maria will share dates and details with you',
      'workshops.contact.lede': 'A gathering on your mind? Just say hello.',
      'pg.back': '← All gatherings',
      'pg.practical.title': 'Good to know',
      'pg.practical.formatK': 'Format',
      'pg.practical.formatV': 'In person',
      'pg.practical.groupK': 'Group',
      'pg.practical.bookingK': 'Booking',
      'pg.practical.bookingV': 'Message on WhatsApp — I’ll share dates and details with you',
      'pg.more.kick': 'Also explore',
      'pg.more.title': 'Other gatherings',
      'pg.contact.lede': 'Ask me on WhatsApp.',
      'yoga.kick': 'In person · 01',
      'yoga.title': 'Yoga',
      'yoga.lede': 'Move and breathe, in good company.',
      'yoga.storyLabel': 'The practice',
      'yoga.storyBig': 'A small group. <em>Time to land.</em>',
      'yoga.p1': 'Flow shaped around the room',
      'yoga.p2': 'Breath, movement, rest',
      'yoga.p3': 'You are seen',
      'yoga.groupV': 'A small group',
      'yoga.bookTitle': 'Join a yoga gathering.',
      'yoga.card.cacao.body': 'Open the heart.',
      'yoga.card.circles.body': 'Come home.',
      'cacao.kick': 'In person · 02',
      'cacao.title': 'Cacao ceremony',
      'cacao.lede': 'Open the heart. Sit together.',
      'cacao.storyLabel': 'The ceremony',
      'cacao.storyBig': 'Cacao, intention, <em>quiet.</em>',
      'cacao.p1': 'Ceremonial cacao, prepared with care',
      'cacao.p2': 'Breath and reflection',
      'cacao.p3': 'A circle small enough to hold you',
      'cacao.groupV': 'A circle small enough to hold you',
      'cacao.bookTitle': 'Join a cacao gathering.',
      'circles.kick': 'In person · 03',
      'circles.title': "Women's circles",
      'circles.lede': 'Listen, share, come home.',
      'circles.storyLabel': 'The circle',
      'circles.storyBig': 'No performance. <em>Just presence.</em>',
      'circles.p1': 'A clear, safe opening',
      'circles.p2': 'Sharing and gentle practice',
      'circles.p3': 'Every voice heard',
      'circles.groupV': "Women's circle",
      'circles.bookTitle': "Join a women's circle.",
      'shop.hero.kick': 'Angela-Maria · The Art of Stillness',
      'shop.hero.title': 'Handcrafted for <em>quiet space.</em>',
      'shop.hero.meta': 'Handmade collection',
      'shop.hero.inquiry': 'Inquire on WhatsApp — we confirm together. No online checkout.',
      'shop.hero.browse': 'Browse the collection',
      'shop.story.label': 'The Art of Stillness',
      'shop.story.title': 'The story behind The Art of Stillness',
      'shop.story.fine': 'Ready pieces and custom requests — we confirm together. No online checkout yet.',
      'shop.story.about': 'About Angelina',
      'shop.catalog.title': 'The collection',
      'shop.catalog.count': 'Handmade pieces',
      'shop.catalog.lede': 'Each piece, one of a kind. Ask me.',
      'shop.filters.label': 'Filter by category',
      'shop.noscript': 'Enable JavaScript to see the pieces.',
      'shop.contact.title': 'Ask about a piece.',
      'shop.contact.lede': 'Message me about any piece — we confirm details together. No cart here.',
      'product.noscript.title': 'This piece needs JavaScript.',
      'product.noscript.lede': 'Enable it, or return to the shop.',
      'product.noscript.back': 'Back to the shop',
      'product.contact.lede': 'Ask me directly.',
      'shared.contact.title': 'Say hello.',
      'shared.card.viewProgram': 'View program',
      'shared.card.landBody': 'Land in your body.',
      'shared.card.openHeart': 'Open the heart.',
      'shared.card.comeHome': 'Come home.'
    },
    ar: {
      'skip.main': 'تخطي إلى المحتوى',
      'nav.yoga': 'يوغا',
      'nav.experiences': 'تجارب',
      'nav.readStory': 'اقرأي قصة Angelina',
      'nav.workshops': 'ورش العمل',
      'nav.courses': 'الدورات',
      'nav.oneone': '١:١',
      'nav.shop': 'المتجر',
      'nav.about': 'عن أنجela',
      'nav.mobileCourses': 'دورات أونلاين',
      'nav.mobileOneone': '١:١ أونلاين',
      'nav.sayHello': 'مرحبًا',
      'nav.bookSession': 'احجزي جلسة',
      'nav.askPiece': 'اسألي عن قطعة',
      'nav.openMenu': 'فتح القائمة',
      'nav.closeMenu': 'إغلاق القائمة',
      'nav.logoAria': 'Angela — يوغا وحركة',
      'lang.label': 'اللغة',
      'lang.en': 'English',
      'lang.ar': 'العربية',
      'social.whatsapp': 'واتساب',
      'social.instagram': 'إنستغرام',
      'contact.whatsappAsk': 'اسألي على واتساب',
      'contact.bookWhatsapp': 'احجزي على واتساب',
      'contact.inquireWhatsapp': 'استفسري على واتساب',
      'contact.sayHelloShort': 'مرحبًا',
      'contact.igBelow': 'رحّبي على إنستغرام أدناه.',
      'contact.waNotLinked': 'واتساب غير مربوط هنا بعد.',
      'contact.askThisPiece': 'اسألي عن هذه القطعة',
      'contact.lede.piece': 'اسأليني عن {piece}.',
      'contact.lede.shop': 'راسليني عن أي قطعة — نؤكد التفاصيل معًا. لا سلة هنا.',
      'contact.lede.general': 'قطعة، جلسة، سؤال.',
      'contact.lede.pieceIg': 'اسأليني عن {piece}. رحّبي على إنستغرام أدناه.',
      'contact.lede.pieceNoWa': 'اسأليني عن {piece}. واتساب غير مربوط هنا بعد.',
      'home.hero.line1': 'يوغا، تنفس',
      'home.hero.line2': 'وحركة.',
      'home.hero.lede': 'جلسات وورش ودوائر نسائية حضوريًا. جلسات فردية أونلاين.',
      'home.hero.ctaBook': 'احجزي جلسة خاصة',
      'home.hero.ctaWays': 'اكتشفي طرق الممارسة',
      'home.hero.imgAlt': 'Angela-Maria في وضعية يوغا على سجادة في الصحراء',
      'home.ws.kicker': 'حضوري',
      'home.ws.title': 'ورش ولقاءات.',
      'home.ws.intro':
        'تحركي، تنفسي، أو اجلسي معًا. الأعمال اليدوية في <a class="ws-intro__link" href="shop.html">فن السكون</a>.',
      'home.ws.swipe': 'اسحبي <span aria-hidden="true">←</span>',
      'home.ws.cardsLabel': 'ورش العمل',
      'home.card.yoga.alt': 'يوغا',
      'home.card.yoga.title': 'يوغا',
      'home.card.yoga.body': 'عودي إلى جسدك.',
      'home.card.yoga.cta': 'عرض البرنامج',
      'home.card.cacao.alt': 'احتفال كاكاو',
      'home.card.cacao.title': 'احتفال كاكاو',
      'home.card.cacao.body': 'افتحي القلب. اجلسي معًا.',
      'home.card.cacao.cta': 'عرض البرنامج',
      'home.card.circles.alt': 'دائرة نسائية',
      'home.card.circles.title': 'دوائر نسائية',
      'home.card.circles.body': 'استمعي، شاركي، وعودي.',
      'home.card.circles.cta': 'عرض البرنامج',
      'home.ws.allGatherings': 'كل اللقاءات',
      'home.courses.title': 'دورات أونلاين.',
      'home.courses.lede': 'عودي متى احتجت.',
      'home.courses.b1': 'حصص مسجّلة',
      'home.courses.b2': 'إيقاعك، في بيتك',
      'home.courses.b3': 'حركة وتنفس',
      'home.courses.ask': 'اسألي عن الدورات',
      'home.courses.imgAlt': 'ممارسة أونلاين',
      'home.oneone.title': 'جلسات ١:١ أونلاين.',
      'home.oneone.lede': 'ممارسة تبدأ منك.',
      'home.oneone.b1': 'إرشاد يُشكَّل حولك',
      'home.oneone.b2': 'حديث، ثم حركة وتنفس',
      'home.oneone.b3': 'جلسة واحدة، أو أكثر',
      'home.oneone.book': 'احجزي على واتساب',
      'home.oneone.imgAlt': 'جلسة خاصة',
      'home.about.kicker': 'عن Angela-Maria',
      'home.about.title': 'الحركة صارت لغتي.<em>والفن لغة أخرى.</em>',
      'home.about.b1': 'مدرّبة يوغا 500 ساعة',
      'home.about.b2': 'حركة، تنفس، حضور',
      'home.about.b3': 'فن من نفس اليد الهادئة',
      'home.about.note': 'يدي، بالألوان أيضًا',
      'home.about.imgAlt': 'Angela-Maria',
      'home.stillness.kick': 'فن السكون',
      'home.stillness.title': 'صُنعت لمساحة هادئة.',
      'home.stillness.lede': 'نُسجت ببطء. للعيش معها. فن من نفس اليد الهادئة.',
      'home.stillness.featured': 'قطع مميزة',
      'home.stillness.swipe': 'اسحبي <span aria-hidden="true">←</span>',
      'home.stillness.explore': 'استكشفي المجموعة',
      'home.stillness.howMade': 'كيف تُصنع',
      'home.stillness.scrollHint': 'مرّري للتجوّل بين القطع',
      'home.contact.title': 'مرحبًا.',
      'home.contact.lede': 'جلسة، ورشة، قطعة. فقط رحّبي.',
      'home.dock.cta': 'احجزي جلسة خاصة',
      'workshops.hero.kick': 'حضوري',
      'workshops.hero.title1': 'اجتمعي',
      'workshops.hero.title2': 'معنا.',
      'workshops.hero.lede': 'يوغا، كاكاو، أو دائرة.',
      'workshops.hero.imgAlt': 'Angela-Maria',
      'workshops.list.kick': 'البرامج',
      'workshops.list.title': 'اختاري لقاءك.',
      'workshops.card.yoga.cta': 'استكشفي اليوغا',
      'workshops.card.cacao.cta': 'استكشفي الكاكاو',
      'workshops.card.circles.cta': 'استكشفي الدوائر',
      'workshops.practical.title': 'م good to know',
      'workshops.practical.formatK': 'الشكل',
      'workshops.practical.formatV': 'لقاءات حضورية',
      'workshops.practical.programsK': 'البرامج',
      'workshops.practical.programsV': 'يوغا، احتفال كاكاو، دوائر نسائية',
      'workshops.practical.bookingK': 'الحجز',
      'workshops.practical.bookingV': 'راسلي على واتساب — Angela-Maria تشاركك التواريخ والتفاصيل',
      'workshops.contact.lede': 'لقاء في بالك؟ فقط رحّبي.',
      'pg.back': '→ كل اللقاءات',
      'pg.practical.title': 'م good to know',
      'pg.practical.formatK': 'الشكل',
      'pg.practical.formatV': 'حضوري',
      'pg.practical.groupK': 'المجموعة',
      'pg.practical.bookingK': 'الحجز',
      'pg.practical.bookingV': 'راسليني على واتساب — أشاركك التواريخ والتفاصيل',
      'pg.more.kick': 'اكتشفي أيضًا',
      'pg.more.title': 'لقاءات أخرى',
      'pg.contact.lede': 'اسأليني على واتساب.',
      'yoga.kick': 'حضوري · ٠١',
      'yoga.title': 'يوغا',
      'yoga.lede': 'تحركي وتنفسي، في صحبة طيبة.',
      'yoga.storyLabel': 'الممارسة',
      'yoga.storyBig': 'مجموعة صغيرة. <em>وقت للاستقرار.</em>',
      'yoga.p1': 'تدفق يُشكَّل حول الغرفة',
      'yoga.p2': 'تنفس، حركة، راحة',
      'yoga.p3': 'أنتِ مرئية',
      'yoga.groupV': 'مجموعة صغيرة',
      'yoga.bookTitle': 'انضمي إلى لقاء يوغا.',
      'yoga.card.cacao.body': 'افتحي القلب.',
      'yoga.card.circles.body': 'عودي.',
      'cacao.kick': 'حضوري · ٠٢',
      'cacao.title': 'احتفال كاكاو',
      'cacao.lede': 'افتحي القلب. اجلسي معًا.',
      'cacao.storyLabel': 'الاحتفال',
      'cacao.storyBig': 'كاكاو، نية، <em>سكينة.</em>',
      'cacao.p1': 'كاكاو احتفالي، يُحضَّر بعناية',
      'cacao.p2': 'تنفس وتأمل',
      'cacao.p3': 'دائرة صغيرة تكفي لحملك',
      'cacao.groupV': 'دائرة صغيرة تكفي لحملك',
      'cacao.bookTitle': 'انضمي إلى لقاء كاكاو.',
      'circles.kick': 'حضوري · ٠٣',
      'circles.title': 'دوائر نسائية',
      'circles.lede': 'استمعي، شاركي، وعودي.',
      'circles.storyLabel': 'الدائرة',
      'circles.storyBig': 'لا أداء. <em>حضور فقط.</em>',
      'circles.p1': 'افتتاح واضح وآمن',
      'circles.p2': 'مشاركة وممارسة لطيفة',
      'circles.p3': 'كل صوت مسموع',
      'circles.groupV': 'دائرة نسائية',
      'circles.bookTitle': 'انضمي إلى دائرة نسائية.',
      'shop.hero.kick': 'Angela-Maria · فن السكون',
      'shop.hero.title': 'صُنعت لـ<em>مساحة هادئة.</em>',
      'shop.hero.meta': 'مجموعة يدوية',
      'shop.hero.inquiry': 'استفسري على واتساب — نؤكد معًا. لا دفع إلكتروني.',
      'shop.hero.browse': 'تصفّحي المجموعة',
      'shop.story.label': 'الصنع',
      'shop.story.title': 'صُنعت يدويًا.',
      'shop.story.fine': 'فريدة. السعر عند الطلب.',
      'shop.story.about': 'عن Angela-Maria',
      'shop.catalog.title': 'المجموعة',
      'shop.catalog.count': 'قطع يدوية',
      'shop.catalog.lede': 'كل قطعة فريدة. اسأليني.',
      'shop.filters.label': 'تصفية حسب التصنيف',
      'shop.noscript': 'فعّلي JavaScript لرؤية القطع.',
      'shop.contact.title': 'اسألي عن قطعة.',
      'shop.contact.lede': 'راسليني عن أي قطعة — نؤكد التفاصيل معًا. لا سلة هنا.',
      'product.noscript.title': 'هذه القطعة تحتاج JavaScript.',
      'product.noscript.lede': 'فعّليه، أو عودي إلى المتجر.',
      'product.noscript.back': 'العودة إلى المتجر',
      'product.contact.lede': 'اسأليني مباشرة.',
      'shared.contact.title': 'مرحبًا.',
      'shared.card.viewProgram': 'عرض البرنامج',
      'shared.card.landBody': 'عودي إلى جسدك.',
      'shared.card.openHeart': 'افتحي القلب.',
      'shared.card.comeHome': 'عودي.'
    }
  };

  fixArabicTypos(strings.ar);

  function fixArabicTypos(ar) {
    ar['workshops.practical.title'] = 'من الجيد معرفته';
    ar['pg.practical.title'] = 'من الجيد معرفته';
    ar['nav.about'] = 'عن Angela-Maria';
    meta.home.ar.title = 'Angela-Maria — يوغا وتنفس وحركة';
    meta.home.ar.description =
      'يوغا وتنفس ولقاءات مع Angela-Maria. جلسات وورش وقطع يدوية.';
  }

  strings.en['wa.courses'] = "Hi Angela-Maria, I'd like to know about your online courses.";
  strings.ar['wa.courses'] = 'مرحبًا Angela-Maria، أود معرفة المزيد عن دوراتك الأونلاين.';
  strings.en['wa.yoga'] = "Hi Angela-Maria, I'd like to ask about your yoga workshops.";
  strings.ar['wa.yoga'] = 'مرحبًا Angela-Maria، أود الاستفسار عن ورش اليوغا.';
  strings.en['wa.cacao'] = "Hi Angela-Maria, I'd like to ask about your cacao ceremonies.";
  strings.ar['wa.cacao'] = 'مرحبًا Angela-Maria، أود الاستفسار عن احتفالات الكاكاو.';
  strings.en['wa.circles'] = "Hi Angela-Maria, I'd like to ask about your women's circles.";
  strings.ar['wa.circles'] = 'مرحبًا Angela-Maria، أود الاستفسار عن الدوائر النسائية.';
  strings.en['wa.shop'] = "Hi Angela-Maria, I'd like to ask about a handmade piece from The Art of Stillness.";
  strings.ar['wa.shop'] = 'مرحبًا Angela-Maria، أود الاستفسار عن قطعة يدوية من فن السكون.';
  strings.en['wa.custom'] =
    "Hi Angela-Maria, I'd like to request a custom dream catcher from The Art of Stillness.";
  strings.ar['wa.custom'] =
    "Hi Angela-Maria, I'd like to request a custom dream catcher from The Art of Stillness.";

  (function mergeApprovedCopy() {
    var a = global.ANGELINA_APPROVED;
    if (!a) return;
    var e = strings.en;
    e['home.philosophy.lead'] = a.homePhilosophyLead;
    e['home.philosophy.p2'] = a.connects.p2;
    e['home.about.teaser'] = a.homeAboutTeaser;
    e['about.hero.title'] = 'Creation as a way of reconnecting with ourselves.';
    e['about.journey.p1'] = a.journey.p1;
    e['about.journey.p2'] = a.journey.p2;
    e['about.journey.p3'] = a.journey.p3;
    e['about.connects.p1'] = a.connects.p1;
    e['about.connects.p2'] = a.connects.p2;
    e['about.connects.p3'] = a.connects.p3;
    e['about.connects.p4'] = a.connects.p4;
    e['about.me.p1'] = a.aboutMe.p1;
    e['about.me.p2'] = a.aboutMe.p2;
    e['about.me.p3'] = a.aboutMe.p3;
    e['about.me.p4'] = a.aboutMe.p4;
    e['about.me.p5'] = a.aboutMe.p5;
    e['yoga.intention.p1'] = a.intention.p1;
    e['yoga.intention.p2'] = a.intention.p2;
    e['yoga.intention.p3'] = a.intention.p3;
    e['stillness.p1'] = a.stillness.p1;
    e['stillness.p2'] = a.stillness.p2;
    e['stillness.p3'] = a.stillness.p3;
    e['stillness.p4'] = a.stillness.p4;
    e['yoga.details.title'] = 'Classes & sessions';
    e['yoga.placeholder.title'] = 'Details to be confirmed';
    e['home.stillness.lede'] = a.stillness.p4;
    e['yoga.placeholder.body'] =
      'Schedule, locations, languages, and booking steps will be added here once Angelina confirms them. For now, message on WhatsApp or explore in-person gatherings.';
    e['shop.custom.title'] = 'Request a custom dream catcher';
    e['shop.custom.lede'] =
      'Some pieces are ready to welcome you home; others are made slowly after we speak. Share what you have in mind — Angelina will confirm options, price, and timing with you.';
    e['shop.custom.placeholder'] =
      'Customization choices (colours, size, and similar options) will be confirmed with Angelina — nothing here is a fixed product option yet.';
    e['shop.custom.notesLabel'] = 'Your notes';
    e['shop.custom.notesPlaceholder'] = 'Tell Angelina what you have in mind…';
    e['shop.custom.submit'] = 'Send request on WhatsApp';
    e['shop.story.title'] = 'The story behind The Art of Stillness';
    e['shop.story.fine'] = 'Ready pieces and custom requests — we confirm together. No online checkout yet.';
  })();

  global.ANGILA_I18N = { meta: meta, strings: strings };
})(window);
