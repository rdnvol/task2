/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function () {
  // init variables
  let handlers = [],
    prevWinWidth,
    nativeMatchMedia = false;

  // detect match media support
  if (window.matchMedia) {
    if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
      nativeMatchMedia = true;
    } else if (window.matchMedia.toString().indexOf('native') > -1) {
      nativeMatchMedia = true;
    }
  }
  // prepare resize handler
  function resizeHandler() {
    let winWidth = window.innerWidth;
    if (winWidth !== prevWinWidth) {
      prevWinWidth = winWidth;

      // loop through range groups
      handlers.forEach(function (rangeObject, index) {
        // disable current active area if needed
        Object.values(rangeObject.data).forEach(function (item, index) {
          if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
            item.currentActive = false;
            if (typeof item.disableCallback === 'function') {
              item.disableCallback();
            }
          }
        });

        // enable areas that match current width
        Object.values(rangeObject.data).forEach(function (item, index) {
          if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if (typeof item.enableCallback === 'function') {
              item.enableCallback();
            }
          }
        });
      });
    }
  }

  $(window).bind('load resize orientationchange', resizeHandler);

  // test range
  function matchRange(r1, r2) {
    let mediaQueryString = '';
    if (r1 > 0) {
      mediaQueryString += '(min-width: ' + r1 + 'px)';
    }
    if (r2 < Infinity) {
      mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
    }
    return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
    if (window.matchMedia && nativeMatchMedia) {
      return matchMedia(query).matches;
    } else if (window.styleMedia) {
      return styleMedia.matchMedium(query);
    } else if (window.media) {
      return media.matchMedium(query);
    } else {
      return prevWinWidth >= r1 && prevWinWidth <= r2;
    }
  }

  // range parser
  function parseRange(rangeStr) {
    let rangeData = rangeStr.split('..');
    let x1 = parseInt(rangeData[0], 10) || -Infinity;
    let x2 = parseInt(rangeData[1], 10) || Infinity;
    return [x1, x2].sort(function(a, b) {
      return a - b;
    });
  }

  // export public functions
  return {
    addRange: function(ranges) {
      // parse data and add items to collection
      let result = {
        data: {},
      };
      Object.keys(ranges).forEach(function(property, index) {
        result.data[property] = {
          range: parseRange(property),
          enableCallback: ranges[property].on,
          disableCallback: ranges[property].off,
        };
      });
      handlers.push(result);

      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    },
  };
}());
