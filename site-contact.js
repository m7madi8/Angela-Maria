/**
 * Shared contact binding for the public static site.
 * Requires shop-config.js (ANGILA_SITE) to load first.
 */
(function () {
  var SITE = window.ANGILA_SITE || { waPhone: '', waDefault: '', igHandle: '' };

  function t(key) {
    if (typeof window.angilaT === 'function') return window.angilaT(key);
    return '';
  }

  function fill(template, vars) {
    var out = template;
    Object.keys(vars).forEach(function (k) {
      out = out.split('{' + k + '}').join(vars[k]);
    });
    return out;
  }

  function phoneDigits() {
    return SITE.waPhone ? String(SITE.waPhone).replace(/\D/g, '') : '';
  }

  function igName() {
    return SITE.igHandle ? String(SITE.igHandle).replace(/^@/, '') : '';
  }

  function waLink(msg) {
    var phone = phoneDigits();
    var text = msg || SITE.waDefault || '';
    if (!phone) return '';
    return 'https://wa.me/' + phone + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function igLink() {
    var name = igName();
    return name ? 'https://instagram.com/' + name : '';
  }

  function linkLabel(a) {
    return (a.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function promisesWhatsApp(anchor) {
    if (anchor.classList.contains('btn-wa')) return true;
    if (anchor.hasAttribute('data-wa-direct')) return true;
    if (anchor.hasAttribute('data-inquire')) return true;
    var label = linkLabel(anchor);
    if (/whatsapp|واتساب/i.test(label)) return true;
    return false;
  }

  function scrollOnlyContact(anchor) {
    if (anchor.closest('#dock')) return true;
    if (anchor.closest('#nav')) return true;
    if (anchor.hasAttribute('data-scroll-contact')) return true;
    return false;
  }

  function contactLede(piece, phone, ig) {
    if (phone) {
      if (piece) return fill(t('contact.lede.piece') || 'Ask me about {piece}.', { piece: piece });
      if (document.body.classList.contains('shop-atelier')) {
        return t('contact.lede.shop') || 'Message me about any piece — we confirm details together. No cart here.';
      }
      return t('contact.lede.general') || 'A piece, a session, a question.';
    }
    if (ig) {
      return piece
        ? fill(t('contact.lede.pieceIg') || 'Ask me about {piece}. Say hello on Instagram below.', { piece: piece })
        : t('contact.igBelow') || 'Say hello on Instagram below.';
    }
    return piece
      ? fill(t('contact.lede.pieceNoWa') || 'Ask me about {piece}. WhatsApp isn’t linked here yet.', { piece: piece })
      : t('contact.waNotLinked') || 'WhatsApp isn’t linked here yet.';
  }

  function syncLedes(phone, ig) {
    var piece = document.body.getAttribute('data-inquiry') || '';
    var shopLede = document.getElementById('contact-lede');
    if (shopLede && !shopLede.hasAttribute('data-i18n')) {
      shopLede.textContent = contactLede(piece, phone, ig);
    }
    document.querySelectorAll('#contact .lede').forEach(function (el) {
      if (el.id === 'contact-lede') return;
      if (el.hasAttribute('data-i18n')) return;
      if (phone) return;
      if (ig) {
        el.textContent = t('contact.igBelow') || 'Say hello on Instagram below.';
        return;
      }
      el.textContent = t('contact.waNotLinked') || 'WhatsApp isn’t linked here yet.';
    });
  }

  function bindContact() {
    var phone = phoneDigits();
    var ig = igName();

    document.querySelectorAll('[data-contact="wa"]').forEach(function (a) {
      if (a.hasAttribute('data-inquire') && !phone) {
        a.hidden = false;
        a.removeAttribute('aria-hidden');
        a.href = '#contact';
        a.removeAttribute('target');
        a.removeAttribute('rel');
        if (!a.hasAttribute('data-i18n')) {
          a.textContent = t('contact.askThisPiece') || 'Ask about this piece';
        }
        return;
      }

      var msg = a.getAttribute('data-wa-msg');
      var href = waLink(msg);

      if (href.indexOf('https://') === 0) {
        a.hidden = false;
        a.href = href;
        a.setAttribute('rel', 'noopener');
        a.setAttribute('target', '_blank');
        a.removeAttribute('aria-disabled');
        return;
      }

      if (promisesWhatsApp(a)) {
        a.hidden = true;
        a.removeAttribute('href');
        a.removeAttribute('target');
        a.setAttribute('aria-hidden', 'true');
        return;
      }

      a.hidden = false;
      a.removeAttribute('aria-hidden');
      a.href = '#contact';
      a.removeAttribute('target');
      a.removeAttribute('rel');
      if (!phone && a.hasAttribute('data-wa-fallback')) {
        a.textContent = t('contact.sayHelloShort') || 'Say hello';
      }
      if (!scrollOnlyContact(a) && !a.closest('#contact')) {
        a.href = '#contact';
      }
    });

    document.querySelectorAll('[data-contact="ig"]').forEach(function (a) {
      if (!ig) {
        a.hidden = true;
        a.removeAttribute('href');
        a.removeAttribute('target');
        return;
      }
      a.hidden = false;
      a.href = igLink();
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute('target', '_blank');
    });

    document.querySelectorAll('[data-inquire]').forEach(function (a) {
      if (phone && !a.hasAttribute('data-i18n')) {
        a.textContent = t('contact.inquireWhatsapp') || 'Inquire on WhatsApp';
      }
    });

    document.querySelectorAll('#contact .contact-social, .nav-sheet__social').forEach(function (box) {
      var visible = [].some.call(box.querySelectorAll('a'), function (link) {
        return !link.hidden;
      });
      box.hidden = !visible;
    });

    syncLedes(phone, ig);
  }

  window.angilaBindContact = bindContact;

  function bootContact() {
    bindContact();
  }

  document.addEventListener('angilaI18nReady', bootContact);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootContact);
  } else {
    bootContact();
  }
})();
