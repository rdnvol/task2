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
