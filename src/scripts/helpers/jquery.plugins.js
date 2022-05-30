/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function (a) {
  var n,
    e = [],
    i = a(window),
    t = !1;
  function c() {
    var t = i.width();
    t !== n &&
      ((n = t),
      a.each(e, function (n, e) {
        a.each(e.data, function (a, n) {
          n.currentActive &&
            !d(n.range[0], n.range[1]) &&
            ((n.currentActive = !1),
            'function' == typeof n.disableCallback && n.disableCallback());
        }),
          a.each(e.data, function (a, n) {
            !n.currentActive &&
              d(n.range[0], n.range[1]) &&
              ((n.currentActive = !0),
              'function' == typeof n.enableCallback && n.enableCallback());
          });
      }));
  }
  function d(a, e) {
    var i,
      c,
      d,
      o = '';
    return (
      a > 0 && (o += '(min-width: ' + a + 'px)'),
      e < 1 / 0 && (o += (o ? ' and ' : '') + '(max-width: ' + e + 'px)'),
      (i = o),
      (c = a),
      (d = e),
      window.matchMedia && t
        ? matchMedia(i).matches
        : window.styleMedia
        ? styleMedia.matchMedium(i)
        : window.media
        ? media.matchMedium(i)
        : n >= c && n <= d
    );
  }
  return (
    window.matchMedia &&
      (window.Window && window.matchMedia === Window.prototype.matchMedia
        ? (t = !0)
        : window.matchMedia.toString().indexOf('native') > -1 && (t = !0)),
    i.bind('load resize orientationchange', c),
    {
      addRange: function (i) {
        var t = { data: {} };
        a.each(i, function (a, n) {
          var e, i;
          t.data[a] = {
            range:
              ((e = a),
              (i = e.split('..')),
              [parseInt(i[0], 10) || -1 / 0, parseInt(i[1], 10) || 1 / 0].sort(
                function (a, n) {
                  return a - n;
                }
              )),
            enableCallback: n.on,
            disableCallback: n.off,
          };
        }),
          e.push(t),
          (n = null),
          c();
      },
    }
  );
})(jQuery);

/*
 * Simple Mobile Navigation
 */
!(function (t) {
  function i(i) {
    (this.options = t.extend(
      {
        container: null,
        hideOnClickOutside: !1,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '.nav-drop',
        toggleEvent: 'click',
        outsideClickEvent: 'click touchstart pointerdown MSPointerDown',
      },
      i
    )),
      this.initStructure(),
      this.attachEvents();
  }
  i.prototype = {
    initStructure: function () {
      (this.page = t('html')),
        (this.container = t(this.options.container)),
        (this.opener = this.container.find(this.options.menuOpener)),
        (this.drop = this.container.find(this.options.menuDrop));
    },
    attachEvents: function () {
      var i = this;
      e && (e(), (e = null)),
        (this.outsideClickHandler = function (e) {
          if (i.isOpened()) {
            var n = t(e.target);
            n.closest(i.opener).length || n.closest(i.drop).length || i.hide();
          }
        }),
        (this.openerClickHandler = function (t) {
          t.preventDefault(), i.toggle();
        }),
        this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function () {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function () {
      this.container.addClass(this.options.menuActiveClass),
        this.options.hideOnClickOutside &&
          this.page.on(
            this.options.outsideClickEvent,
            this.outsideClickHandler
          );
    },
    hide: function () {
      this.container.removeClass(this.options.menuActiveClass),
        this.options.hideOnClickOutside &&
          this.page.off(
            this.options.outsideClickEvent,
            this.outsideClickHandler
          );
    },
    toggle: function () {
      this.isOpened() ? this.hide() : this.show();
    },
    destroy: function () {
      this.container.removeClass(this.options.menuActiveClass),
        this.opener.off(this.options.toggleEvent, this.clickHandler),
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    },
  };
  var e = function () {
    var i,
      e,
      n = t(window),
      o = t('html'),
      s = 'resize-active',
      a = function () {
        (i = !1), o.removeClass(s);
      };
    n.on('resize orientationchange', function () {
      i || ((i = !0), o.addClass(s)), clearTimeout(e), (e = setTimeout(a, 500));
    });
  };
  t.fn.mobileNav = function (e) {
    var n = Array.prototype.slice.call(arguments),
      o = n[0];
    return this.each(function () {
      var s = jQuery(this),
        a = s.data('MobileNav');
      'object' == typeof e || void 0 === e
        ? s.data('MobileNav', new i(t.extend({ container: this }, e)))
        : 'string' == typeof o &&
          a &&
          'function' == typeof a[o] &&
          (n.shift(), a[o].apply(a, n));
    });
  };
})(jQuery);

/*
 * jQuery Accordion plugin
 */
('use strict');
var accHiddenClass = 'js-acc-hidden';

function SlideAccordion(options) {
  this.options = $.extend(
    true,
    {
      allowClickWhenExpanded: false,
      activeClass: 'active',
      opener: '.opener',
      slider: '.slide',
      animSpeed: 300,
      collapsible: true,
      event: 'click',
      scrollToActiveItem: {
        enable: false,
        breakpoint: 767, // max-width
        animSpeed: 600,
        extraOffset: null,
      },
    },
    options
  );
  this.init();
}

SlideAccordion.prototype = {
  init: function () {
    if (this.options.holder) {
      this.findElements();
      this.setStateOnInit();
      this.attachEvents();
      this.makeCallback('onInit');
    }
  },

  findElements: function () {
    this.$holder = $(this.options.holder).data('SlideAccordion', this);
    this.$items = this.$holder.find(':has(' + this.options.slider + ')');
  },

  setStateOnInit: function () {
    var self = this;

    this.$items.each(function () {
      if (!$(this).hasClass(self.options.activeClass)) {
        $(this).find(self.options.slider).addClass(accHiddenClass);
      }
    });
  },

  attachEvents: function () {
    var self = this;

    this.accordionToggle = function (e) {
      var $item = jQuery(this).closest(self.$items);
      var $actiItem = self.getActiveItem($item);

      if (
        !self.options.allowClickWhenExpanded ||
        !$item.hasClass(self.options.activeClass)
      ) {
        e.preventDefault();
        self.toggle($item, $actiItem);
      }
    };

    this.$items.on(
      this.options.event,
      this.options.opener,
      this.accordionToggle
    );
  },

  toggle: function ($item, $prevItem) {
    if (!$item.hasClass(this.options.activeClass)) {
      this.show($item);
    } else if (this.options.collapsible) {
      this.hide($item);
    }

    if (!$item.is($prevItem) && $prevItem.length) {
      this.hide($prevItem);
    }

    this.makeCallback('beforeToggle');
  },

  show: function ($item) {
    var $slider = $item.find(this.options.slider);

    $item.addClass(this.options.activeClass);
    $slider
      .stop()
      .hide()
      .removeClass(accHiddenClass)
      .slideDown({
        duration: this.options.animSpeed,
        complete: function () {
          $slider.removeAttr('style');
          if (
            this.options.scrollToActiveItem.enable &&
            window.innerWidth <= this.options.scrollToActiveItem.breakpoint
          ) {
            this.goToItem($item);
          }
          this.makeCallback('onShow', $item);
        }.bind(this),
      });

    this.makeCallback('beforeShow', $item);
  },

  hide: function ($item) {
    var $slider = $item.find(this.options.slider);

    $item.removeClass(this.options.activeClass);
    $slider
      .stop()
      .show()
      .slideUp({
        duration: this.options.animSpeed,
        complete: function () {
          $slider.addClass(accHiddenClass);
          $slider.removeAttr('style');
          this.makeCallback('onHide', $item);
        }.bind(this),
      });

    this.makeCallback('beforeHide', $item);
  },

  goToItem: function ($item) {
    var itemOffset = $item.offset().top;

    if (itemOffset < $(window).scrollTop()) {
      // handle extra offset
      if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
        itemOffset -= this.options.scrollToActiveItem.extraOffset;
      } else if (
        typeof this.options.scrollToActiveItem.extraOffset === 'function'
      ) {
        itemOffset -= this.options.scrollToActiveItem.extraOffset();
      }

      $('body, html').animate(
        {
          scrollTop: itemOffset,
        },
        this.options.scrollToActiveItem.animSpeed
      );
    }
  },

  getActiveItem: function ($item) {
    return $item.siblings().filter('.' + this.options.activeClass);
  },

  makeCallback: function (name) {
    if (typeof this.options[name] === 'function') {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      this.options[name].apply(this, args);
    }
  },

  destroy: function () {
    this.$holder.removeData('SlideAccordion');
    this.$items.off(
      this.options.event,
      this.options.opener,
      this.accordionToggle
    );
    this.$items.removeClass(this.options.activeClass).each(
      function (i, item) {
        $(item)
          .find(this.options.slider)
          .removeAttr('style')
          .removeClass(accHiddenClass);
      }.bind(this)
    );
    this.makeCallback('onDestroy');
  },
};

$.fn.slideAccordion = function (opt) {
  var args = Array.prototype.slice.call(arguments);
  var method = args[0];

  return this.each(function () {
    var $holder = jQuery(this);
    var instance = $holder.data('SlideAccordion');

    if (typeof opt === 'object' || typeof opt === 'undefined') {
      new SlideAccordion(
        $.extend(
          true,
          {
            holder: this,
          },
          opt
        )
      );
    } else if (typeof method === 'string' && instance) {
      if (typeof instance[method] === 'function') {
        args.shift();
        instance[method].apply(instance, args);
      }
    }
  });
};

(function () {
  var tabStyleSheet = $('<style type="text/css">')[0];
  var tabStyleRule = '.' + accHiddenClass;
  tabStyleRule +=
    '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
  if (tabStyleSheet.styleSheet) {
    tabStyleSheet.styleSheet.cssText = tabStyleRule;
  } else {
    tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
  }
  $('head').append(tabStyleSheet);
})();
