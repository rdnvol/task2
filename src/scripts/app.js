require("expose-loader?$!jquery");
import 'picturefill';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import 'Scripts/utils';

import 'Scripts/jquery.plugins'
import Swiper from 'swiper';
import fancybox from '@fancyapps/fancybox';
import product from "Scripts/product";
import "Scripts/related-product";
import cart from "Scripts/cart"

import { load } from '@shopify/theme-sections';
load('*');

// Account js
import 'Scripts/login'
import 'Scripts/addresses'


class App {
  constructor() {
    this.init();
    this.duplicateQuantityForMobile();
    product.init('#product');
    console.log(cart);
  }
  
  duplicateQuantityForMobile() {
    $('input[id^="updates_mobile_"]').change(function() {
      const key = $(this).data('key');
      $(`input[id^="updates_${key}"]`).val($(this).val());
    })
  }
  
  init() {
    this.initMobileNav();
    this.initStickyScrollBlock();
    // this.initHeaderOnScrollDown();
    this.initIosScroll();
    this.initAccordion();
    this.initProductGallery();
    this.initFancyboxAutoLoad();
    this.initTestimonialsSlider();

    // Responsive fluid iframe
    $(".rte iframe").each(function(index) {
      $(this).wrap('<div class="fluid-iframe"></div>');
    });

    if (!('ontouchstart' in document.documentElement)) {
      $('html').addClass('no-touch');
    }
  }

  // initialize fixed blocks on scroll
  initStickyScrollBlock() {
    $('.header__panel').stickyScrollBlock({
      setBoxHeight: true,
      activeClass: 'fixed-position',
      container: '.page-wrapper',
      positionType: 'fixed',
      animDelay: 0,
      showAfterScrolled: false
    });
  }

  // Hide Header on on scroll down
  initHeaderOnScrollDown() {
    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;
    let navbarHeight = $('.sticky-wrap-header__panel').outerHeight();

    $(window).scroll(function(event) {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      let st = $(window).scrollTop();
      // Make sure they scroll more than delta

      if (Math.abs(lastScrollTop - st) <= delta)
        return;
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
        on: function() {
          let $docEl = $('html, body'),
            $wrap = $('.page-wrapper'),
            scrollTop;
          $(".page-wrapper__opener").on("click", function(e) {
            window.headerPanel = $('.header__panel');
            window.stickyWrap = $('.sticky-wrap-header__panel');
            window.headerPanelStyle = headerPanel.attr('style');
            window.stickyWrapStyle = stickyWrap.attr('style');
            if ($('html').hasClass("scroll-fix")) {
              $.unlockBody();
              $('html').removeClass("scroll-fix");
            } else {
              $.lockBody();
              $('html').addClass("scroll-fix");
            }
            setTimeout(() => {
              window.headerPanel.attr('style', window.headerPanelStyle)
              window.stickyWrap.attr('style', window.stickyWrapStyle)
              if (window.headerPanelStyle !== '') {
                window.stickyWrap.addClass('fixed-position')
              }
            }, 100)
          });
          $.unlockBody = function() {
            $docEl.css({
              height: "",
              overflow: ""
            });
            $wrap.css({
              top: ''
            });
            window.scrollTo(0, scrollTop);
            window.setTimeout(function() {
              scrollTop = null;
            }, 0);
          };
          $.lockBody = function() {
            if (window.pageYOffset) {
              scrollTop = window.pageYOffset;
              $wrap.css({
                top: -(scrollTop)
              });
            }
            $docEl.css({
              // height: "100%",
              // overflow: "hidden"
            });
          };
        },
        off: function() {
          $(".page-wrapper__opener").off();
        }
      }
    });
  }

  // mobile menu init
  initMobileNav() {
    $('body').mobileNav({
      menuActiveClass: 'menu-active',
      menuOpener: '.menu__opener',
      menuDrop: '.menu',
      hideOnClickOutside: false
    });
  }

  // accordion menu init
  initAccordion() {
    ResponsiveHelper.addRange({
      '..1199': {
        on: function() {
          $('.menu-accordion').slideAccordion({
            allowClickWhenExpanded: true,
            activeClass: 'active',
            opener: '.menu-accordion__opener',
            slider: '.menu-accordion__slide',
            collapsible: true,
            event: 'click',
            animSpeed: 400
          });
        },
        off: function() {
          $('.menu-accordion').slideAccordion('destroy');
        }
      }
    });
  }

  initProductGallery() {
    var productGalleryThumbs  = new Swiper('.product-gallery-thumbs', {
      spaceBetween: 20,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      speed: 800,
      watchOverflow: true,
    });
    var productGallery  = new Swiper('.product-gallery', {
      speed: 800,
      // navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      thumbs: {
        swiper: productGalleryThumbs 
      }
    });
  }

  initFancyboxAutoLoad() {
    jQuery(document).ready(function($) {
      var cookie_popup1_name = 'show_cookie_message_popup1';
      if (getCookie(cookie_popup1_name) != 'no') {
        openFancybox(cookie_popup1_name)
      }
    });
    
    function openFancybox(cooke_name) {
      $.fancybox.open($('#age-popup'), {
        modal: true,
        autoFocus: false,
        afterClose: function(instance, slide) {
          setCookie(cooke_name, 'no', 365);
        }
      });
    };
    
    function setCookie(name, value, days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
      } else var expires = "";
      document.cookie = name + "=" + value + expires + "; path=/";
    }
    
    function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    
    function deleteCookie(name) {
      setCookie(name, "", -1);
    }
  }

  initTestimonialsSlider() {
    var testimonialsSlider = new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      watchOverflow: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      //   navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      breakpoints: {
        567: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 60,
        },
      }
    });
  }
}

const app = new App();

