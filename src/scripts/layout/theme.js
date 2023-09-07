import 'styles/theme.scss';

// plugins

// Open-close details-utils
import '@zachleat/details-utils';

import { StickyStates } from 'helpers/stickyStates';
import MobileNav from 'helpers/mobileNav';
import { predictiveSearch } from 'sections/predictive-search';
import 'helpers/responsive-helper';

import 'store/store.ts';

// Cart
import 'components/Cart/CartReact';
import 'components/Cart/CartCount';
import 'components/Cart/CartPopup';
import 'components/CartDrawer/CartDrawerReact';

// utils
import { getLocaleAndPathname } from 'helpers/utils';

class App {
  constructor() {
    this.init();
  }

  init() {
    predictiveSearch();
    this.responsiveFluidIframe();
    this.setHeaderHeight();
    this.initMobileNav();
    this.initStickyBlocks();
    // this.initHeaderOnScrollDown();
    this.initIosScroll();
    this.initAccordion();
    this.initCurrencySwitcher();
    this.initLanguageSwitcher();
    this.fancyboxModalCloseButton();
    this.cartDrawer();

    if (!('ontouchstart' in document.documentElement)) {
      document.documentElement.classList.add('no-touch');
    }
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
    const accordions = document.querySelectorAll('.js-accordion');
    const menuAccordions = document.querySelectorAll('.js-menu-accordion');

    if (accordions.length > 0 || menuAccordions.length > 0) {
      import('accordion/src/accordion.css');
      import('accordion').then(({ Accordion }) => {
        accordions.length > 0 &&
          accordions.forEach((item) => {
            new Accordion(item, {
              modal: true, // Limit the accordion to having only one fold open at a time.
              noAria: true,
              closeClass: 'close',
              enabledClass: 'enabled',
              openClass: 'open',
              heightOffset: 10,
              useBorders: true,
            });
          });

        menuAccordions.length > 0 &&
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
      });
    }
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
    const currencySwitcher = document.querySelector('select[name="country_code"]');

    const generateSwitcherHTML = () => {
      const shopCurrencies = theme.published_currencies;
      let currencySwitcherHtml = '';

      shopCurrencies.forEach((currencyObj) => {
        const currencyOption = `<option value="${currencyObj.country_iso}" ${currencyObj.current && 'selected'}>
            ${currencyObj.country} (${currencyObj.currency} ${currencyObj.symbol})
          </option>`;

        currencySwitcherHtml += currencyOption;
      });

      currencySwitcher.innerHTML = currencySwitcherHtml;
    };

    const observer = new IntersectionObserver((entries, curObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          generateSwitcherHTML();

          if (currencySwitcher) currencySwitcher.addEventListener('change', this.onItemChange);

          curObserver.unobserve(currencySwitcher);
        }
      });
    });

    observer.observe(currencySwitcher);
  }

  onItemChange(event) {
    event.preventDefault();
    const form = event.target.closest('form');

    if (form) form.submit();
  }

  initLanguageSwitcher() {
    const [, pathname] = getLocaleAndPathname(theme.published_locales);
    const languageSwitchers = document.querySelectorAll('[name="locales"]');

    if (languageSwitchers.length) {
      languageSwitchers.forEach((el) =>
        el.addEventListener('change', (e) => {
          const selectedLocale = e.target.value;

          location.href = selectedLocale === '/' ? pathname : selectedLocale + pathname;
        })
      );
    }
  }

  fancyboxModalCloseButton() {
    document.body.addEventListener('click', (e) => {
      'fancyboxClose' in e.target.dataset && window.fancybox.close(true);
    });
  }

  cartDrawer() {
    const cartDrawerOpener = document.querySelectorAll('.cart-drawer-opener');
    const cartDrawerCloser = document.querySelectorAll('.cart-drawer-closer');
    const cartDrawer = document.querySelector('#cart-drawer');
    const bodyElement = document.querySelector('body');

    const openCartDrawer = (event) => {
      event?.preventDefault();
      bodyElement.classList.add('scroll-lock');
      cartDrawer.showModal();
      cartDrawer.removeAttribute('inert');
    };

    window.addEventListener('openCartDrawer', openCartDrawer);

    // open cartDrawer on cart button click
    cartDrawerOpener.forEach((item) => {
      item.addEventListener('click', openCartDrawer);
    });

    // close cartDrawer on close button click
    cartDrawerCloser.forEach((item) => {
      item.addEventListener('click', () => {
        bodyElement.classList.remove('scroll-lock');
        cartDrawer.close();
        cartDrawer.setAttribute('inert', '');
      });
    });

    // close cartDrawer on outside click
    cartDrawer.addEventListener('click', (e) => {
      const dialogDimensions = cartDrawer.getBoundingClientRect();

      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        bodyElement.classList.remove('scroll-lock');
        cartDrawer.close();
        cartDrawer.setAttribute('inert', '');
      }
    });

    // remove scroll lock on escape when cartDrawer is open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer.hasAttribute('open')) {
        bodyElement.classList.remove('scroll-lock');
        cartDrawer.setAttribute('inert', '');
      }
    });
  }
}

new App();
