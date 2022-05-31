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
