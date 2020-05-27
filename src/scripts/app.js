$ = window.$ = jQuery = window.jQuery = require('jquery');
import 'picturefill';

import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import 'Scripts/jquery.plugins'

import product from "Scripts/product";
import "Scripts/related-product";

import { load } from '@shopify/theme-sections';
load('product-recommendations');

// Account js
import 'Scripts/login'
import 'Scripts/addresses'


class App {
  constructor() {
    this.init();
    product.init('#product');
  }
  init() {

    // Responsive fluid iframe
    $(".rte iframe").each(function (index) {
      $(this).wrap('<div class="fluid-iframe"></div>');
    });

    if (!('ontouchstart' in document.documentElement)) {
      $('html').addClass('no-touch');
    }
  }
}

const app = new App();
