/*
 * Responsive Layout helper
 */
window.ResponsiveHelper=function(a){var n,e=[],i=a(window),t=!1;function c(){var t=i.width();t!==n&&(n=t,a.each(e,function(n,e){a.each(e.data,function(a,n){n.currentActive&&!d(n.range[0],n.range[1])&&(n.currentActive=!1,"function"==typeof n.disableCallback&&n.disableCallback())}),a.each(e.data,function(a,n){!n.currentActive&&d(n.range[0],n.range[1])&&(n.currentActive=!0,"function"==typeof n.enableCallback&&n.enableCallback())})}))}function d(a,e){var i,c,d,o="";return a>0&&(o+="(min-width: "+a+"px)"),e<1/0&&(o+=(o?" and ":"")+"(max-width: "+e+"px)"),i=o,c=a,d=e,window.matchMedia&&t?matchMedia(i).matches:window.styleMedia?styleMedia.matchMedium(i):window.media?media.matchMedium(i):n>=c&&n<=d}return window.matchMedia&&(window.Window&&window.matchMedia===Window.prototype.matchMedia?t=!0:window.matchMedia.toString().indexOf("native")>-1&&(t=!0)),i.bind("load resize orientationchange",c),{addRange:function(i){var t={data:{}};a.each(i,function(a,n){var e,i;t.data[a]={range:(e=a,i=e.split(".."),[parseInt(i[0],10)||-1/0,parseInt(i[1],10)||1/0].sort(function(a,n){return a-n})),enableCallback:n.on,disableCallback:n.off}}),e.push(t),n=null,c()}}}(jQuery);

/*
 * Simple Mobile Navigation
 */
!function(t){function i(i){this.options=t.extend({container:null,hideOnClickOutside:!1,menuActiveClass:"nav-active",menuOpener:".nav-opener",menuDrop:".nav-drop",toggleEvent:"click",outsideClickEvent:"click touchstart pointerdown MSPointerDown"},i),this.initStructure(),this.attachEvents()}i.prototype={initStructure:function(){this.page=t("html"),this.container=t(this.options.container),this.opener=this.container.find(this.options.menuOpener),this.drop=this.container.find(this.options.menuDrop)},attachEvents:function(){var i=this;e&&(e(),e=null),this.outsideClickHandler=function(e){if(i.isOpened()){var n=t(e.target);n.closest(i.opener).length||n.closest(i.drop).length||i.hide()}},this.openerClickHandler=function(t){t.preventDefault(),i.toggle()},this.opener.on(this.options.toggleEvent,this.openerClickHandler)},isOpened:function(){return this.container.hasClass(this.options.menuActiveClass)},show:function(){this.container.addClass(this.options.menuActiveClass),this.options.hideOnClickOutside&&this.page.on(this.options.outsideClickEvent,this.outsideClickHandler)},hide:function(){this.container.removeClass(this.options.menuActiveClass),this.options.hideOnClickOutside&&this.page.off(this.options.outsideClickEvent,this.outsideClickHandler)},toggle:function(){this.isOpened()?this.hide():this.show()},destroy:function(){this.container.removeClass(this.options.menuActiveClass),this.opener.off(this.options.toggleEvent,this.clickHandler),this.page.off(this.options.outsideClickEvent,this.outsideClickHandler)}};var e=function(){var i,e,n=t(window),o=t("html"),s="resize-active",a=function(){i=!1,o.removeClass(s)};n.on("resize orientationchange",function(){i||(i=!0,o.addClass(s)),clearTimeout(e),e=setTimeout(a,500)})};t.fn.mobileNav=function(e){var n=Array.prototype.slice.call(arguments),o=n[0];return this.each(function(){var s=jQuery(this),a=s.data("MobileNav");"object"==typeof e||void 0===e?s.data("MobileNav",new i(t.extend({container:this},e))):"string"==typeof o&&a&&"function"==typeof a[o]&&(n.shift(),a[o].apply(a,n))})}}(jQuery);

/*
 * jQuery sticky box plugin 
 */
;(function($, $win) {
  'use strict';

  function StickyScrollBlock($stickyBox, options) {
    this.options = options;
    this.$stickyBox = $stickyBox;
    this.init();
  }

  var StickyScrollBlockPrototype = {
    init: function() {
      this.findElements();
      this.attachEvents();
      this.makeCallback('onInit');
    },

    findElements: function() {
      // find parent container in which will be box move 
      this.$container = this.$stickyBox.closest(this.options.container);
      // define box wrap flag
      this.isWrap = this.options.positionType === 'fixed' && this.options.setBoxHeight;
      // define box move flag
      this.moveInContainer = !!this.$container.length;
      // wrapping box to set place in content
      if (this.isWrap) {
        this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent();
      }
      //define block to add active class
      this.parentForActive = this.getParentForActive();
      this.isInit = true;
    },

    attachEvents: function() {
      var self = this;

      // bind events
      this.onResize = function() {
        if (!self.isInit) return;
        self.resetState();
        self.recalculateOffsets();
        self.checkStickyPermission();
        self.scrollHandler();
      };

      this.onScroll = function() {
        self.scrollHandler();
      };

      // initial handler call
      this.onResize();

      // handle events
      $win.on('load resize orientationchange', this.onResize)
        .on('scroll', this.onScroll);
    },

    defineExtraTop: function() {
      // define box's extra top dimension
      var extraTop;

      if (typeof this.options.extraTop === 'number') {
        extraTop = this.options.extraTop;
      } else if (typeof this.options.extraTop === 'function') {
        extraTop = this.options.extraTop();
      }

      this.extraTop = this.options.positionType === 'absolute' ?
        extraTop :
        Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
    },

    checkStickyPermission: function() {
      // check the permission to set sticky
      this.isStickyEnabled = this.moveInContainer ?
        this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom :
        true;
    },

    getParentForActive: function() {
      if (this.isWrap) {
        return this.$stickyBoxWrap;
      }

      if (this.$container.length) {
        return this.$container;
      }

      return this.$stickyBox;
    },

    getWrapClass: function() {
      // get set of container classes
      try {
        return this.$stickyBox.attr('class').split(' ').map(function(name) {
          return 'sticky-wrap-' + name;
        }).join(' ');
      } catch (err) {
        return 'sticky-wrap';
      }
    },

    resetState: function() {
      // reset dimensions and state
      this.stickyFlag = false;
      this.$stickyBox.css({
        '-webkit-transition': '',
        '-webkit-transform': '',
        transition: '',
        transform: '',
        position: '',
        width: '',
        left: '',
        top: ''
      }).removeClass(this.options.activeClass);

      if (this.isWrap) {
        this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr('style');
      }

      if (this.moveInContainer) {
        this.$container.removeClass(this.options.activeClass);
      }
    },

    recalculateOffsets: function() {
      // define box and container dimensions
      this.winParams = this.getWindowParams();

      this.data = $.extend(
        this.getBoxOffsets(),
        this.getContainerOffsets()
      );

      this.defineExtraTop();
    },

    getBoxOffsets: function() {
      var boxOffset = this.$stickyBox.offset();
      var boxPosition = this.$stickyBox.position();

      return {
        // sticky box offsets
        boxOffsetLeft: boxOffset.left,
        boxOffsetTop: boxOffset.top,
        // sticky box positions
        boxTopPosition: boxPosition.top,
        boxLeftPosition: boxPosition.left,
        // sticky box width/height
        boxFullHeight: this.$stickyBox.outerHeight(true),
        boxHeight: this.$stickyBox.outerHeight(),
        boxWidth: this.$stickyBox.outerWidth()
      };
    },

    getContainerOffsets: function() {
      var containerOffset = this.moveInContainer ? this.$container.offset() : null;

      return containerOffset ? {
        // container offsets
        containerOffsetLeft: containerOffset.left,
        containerOffsetTop: containerOffset.top,
        // container height
        containerHeight: this.$container.outerHeight()
      } : {};
    },

    getWindowParams: function() {
      return {
        height: window.innerHeight || document.documentElement.clientHeight
      };
    },

    makeCallback: function(name) {
      if (typeof this.options[name] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },

    destroy: function() {
      this.isInit = false;
      // remove event handlers and styles
      $win.off('load resize orientationchange', this.onResize)
        .off('scroll', this.onScroll);
      this.resetState();
      this.$stickyBox.removeData('StickyScrollBlock');
      if (this.isWrap) {
        this.$stickyBox.unwrap();
      }
      this.makeCallback('onDestroy');
    }
  };

  var stickyMethods = {
    fixed: {
      scrollHandler: function() {
        this.winScrollTop = $win.scrollTop();
        var isActiveSticky = this.winScrollTop -
          (this.options.showAfterScrolled ? this.extraTop : 0) -
          (this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) >
          this.data.boxOffsetTop - this.extraTop;

        if (isActiveSticky) {
          this.isStickyEnabled && this.stickyOn();
        } else {
          this.stickyOff();
        }
      },

      stickyOn: function() {
        if (!this.stickyFlag) {
          this.stickyFlag = true;
          this.parentForActive.addClass(this.options.activeClass);
          this.$stickyBox.css({
            width: this.data.boxWidth,
            position: this.options.positionType
          });
          if (this.isWrap) {
            this.$stickyBoxWrap.css({
              height: this.data.boxFullHeight
            });
          }
          this.makeCallback('fixedOn');
        }
        this.setDynamicPosition();
      },

      stickyOff: function() {
        if (this.stickyFlag) {
          this.stickyFlag = false;
          this.resetState();
          this.makeCallback('fixedOff');
        }
      },

      setDynamicPosition: function() {
        this.$stickyBox.css({
          top: this.getTopPosition(),
          left: this.data.boxOffsetLeft - $win.scrollLeft()
        });
      },

      getTopPosition: function() {
        if (this.moveInContainer) {
          var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

          return Math.min(this.extraTop, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop);
        } else {
          return this.extraTop;
        }
      }
    },
    absolute: {
      scrollHandler: function() {
        this.winScrollTop = $win.scrollTop();
        var isActiveSticky = this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

        if (isActiveSticky) {
          this.isStickyEnabled && this.stickyOn();
        } else {
          this.stickyOff();
        }
      },

      stickyOn: function() {
        if (!this.stickyFlag) {
          this.stickyFlag = true;
          this.parentForActive.addClass(this.options.activeClass);
          this.$stickyBox.css({
            width: this.data.boxWidth,
            transition: 'transform ' + this.options.animSpeed + 's ease',
            '-webkit-transition': 'transform ' + this.options.animSpeed + 's ease',
          });

          if (this.isWrap) {
            this.$stickyBoxWrap.css({
              height: this.data.boxFullHeight
            });
          }

          this.makeCallback('fixedOn');
        }

        this.clearTimer();
        this.timer = setTimeout(function() {
          this.setDynamicPosition();
        }.bind(this), this.options.animDelay * 1000);
      },

      stickyOff: function() {
        if (this.stickyFlag) {
          this.clearTimer();
          this.stickyFlag = false;

          this.timer = setTimeout(function() {
            this.setDynamicPosition();
            setTimeout(function() {
              this.resetState();
            }.bind(this), this.options.animSpeed * 1000);
          }.bind(this), this.options.animDelay * 1000);
          this.makeCallback('fixedOff');
        }
      },

      clearTimer: function() {
        clearTimeout(this.timer);
      },

      setDynamicPosition: function() {
        var topPosition = Math.max(0, this.getTopPosition());

        this.$stickyBox.css({
          transform: 'translateY(' + topPosition + 'px)',
          '-webkit-transform': 'translateY(' + topPosition + 'px)'
        });
      },

      getTopPosition: function() {
        var currTopPosition = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

        if (this.moveInContainer) {
          var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
          var diffOffset = Math.abs(Math.min(0, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop - this.extraTop));

          return currTopPosition - diffOffset;
        } else {
          return currTopPosition;
        }
      }
    }
  };

  // jQuery plugin interface
  $.fn.stickyScrollBlock = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    var options = $.extend({
      container: null,
      positionType: 'fixed', // 'fixed' or 'absolute'
      activeClass: 'fixed-position',
      setBoxHeight: true,
      showAfterScrolled: false,
      extraTop: 0,
      extraBottom: 0,
      animDelay: 0.1,
      animSpeed: 0.2
    }, opt);

    return this.each(function() {
      var $stickyBox = jQuery(this);
      var instance = $stickyBox.data('StickyScrollBlock');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        StickyScrollBlock.prototype = $.extend(stickyMethods[options.positionType], StickyScrollBlockPrototype);
        $stickyBox.data('StickyScrollBlock', new StickyScrollBlock($stickyBox, options));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };

  // module exports
  window.StickyScrollBlock = StickyScrollBlock;
}(jQuery, jQuery(window)));

/*
 * jQuery Accordion plugin
 */
'use strict';
var accHiddenClass = 'js-acc-hidden';

function SlideAccordion(options) {
  this.options = $.extend(true, {
    allowClickWhenExpanded: false,
    activeClass:'active',
    opener:'.opener',
    slider:'.slide',
    animSpeed: 300,
    collapsible:true,
    event: 'click',
    scrollToActiveItem: {
      enable: false,
      breakpoint: 767, // max-width
      animSpeed: 600,
      extraOffset: null
    }
  }, options);
  this.init();
}

SlideAccordion.prototype = {
  init: function() {
    if (this.options.holder) {
      this.findElements();
      this.setStateOnInit();
      this.attachEvents();
      this.makeCallback('onInit');
    }
  },

  findElements: function() {
    this.$holder = $(this.options.holder).data('SlideAccordion', this);
    this.$items = this.$holder.find(':has(' + this.options.slider + ')');
  },

  setStateOnInit: function() {
    var self = this;

    this.$items.each(function() {
      if (!$(this).hasClass(self.options.activeClass)) {
        $(this).find(self.options.slider).addClass(accHiddenClass);
      }
    });
  },

  attachEvents: function() {
    var self = this;

    this.accordionToggle = function(e) {
      var $item = jQuery(this).closest(self.$items);
      var $actiItem = self.getActiveItem($item);

      if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
        e.preventDefault();
        self.toggle($item, $actiItem);
      }
    };

    this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
  },

  toggle: function($item, $prevItem) {
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

  show: function($item) {
    var $slider = $item.find(this.options.slider);

    $item.addClass(this.options.activeClass);
    $slider.stop().hide().removeClass(accHiddenClass).slideDown({
      duration: this.options.animSpeed,
      complete: function() {
        $slider.removeAttr('style');
        if (
          this.options.scrollToActiveItem.enable &&
          window.innerWidth <= this.options.scrollToActiveItem.breakpoint
        ) {
          this.goToItem($item);
        }
        this.makeCallback('onShow', $item);
      }.bind(this)
    });

    this.makeCallback('beforeShow', $item);
  },

  hide: function($item) {
    var $slider = $item.find(this.options.slider);

    $item.removeClass(this.options.activeClass);
    $slider.stop().show().slideUp({
      duration: this.options.animSpeed,
      complete: function() {
        $slider.addClass(accHiddenClass);
        $slider.removeAttr('style');
        this.makeCallback('onHide', $item);
      }.bind(this)
    });

    this.makeCallback('beforeHide', $item);
  },

  goToItem: function($item) {
    var itemOffset = $item.offset().top;

    if (itemOffset < $(window).scrollTop()) {
      // handle extra offset
      if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
        itemOffset -= this.options.scrollToActiveItem.extraOffset;
      } else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
        itemOffset -= this.options.scrollToActiveItem.extraOffset();
      }

      $('body, html').animate({
        scrollTop: itemOffset
      }, this.options.scrollToActiveItem.animSpeed);
    }
  },

  getActiveItem: function($item) {
    return $item.siblings().filter('.' + this.options.activeClass);
  },

  makeCallback: function(name) {
    if (typeof this.options[name] === 'function') {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      this.options[name].apply(this, args);
    }
  },

  destroy: function() {
    this.$holder.removeData('SlideAccordion');
    this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
    this.$items.removeClass(this.options.activeClass).each(function(i, item) {
      $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
    }.bind(this));
    this.makeCallback('onDestroy');
  }
};

$.fn.slideAccordion = function(opt) {
  var args = Array.prototype.slice.call(arguments);
  var method = args[0];

  return this.each(function() {
    var $holder = jQuery(this);
    var instance = $holder.data('SlideAccordion');

    if (typeof opt === 'object' || typeof opt === 'undefined') {
      new SlideAccordion($.extend(true, {
        holder: this
      }, opt));
    } else if (typeof method === 'string' && instance) {
      if(typeof instance[method] === 'function') {
        args.shift();
        instance[method].apply(instance, args);
      }
    }
  });
};

(function() {
  var tabStyleSheet = $('<style type="text/css">')[0];
  var tabStyleRule = '.' + accHiddenClass;
  tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
  if (tabStyleSheet.styleSheet) {
    tabStyleSheet.styleSheet.cssText = tabStyleRule;
  } else {
    tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
  }
  $('head').append(tabStyleSheet);
}());

/*!
 * SmoothScroll module
 */
// private variables
var page,
  win = $(window),
  activeBlock, activeWheelHandler,
  wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');
// animation handlers
function scrollTo(offset, options, callback) {
  // initialize variables
  var scrollBlock;
  if (document.body) {
    if (typeof options === 'number') {
      options = {
        duration: options
      };
    } else {
      options = options || {};
    }
    page = page || $('html, body');
    scrollBlock = options.container || page;
  } else {
    return;
  }
  // treat single number as scrollTop
  if (typeof offset === 'number') {
    offset = {
      top: offset
    };
  }
  // handle mousewheel/trackpad while animation is active
  if (activeBlock && activeWheelHandler) {
    activeBlock.off(wheelEvents, activeWheelHandler);
  }
  if (options.wheelBehavior && options.wheelBehavior !== 'none') {
    activeWheelHandler = function(e) {
      if (options.wheelBehavior === 'stop') {
        scrollBlock.off(wheelEvents, activeWheelHandler);
        scrollBlock.stop();
      } else if (options.wheelBehavior === 'ignore') {
        e.preventDefault();
      }
    };
    activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
  }
  // start scrolling animation
  scrollBlock.stop().animate({
    scrollLeft: offset.left,
    scrollTop: offset.top
  }, options.duration, function() {
    if (activeWheelHandler) {
      scrollBlock.off(wheelEvents, activeWheelHandler);
    }
    if ($.isFunction(callback)) {
      callback();
    }
  });
}
// smooth scroll contstructor
function SmoothScroll(options) {
  this.options = $.extend({
    anchorLinks: 'a[href^="#"]', // selector or jQuery object
    container: null, // specify container for scrolling (default - whole page)
    extraOffset: null, // function or fixed number
    activeClasses: null, // null, "link", "parent"
    easing: 'swing', // easing of scrolling
    animMode: 'duration', // or "speed" mode
    animDuration: 800, // total duration for scroll (any distance)
    animSpeed: 1500, // pixels per second
    anchorActiveClass: 'anchor-active',
    sectionActiveClass: 'section-active',
    wheelBehavior: 'stop', // "stop", "ignore" or "none"
    useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
  }, options);
  this.init();
}
SmoothScroll.prototype = {
  init: function() {
    this.initStructure();
    this.attachEvents();
    this.isInit = true;
  },
  initStructure: function() {
    var self = this;
    this.container = this.options.container ? $(this.options.container) : $('html,body');
    this.scrollContainer = this.options.container ? this.container : win;
    this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
      return jQuery(self.getAnchorTarget(jQuery(this))).length;
    });
  },
  getId: function(str) {
    try {
      return '#' + str.replace(/^.*?(#|$)/, '');
    } catch (err) {
      return null;
    }
  },
  getAnchorTarget: function(link) {
    // get target block from link href
    var targetId = this.getId($(link).attr('href'));
    return $(targetId.length > 1 ? targetId : 'html');
  },
  getTargetOffset: function(block) {
    // get target offset
    var blockOffset = block.offset().top;
    if (this.options.container) {
      blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
    }
    // handle extra offset
    if (typeof this.options.extraOffset === 'number') {
      blockOffset -= this.options.extraOffset;
    } else if (typeof this.options.extraOffset === 'function') {
      blockOffset -= this.options.extraOffset(block);
    }
    return {
      top: blockOffset
    };
  },
  attachEvents: function() {
    var self = this;
    // handle active classes
    if (this.options.activeClasses && this.anchorLinks.length) {
      // cache structure
      this.anchorData = [];
      for (var i = 0; i < this.anchorLinks.length; i++) {
        var link = jQuery(this.anchorLinks[i]),
          targetBlock = self.getAnchorTarget(link),
          anchorDataItem = null;
        $.each(self.anchorData, function(index, item) {
          if (item.block[0] === targetBlock[0]) {
            anchorDataItem = item;
          }
        });
        if (anchorDataItem) {
          anchorDataItem.link = anchorDataItem.link.add(link);
        } else {
          self.anchorData.push({
            link: link,
            block: targetBlock
          });
        }
      };
      // add additional event handlers
      this.resizeHandler = function() {
        if (!self.isInit) return;
        self.recalculateOffsets();
      };
      this.scrollHandler = function() {
        self.refreshActiveClass();
      };
      this.recalculateOffsets();
      this.scrollContainer.on('scroll', this.scrollHandler);
      win.on('resize load orientationchange refreshAnchor', this.resizeHandler);
    }
    // handle click event
    this.clickHandler = function(e) {
      self.onClick(e);
    };
    if (!this.options.useNativeAnchorScrolling) {
      this.anchorLinks.on('click', this.clickHandler);
    }
  },
  recalculateOffsets: function() {
    var self = this;
    $.each(this.anchorData, function(index, data) {
      data.offset = self.getTargetOffset(data.block);
      data.height = data.block.outerHeight();
    });
    this.refreshActiveClass();
  },
  toggleActiveClass: function(anchor, block, state) {
    anchor.toggleClass(this.options.anchorActiveClass, state);
    block.toggleClass(this.options.sectionActiveClass, state);
  },
  refreshActiveClass: function() {
    var self = this,
      foundFlag = false,
      containerHeight = this.container.prop('scrollHeight'),
      viewPortHeight = this.scrollContainer.height(),
      scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();
    // user function instead of default handler
    if (this.options.customScrollHandler) {
      this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
      return;
    }
    // sort anchor data by offsets
    this.anchorData.sort(function(a, b) {
      return a.offset.top - b.offset.top;
    });
    // default active class handler
    $.each(this.anchorData, function(index) {
      var reverseIndex = self.anchorData.length - index - 1,
        data = self.anchorData[reverseIndex],
        anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);
      if (scrollTop >= containerHeight - viewPortHeight) {
        // handle last section
        if (reverseIndex === self.anchorData.length - 1) {
          self.toggleActiveClass(anchorElement, data.block, true);
        } else {
          self.toggleActiveClass(anchorElement, data.block, false);
        }
      } else {
        // handle other sections
        if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
          foundFlag = true;
          self.toggleActiveClass(anchorElement, data.block, true);
        } else {
          self.toggleActiveClass(anchorElement, data.block, false);
        }
      }
    });
  },
  calculateScrollDuration: function(offset) {
    var distance;
    if (this.options.animMode === 'speed') {
      distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
      return (distance / this.options.animSpeed) * 1000;
    } else {
      return this.options.animDuration;
    }
  },
  onClick: function(e) {
    var targetBlock = this.getAnchorTarget(e.currentTarget),
      targetOffset = this.getTargetOffset(targetBlock);
    e.preventDefault();
    scrollTo(targetOffset, {
      container: this.container,
      wheelBehavior: this.options.wheelBehavior,
      duration: this.calculateScrollDuration(targetOffset)
    });
    this.makeCallback('onBeforeScroll', e.currentTarget);
  },
  makeCallback: function(name) {
    if (typeof this.options[name] === 'function') {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      this.options[name].apply(this, args);
    }
  },
  destroy: function() {
    var self = this;
    this.isInit = false;
    if (this.options.activeClasses) {
      win.off('resize load orientationchange refreshAnchor', this.resizeHandler);
      this.scrollContainer.off('scroll', this.scrollHandler);
      $.each(this.anchorData, function(index) {
        var reverseIndex = self.anchorData.length - index - 1,
          data = self.anchorData[reverseIndex],
          anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);
        self.toggleActiveClass(anchorElement, data.block, false);
      });
    }
    this.anchorLinks.off('click', this.clickHandler);
  }
};
// public API
$.extend(SmoothScroll, {
  scrollTo: function(blockOrOffset, durationOrOptions, callback) {
    scrollTo(blockOrOffset, durationOrOptions, callback);
  }
});
export {SmoothScroll};