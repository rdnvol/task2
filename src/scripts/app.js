import $ from 'jquery';
import { load } from '@shopify/theme-sections';

import 'picturefill';

import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import 'Scripts/jquery.plugins.js'

// Account js
import 'Scripts/login.js'
import 'Scripts/addresses.js'

class App {
  constructor() {
    this.init()
  }
  init() {
    this.initIosScroll();
    this.initMobileNav();

    // Responsive fluid iframe
    $(".rte iframe").each(function (index) {
      $(this).wrap('<div class="fluid-iframe"></div>');
    });

    if (!('ontouchstart' in document.documentElement)) {
      $('html').addClass('no-touch');
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
            if ($('body').hasClass("scroll-fix")) {
              $.unlockBody();
              $('body').removeClass("scroll-fix");
            } else {
              $.lockBody();
              $('body').addClass("scroll-fix");
            }
          })
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
          }
          $.lockBody = function() {
            if (window.pageYOffset) {
              scrollTop = window.pageYOffset;
              $wrap.css({
                top: -(scrollTop)
              });
            }
            $docEl.css({
              height: "100%",
              overflow: "hidden"
            });
          }
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
      menuActiveClass: 'nav-active',
      menuOpener: '.menu__opener',
      menuDrop: '.menu',
      hideOnClickOutside: true
    });
  }
}

const app = new App();
