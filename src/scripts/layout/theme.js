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
import MobileNav from 'helpers/mobileNav';
import 'helpers/responsive-helper';

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
    this.responsiveFluidIframe();
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

    if (!('ontouchstart' in document.documentElement)) {
      document.documentElement.classList.add('no-touch');
    }

    Fancybox.bind('[data-fancybox]', {});
  }

  // Responsive fluid iframe
  responsiveFluidIframe() {
    document.querySelectorAll('.rte iframe').forEach((iframe) => {
      const fluidHtml = document.createElement('div');

      fluidHtml.classList.add('fluid-iframe');
      iframe.parentNode.appendChild(fluidHtml);
      fluidHtml.appendChild(iframe);
    });
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
    const delta = 5;
    const navbarHeight = document.querySelector('.sticky-wrap-header__panel').offsetHeight;

    window.addEventListener('scroll', () => {
      didScroll = true;
    });

    function hasScrolled() {
      const st = window.pageYOffset;
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
        const { body } = document;
        const html = document.documentElement;

        const documentHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );

        // Scroll Up
        if (st + window.innerHeight < documentHeight) {
          stickyWrapHeader.classList.remove('nav-up');
          stickyWrapHeader.classList.add('nav-down');
        }
      }

      lastScrollTop = st;
    }

    setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);
  }

  initIosScroll() {
    const html = document.documentElement;
    const { body } = document;
    const docEl = [html, body];
    const wrap = document.querySelector('.page-wrapper');
    const pageWrapperOpeners = document.querySelectorAll('.page-wrapper__opener');
    let scrollTop;

    function _unlockBody() {
      docEl.forEach((el) => {
        el.style.height = '';
        el.style.overflow = '';
        window.setTimeout(() => {
          el.style.scrollBehavior = 'smooth';
        }, 500);
      });
      wrap.style.top = '';
      window.scrollTo(0, scrollTop);
      window.setTimeout(() => {
        scrollTop = null;
      }, 0);
    }

    function _lockBody() {
      if (window.pageYOffset) {
        scrollTop = window.pageYOffset;
        wrap.style.top = `${-scrollTop}px`;
      }

      docEl.forEach((el) => {
        el.style.height = '100%';
        el.style.overflow = 'hidden';
        el.style.scrollBehavior = 'auto';
      });
    }

    function eventHandler() {
      if (document.documentElement.classList.contains('scroll-fix')) {
        _unlockBody();
        html.classList.remove('scroll-fix');
      } else {
        _lockBody();
        html.classList.add('scroll-fix');
      }
    }

    window.ResponsiveHelper.addRange({
      '..1199': {
        on() {
          pageWrapperOpeners.forEach((pageWrapperOpener) => {
            pageWrapperOpener.addEventListener('click', eventHandler);
          });
        },
        off() {
          pageWrapperOpeners.forEach((pageWrapperOpener) => {
            pageWrapperOpener.removeEventListener('click', eventHandler);
          });
        },
      },
    });
  }

  // mobile menu init
  initMobileNav() {
    window.onload = () => {
      new MobileNav('body', {
        menuActiveClass: 'menu-active',
        menuOpener: '.menu__opener',
        menuDrop: '.menu',
        hideOnClickOutside: false,
      });
    };
  }

  // accordion menu init
  initAccordion() {
    document.querySelectorAll('.js-accordion').forEach((item) => {
      new Accordion(item, {
        modal: true, // Limit the accordion to having only one fold open at a time.
        closeClass: 'close',
        enabledClass: 'enabled',
        openClass: 'open',
        heightOffset: 10,
        useBorders: true,
      });
    });

    window.ResponsiveHelper.addRange({
      '..1199': {
        on() {
          document.querySelectorAll('.js-menu-accordion').forEach((item) => {
            new Accordion(item, {
              modal: true, // Limit the accordion to having only one fold open at a time.
              noAria: true,
              closeClass: 'close',
              enabledClass: 'enabled',
              openClass: 'open',
              heightOffset: 0,
              useBorders: false,
              onToggle(fold) {
                const element = fold.el;

                if (element.classList.contains('fold-disabled')) {
                  const url = element.querySelector('a').getAttribute('href');

                  window.location.href = url;

                  return false;
                }
              },
            });
          });
        },
      },
    });
  }

  setHeaderHeight() {
    const events = ['load', 'resize', 'scroll'];

    events.forEach((event) => {
      window.addEventListener(event, () => {
        const headerHeight = `${document.querySelector('#header')?.getBoundingClientRect().height}px`;
        const headerPanelHeight = `${document.querySelector('.header__panel')?.getBoundingClientRect().height}px`;
        const headerBarHeight = `${document.querySelector('.header__bar')?.getBoundingClientRect().height}px`;

        document.documentElement.style.setProperty('--header-height', headerHeight);
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

    const callback = (mutationsList, currentObserver) => {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes[0] && mutation.addedNodes[0].Fancybox !== undefined) {
          const backdrop = document.querySelector('.fancybox__slide.is-selected');

          backdrop.addEventListener('click', (e) => {
            e.preventDefault();
          });
          currentObserver.disconnect();
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

new App();
