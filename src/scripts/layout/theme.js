import 'styles/theme.scss';

// plugins
import 'picturefill';
import 'lazysizes/plugins/object-fit/ls.object-fit.js';
import 'lazysizes/plugins/parent-fit/ls.parent-fit.js';
import 'lazysizes/plugins/rias/ls.rias.js';
import 'lazysizes/plugins/bgset/ls.bgset.js';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg.js';
// Fancybox
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox.css';
// Open-close details-utils
import '@zachleat/details-utils';
// Accordion
import { Accordion } from 'accordion';
import 'accordion/src/accordion.css';

import 'helpers/jquery.plugins';

import 'store/store.ts';
// Cart
import 'components/CartReact';
import 'components/CartCount';
import 'components/CartPopup';

// utils
import { getLocaleAndPathname } from 'helpers/utils';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.setHeaderHeight();
    this.initMobileNav();
    this.initStickyScrollBlock();
    // this.initHeaderOnScrollDown();
    this.initIosScroll();
    this.initAccordion();
    this.initCurrencySwitcher();
    this.initLanguageSwitcher();
    this.initMap();
    this.fancyboxBackdrop();
    this.fancyboxModalCloseButton();

    // Responsive fluid iframe
    $('.rte iframe').each(function (index) {
      $(this).wrap('<div class="fluid-iframe"></div>');
    });

    if (!('ontouchstart' in document.documentElement)) {
      $('html').addClass('no-touch');
    }

    Fancybox.bind('[data-fancybox]', {});
  }

  // initialize fixed blocks on scroll
  initStickyScrollBlock() {
    $('.header__panel').stickyScrollBlock({
      setBoxHeight: true,
      activeClass: 'fixed-position',
      container: '.page-wrapper',
      positionType: 'fixed',
      animDelay: 0,
      showAfterScrolled: false,
    });
  }

  // Hide Header on on scroll down
  initHeaderOnScrollDown() {
    let didScroll;
    let lastScrollTop = 0;
    const delta = 5;
    const navbarHeight = $('.sticky-wrap-header__panel').outerHeight();

    $(window).scroll((event) => {
      didScroll = true;
    });

    setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      const st = $(window).scrollTop();
      // Make sure they scroll more than delta

      if (Math.abs(lastScrollTop - st) <= delta) return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('.sticky-wrap-header__panel').removeClass('nav-down').addClass('nav-up');
      } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
          $('.sticky-wrap-header__panel').removeClass('nav-up').addClass('nav-down');
        }
      }

      lastScrollTop = st;
    }
  }

  initIosScroll() {
    ResponsiveHelper.addRange({
      '..1199': {
        on() {
          const $docEl = $('html, body');
          const $wrap = $('.page-wrapper');
          let scrollTop;

          $('.page-wrapper__opener').on('click', (e) => {
            window.headerPanel = $('.header__panel');
            window.stickyWrap = $('.sticky-wrap-header__panel');
            window.headerPanelStyle = headerPanel.attr('style');
            window.stickyWrapStyle = stickyWrap.attr('style');

            if ($('html').hasClass('scroll-fix')) {
              $.unlockBody();
              $('html').removeClass('scroll-fix');
            } else {
              $.lockBody();
              $('html').addClass('scroll-fix');
            }

            setTimeout(() => {
              window.headerPanel.attr('style', window.headerPanelStyle);
              window.stickyWrap.attr('style', window.stickyWrapStyle);

              if (window.headerPanelStyle !== '') {
                window.stickyWrap.addClass('fixed-position');
              }
            }, 100);
          });

          $.unlockBody = function () {
            $docEl.css({
              height: '',
              overflow: '',
            });

            $wrap.css({
              top: '',
            });
            window.scrollTo(0, scrollTop);
            window.setTimeout(() => {
              scrollTop = null;
            }, 0);
          };

          $.lockBody = function () {
            if (window.pageYOffset) {
              scrollTop = window.pageYOffset;
              $wrap.css({
                top: -scrollTop,
              });
            }

            $docEl.css({
              // height: "100%",
              // overflow: "hidden"
            });
          };
        },
        off() {
          $('.page-wrapper__opener').off();
        },
      },
    });
  }

  // mobile menu init
  initMobileNav() {
    $('body').mobileNav({
      menuActiveClass: 'menu-active',
      menuOpener: '.menu__opener',
      menuDrop: '.menu',
      hideOnClickOutside: false,
    });
  }

  // accordion menu init
  initAccordion() {
    document.querySelectorAll('.js-accordion').forEach((item) => {
      const accordion = new Accordion(item, {
        modal: true, // Limit the accordion to having only one fold open at a time.
        closeClass: 'close',
        enabledClass: 'enabled',
        openClass: 'open',
        heightOffset: 10,
        useBorders: true,
      });
    });

    ResponsiveHelper.addRange({
      '..1199': {
        on() {
          document.querySelectorAll('.js-menu-accordion').forEach((item) => {
            const accordionMenu = new Accordion(item, {
              modal: true, // Limit the accordion to having only one fold open at a time.
              noAria: true,
              closeClass: 'close',
              enabledClass: 'enabled',
              openClass: 'open',
              heightOffset: 0,
              useBorders: false,
            });
          });
        },
        off() {
        },
      },
    });

  }

  setHeaderHeight() {
    $(window).on('load resize scroll', () => {
      document.documentElement.style.setProperty('--header-height', $('#header').css('height'));
      document.documentElement.style.setProperty('--header-sticky-height', $('.header__panel').css('height'));
      document.documentElement.style.setProperty('--announcements-bar-height', $('.header__bar').css('height'));
    });
  }

  initCurrencySwitcher() {
    function currencyFormSubmit(event) {
      event.target.form.submit();
    }

    const currencySwitchers = document.querySelectorAll('.shopify-currency-form select');

    if (currencySwitchers.length) {
      currencySwitchers.forEach((el) => el.addEventListener('change', currencyFormSubmit));
    }
  }

  initLanguageSwitcher() {
    const [, pathname] = getLocaleAndPathname(theme.published_locales);
    const languageSwitchers = document.querySelectorAll('[name="locales"]');

    if (languageSwitchers.length) {
      languageSwitchers.forEach((el) =>
        el.addEventListener('change', (e) => {
          const selectedLocale = e.target.value;

          console.log('selectedLocale', selectedLocale);
          console.log('pathname', pathname);
          location.href = selectedLocale === '/' ? pathname : selectedLocale + pathname;
        })
      );
    }
  }

  initMap() {
    $(window).on('load', () => {
      const mapElement = document.getElementById('google-map');

      if (mapElement && google) {
        const map = new google.maps.Map(mapElement, {
          center: {
            lat: -34.397,
            lng: 150.644,
          },
          zoom: 10,
          disableDefaultUI: true,
        });

        new google.maps.Marker({
          position: {
            lat: -34.397,
            lng: 150.644,
          },
          map,
        });
      }
    });
  }

  fancyboxBackdrop() {
    const target = document.querySelector('body');

    const config = {
      childList: true,
    };

    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes[0] && mutation.addedNodes[0].Fancybox != undefined) {
          const backdrop = document.querySelector('.fancybox__slide.is-selected');

          backdrop.addEventListener('click', (e) => {
            e.preventDefault();
          });
          observer.disconnect();
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(target, config);
  }

  fancyboxModalCloseButton() {
    document.body.addEventListener('click', (e) => {
      'fancyboxClose' in e.target.dataset && window.fancybox.close(true);
    });
  }
}

const app = new App();
