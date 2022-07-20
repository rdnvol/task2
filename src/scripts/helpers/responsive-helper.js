/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function () {
  // init variables
  const handlers = [];
  let prevWinWidth;
  let nativeMatchMedia = false;

  const events = ['load', 'resize'];

  // detect match media support
  if (window.matchMedia) {
    if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
      nativeMatchMedia = true;
    } else if (window.matchMedia.toString().indexOf('native') > -1) {
      nativeMatchMedia = true;
    }
  }

  // media query function
  function matchQuery(query, r1, r2) {
    if (window.matchMedia && nativeMatchMedia) {
      return matchMedia(query).matches;
    }

    if (window.styleMedia) {
      return window.styleMedia.matchMedium(query);
    }

    if (window.media) {
      return window.media.matchMedium(query);
    }

    return prevWinWidth >= r1 && prevWinWidth <= r2;
  }

  // test range
  function matchRange(r1, r2) {
    let mediaQueryString = '';

    if (r1 > 0) {
      mediaQueryString += `(min-width: ${r1}px)`;
    }

    if (r2 < Infinity) {
      mediaQueryString += `${mediaQueryString ? ' and ' : ''}(max-width: ${r2}px)`;
    }

    return matchQuery(mediaQueryString, r1, r2);
  }

  // prepare resize handler
  function resizeHandler() {
    const winWidth = window.innerWidth;

    if (winWidth !== prevWinWidth) {
      prevWinWidth = winWidth;

      // loop through range groups
      handlers.forEach((rangeObject) => {
        // disable current active area if needed
        Object.values(rangeObject.data).forEach((item) => {
          if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
            item.currentActive = false;

            if (typeof item.disableCallback === 'function') {
              item.disableCallback();
            }
          }
        });

        // enable areas that match current width
        Object.values(rangeObject.data).forEach((item) => {
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

  events.forEach((event) => {
    window.addEventListener(event, resizeHandler);
  });

  // range parser
  function parseRange(rangeStr) {
    const rangeData = rangeStr.split('..');
    const x1 = parseInt(rangeData[0], 10) || -Infinity;
    const x2 = parseInt(rangeData[1], 10) || Infinity;

    return [x1, x2].sort((a, b) => a - b);
  }

  // export public functions
  return {
    addRange(ranges) {
      // parse data and add items to collection
      const result = {
        data: {},
      };

      Object.keys(ranges).forEach((property) => {
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
})();
