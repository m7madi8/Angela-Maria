/** Localized WhatsApp default messages and data-wa-msg targets. */
window.ANGILA_SITE_I18N = {
  en: {
    '[data-wa-msg-courses]': "Hi Angela-Maria, I'd like to know about your online courses.",
    '[data-wa-msg-shop]': "Hi Angela-Maria, I'd like to ask about a handmade piece from The Art of Stillness.",
    '[data-wa-msg-yoga]': "Hi Angela-Maria, I'd like to ask about your yoga workshops.",
    '[data-wa-msg-cacao]': "Hi Angela-Maria, I'd like to ask about your cacao ceremonies.",
    '[data-wa-msg-circles]': "Hi Angela-Maria, I'd like to ask about your women's circles."
  },
  ar: {
    '[data-wa-msg-courses]': 'مرحبًا Angela-Maria، أود معرفة المزيد عن دوراتك الأونلاين.',
    '[data-wa-msg-shop]': 'مرحبًا Angela-Maria، أود الاستفسار عن قطعة يدوية من فن السكون.',
    '[data-wa-msg-yoga]': 'مرحبًا Angela-Maria، أود الاستفسار عن ورش اليوغا.',
    '[data-wa-msg-cacao]': 'مرحبًا Angela-Maria، أود الاستفسار عن احتفالات الكاكاو.',
    '[data-wa-msg-circles]': 'مرحبًا Angela-Maria، أود الاستفسار عن الدوائر النسائية.'
  }
};

window.ANGILA_SITE_LOCALE = window.ANGILA_SITE || {};
(function () {
  var locale = window.angilaLocale || 'en';
  if (locale === 'ar' && window.ANGILA_SITE) {
    window.ANGILA_SITE.waDefault = 'مرحبًا Angela-Maria، أود الاستفسار عن قطعك اليدوية.';
  }
})();
