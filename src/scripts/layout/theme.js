import 'styles/theme.scss';
import '@fancyapps/ui/dist/fancybox.css';

// plugins
import 'picturefill';
import 'lazysizes/plugins/object-fit/ls.object-fit.js';
import 'lazysizes/plugins/parent-fit/ls.parent-fit.js';
import 'lazysizes/plugins/rias/ls.rias.js';
import 'lazysizes/plugins/bgset/ls.bgset.js';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg.js';
import { Fancybox } from '@fancyapps/ui';
import '@zachleat/details-utils';

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
    let delta = 5;
    let navbarHeight = $('.sticky-wrap-header__panel').outerHeight();

    $(window).scroll(function (event) {
      didScroll = true;
    });

    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      let st = $(window).scrollTop();
      // Make sure they scroll more than delta

      if (Math.abs(lastScrollTop - st) <= delta) return;
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('.sticky-wrap-header__panel')
          .removeClass('nav-down')
          .addClass('nav-up');
      } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
          $('.sticky-wrap-header__panel')
            .removeClass('nav-up')
            .addClass('nav-down');
        }
      }
      lastScrollTop = st;
    }
  }

  initIosScroll() {
    ResponsiveHelper.addRange({
      '..1199': {
        on: function () {
          let $docEl = $('html, body'),
            $wrap = $('.page-wrapper'),
            scrollTop;
          $('.page-wrapper__opener').on('click', function (e) {
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
            window.setTimeout(function () {
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
        off: function () {
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
    ResponsiveHelper.addRange({
      '..1199': {
        on: function () {
          $('.menu-accordion').slideAccordion({
            allowClickWhenExpanded: true,
            activeClass: 'active',
            opener: '.menu-accordion__opener',
            slider: '.menu-accordion__slide',
            collapsible: true,
            event: 'click',
            animSpeed: 400,
          });
        },
        off: function () {
          $('.menu-accordion').slideAccordion('destroy');
        },
      },
    });

    $('.accordion').slideAccordion({
      allowClickWhenExpanded: false,
      activeClass: 'accordion--active',
      opener: '.accordion__opener',
      slider: '.accordion__slide',
      collapsible: true,
      event: 'click',
      animSpeed: 400,
    });
  }

  setHeaderHeight() {
    $(window).on('load resize scroll', function () {
      document.documentElement.style.setProperty(
        '--header-height',
        $('#header').css('height')
      );
      document.documentElement.style.setProperty(
        '--header-sticky-height',
        $('.header__panel').css('height')
      );
      document.documentElement.style.setProperty(
        '--announcements-bar-height',
        $('.header__bar').css('height')
      );
    });
  }

  initCurrencySwitcher() {
    function currencyFormSubmit(event) {
      event.target.form.submit();
    }
    let currencySwitchers = document.querySelectorAll(
      '.shopify-currency-form select'
    );
    if (currencySwitchers.length) {
      currencySwitchers.forEach((el) =>
        el.addEventListener('change', currencyFormSubmit)
      );
    }
  }

  initLanguageSwitcher() {
    const [curLocale, pathname] = getLocaleAndPathname(theme.published_locales);
    let languageSwitchers = document.querySelectorAll('[name="locales"]');
    if (languageSwitchers.length) {
      languageSwitchers.forEach((el) =>
        el.addEventListener('change', (e) => {
          let selectedLocale = e.target.value;
          console.log('selectedLocale', selectedLocale);
          console.log('pathname', pathname);
          location.href =
            selectedLocale === '/' ? pathname : selectedLocale + pathname;
        })
      );
    }
  }

  initMap() {
    $(window).on('load', function () {
      const mapElement = document.getElementById('google-map');
      if (mapElement && google) {
        let map = new google.maps.Map(mapElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 10,
          disableDefaultUI: true,
        });
        new google.maps.Marker({
          position: { lat: -34.397, lng: 150.644 },
          map,
        });
      }
    });
  }

  fancyboxBackdrop() {
    let target = document.querySelector('body');
    const config = {
      childList: true,
    };

    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (
          mutation.addedNodes[0] &&
          mutation.addedNodes[0]['Fancybox'] != undefined
        ) {
          const backdrop = document.querySelector(
            '.fancybox__slide.is-selected'
          );
          backdrop.addEventListener('click', function (e) {
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
