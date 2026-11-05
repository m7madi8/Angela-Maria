/**
 * Homepage scroll narrative — GSAP + ScrollTrigger, Lenis-aware.
 * Respects prefers-reduced-motion; home page only.
 */
(function () {
  if (document.body.getAttribute('data-i18n-page') !== 'home') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var lenis = window.angilaLenis;

  function scroller() {
    return lenis ? document.documentElement : window;
  }

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: function (value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect: function () {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });
  }

  var stDefaults = lenis ? { scroller: document.documentElement } : {};

  var heroPhoto = document.querySelector('#hero .hx-photo');
  if (heroPhoto && matchMedia('(max-width: 860px)').matches) {
    gsap.to(heroPhoto, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: Object.assign(
        {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        },
        stDefaults
      )
    });
  }

  var quote = document.querySelector('.home-philosophy__quote');
  if (quote) {
    gsap.from(quote, {
      y: 48,
      opacity: 0.25,
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: Object.assign(
        {
          trigger: '#philosophy',
          start: 'top 78%',
          toggleActions: 'play none none reverse'
        },
        stDefaults
      )
    });
  }

  if (matchMedia('(min-width: 861px)').matches) {
    gsap.utils.toArray('#workshops .gt-card').forEach(function (card, i) {
      gsap.from(card, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        delay: i * 0.06,
        ease: 'power2.out',
        scrollTrigger: Object.assign(
          {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          stDefaults
        )
      });
    });
  }

  var stillnessHead = document.querySelector('#stillness .stillness-head');
  if (stillnessHead) {
    gsap.from(stillnessHead, {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: Object.assign(
        {
          trigger: '#stillness',
          start: 'top 72%',
          toggleActions: 'play none none reverse'
        },
        stDefaults
      )
    });
  }

  var progress = document.getElementById('story-progress');
  if (progress) {
    gsap.fromTo(
      progress,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: Object.assign(
          {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2
          },
          stDefaults
        )
      }
    );
  }

  var nav = document.getElementById('nav');
  if (nav) {
    ScrollTrigger.create(
      Object.assign(
        {
          trigger: '#hero',
          start: 'bottom 20%',
          onEnter: function () {
            nav.classList.add('nav--elevated');
          },
          onLeaveBack: function () {
            nav.classList.remove('nav--elevated');
          }
        },
        stDefaults
      )
    );
  }

  document.addEventListener('angilaStillnessRailReady', function () {
    ScrollTrigger.refresh();
  });

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();
