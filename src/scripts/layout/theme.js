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

import { StickyStates } from 'helpers/stickyStates';
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
    this.initStickyBlocks();
    // this.initHeaderOnScrollDown();
    this.initIosScroll();
    this.initAccordion();
    this.initCurrencySwitcher();
    this.initLanguageSwitcher();
    this.fancyboxBackdrop();
    this.fancyboxModalCloseButton();

    // Responsive fluid iframe
    document.querySelectorAll('.rte iframe').forEach((iframe) => {
      const fluidHtml = document.createElement('div');
      fluidHtml.classList.add('fluid-iframe');
      fluidHtml.append(iframe);
    });

    if (!('ontouchstart' in document.documentElement)) {
      $('html').addClass('no-touch');
    }

    Fancybox.bind('[data-fancybox]', {});
  }

  // Initialize sticky blocks
  initStickyBlocks() {
    const stickyHeaderOptions = {
      elementSelector: '[data-sticky-states]',
      innerElementSelector: '[data-sticky-states-inner]',
      isStickyClass: 'fixed-position',
      positionAttribute: 'data-sticky-position',
      thresholdAttribute: 'data-sticky-threshold',
      stickyRelativeToAttribute: 'data-sticky-relative-to',
      staticAtEndAttribute: 'data-sticky-static-at-end',
      containerAttribute: 'data-sticky-container',
      // position: 'top', // Accepted values: `top`, `bottom`
      threshold: 0,
    };

    StickyStates.init(stickyHeaderOptions);
  }

  // Hide Header on on scroll down
  initHeaderOnScrollDown() {
    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;
    let navbarHeight = document.querySelector('.sticky-wrap-header__panel').offsetHeight;

    window.addEventListener('scroll', function(event) {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      let st = window.pageYOffset;
      const stickyWrapHeader = document.querySelector('.sticky-wrap-header__panel');
      // Make sure they scroll more than delta

      if (Math.abs(lastScrollTop - st) <= delta) return;
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        stickyWrapHeader.classList.remove('nav-down');
        stickyWrapHeader.classList.add('nav-up');
      } else {
        const body = document.body;
        const html = document.documentElement;
        const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        // Scroll Up
        if (st + window.innerHeight < documentHeight) {
          stickyWrapHeader.classList.remove('nav-up');
          stickyWrapHeader.classList.add('nav-down');
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
            if ($('html').hasClass('scroll-fix')) {
              $.unlockBody();
              $('html').removeClass('scroll-fix');
            } else {
              $.lockBody();
              $('html').addClass('scroll-fix');
            }
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
    const events = ['load', 'resize', 'scroll'];

    events.forEach((event) => {
      window.addEventListener(event, () => {
        const headerHight = document.querySelector('#header')?.getBoundingClientRect().height + 'px';
        const headerPanelHeight = document.querySelector('.header__panel')?.getBoundingClientRect().height + 'px';
        const headerBarHeight = document.querySelector('.header__bar')?.getBoundingClientRect().height + 'px';

        document.documentElement.style.setProperty('--header-height', headerHight);
        document.documentElement.style.setProperty('--header-sticky-height', headerPanelHeight);
        document.documentElement.style.setProperty('--announcements-bar-height', headerBarHeight);
      });

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
