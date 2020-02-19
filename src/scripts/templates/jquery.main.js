var SLIDER_SWIPER = {
  effect: 'slide',
  slidesPerView: 1.2,
  spaceBetween: 10,
  loop: true,
  loopedSlides: 1,
  centeredSlides: true,
  keyboard: {
    enabled: true,
  },
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

var FADE_SWIPER = {
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  loopedSlides: 3,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  observer: true,
  observeParents: true,
  keyboard: {
    enabled: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

var arrSize = [
    {from: 1700, to: 1900, value: 4},
    {from: 1900, to: 2100, value: 4.5},
    {from: 2100, to: 2300, value: 5},
    {from: 2300, to: 2500, value: 5.4},
    {from: 2500, to: 2700, value: 6},
    {from: 2700, to: 2900, value: 6.2},
    {from: 2900, to: 3100, value: 6.7},
    {from: 3100, to: 3300, value: 7.1},
    {from: 3300, to: 3500, value: 7.5},
    {from: 3500, to: 3700, value: 8.4},
    {from: 3700, to: 3900, value: 8.4},
    {from: 3900, to: 4100, value: 8.7},
];

jQuery(function() {
  initInput();
  initGallery();
  initStickyScrollBlock();
  initHeaderOnScrollDown();
  initFixedScrollBlock();
  initOpenClose();
  initAccordion();
  initMobileNav();
  initMarquee();
  initBackgroundVideo();
  initAnchors();
  initCollectionGallery();
  initDotDotDot();
  initCollageResize();
  initInViewport();
  initCustomScroll();
  initCustomForms();
  initFancybox();
  initEasyZoom();
  changeModel();
  validateEmail();
  initToggleOpenCloser();
  plpProtected();

  // Responsive fluid iframe
  $(".entry iframe").each(function (index) {
    $(this).wrap('<div class="fluid-iframe"></div>');
  });
});

if(!('ontouchstart' in document.documentElement)){
  $('html').addClass('no-touch');
}

function initCollageResize() {
  var swiper = null;
  var $window = $(window);
  $window.resize(function() {
    var ww = $window.width();
    if (swiper && swiper.length) {
      swiper.forEach(function(s) {
          s.destroy(true, true)
      });
    }
    if (ww <= 1023) {
      swiper = new Swiper ('.collage-gallery', SLIDER_SWIPER);
    } else {
      swiper = new Swiper ('.collage-gallery', FADE_SWIPER);
    }
      if (swiper && swiper.length) {
          swiper.forEach(function (s) {
              s.update();
          });
      }
  });
  $window.trigger('resize');
}

function initCollectionGallery() {
    var $window = $(window);
    var $featuredItem = $('.js-featured-item');
    var $featuredItemAlt = $('.js-featured-item--alt');
    var $collectionGallery = $('.js-collection-gallery');
    var $colContainer = $('.js-feature-item-col');
    var $featuredItemText = $('.js-featured-item-text');
    var $featuredItemButton = $('.js-featured-item-button');
    var $section = $('.js-section-container');
    var isAnimated = false;
    var isOpened = false;
    var galleryPosition = 0;
    var lastScrollTop = 0;
    var ww = 0;
    //Init hero gallery
    $window.resize(function() { ww = $window.width() });
    new Swiper('.collection-gallery', {
        loop: true,
        loopedSlides: 6,
        slidesPerView: 1.6,
        slidesPerGroup: 1,
        spaceBetween: 21,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            resize: function() {
                var sliders = arrSize.filter(function(cur) {
                    if (ww > cur.from && ww < cur.to) {
                        return cur
                    }
                })[0];
                if (ww > 1700 && sliders && Object.keys(sliders).length) {
                    if (isOpened) {
                        $colContainer.css({height: $featuredItemAlt.height() - 79});
                        this.params.slidesPerView = sliders.value;
                    } else {
                        this.params.slidesPerView = 1.6;
                    }
                    this.update();
                }
                if (ww > 1500 && ww < 1700) {
                    if (isOpened) {
                        $colContainer.css({height: $featuredItemAlt.height() - 79});
                        this.params.slidesPerView = 3.8;
                    } else {
                        this.params.slidesPerView = 1.6;
                    }
                    this.update();
                }
                if (ww>1199 && ww<1500) {
                    if (isOpened) {
                        $colContainer.css({height: $featuredItemAlt.height() - 79});
                        this.params.slidesPerView = 3.4;
                    } else {
                        this.params.slidesPerView = 1.6;
                    }
                    this.update();
                }
                if (ww>1023 && ww<=1199) {
                    if (isOpened) {
                        this.params.slidesPerView = 3.2;
                        $colContainer.css({height: $featuredItemAlt.height() - 79});
                    } else {
                        this.params.slidesPerView = 1.6;
                    }
                    this.update();
                }
                if (ww<=1023) {
                    this.params.slidesPerView = 2;
                    if (isAnimated) {
                        isAnimated = false;
                        $featuredItem.animate({opacity: 1}, {duration: 1200});
                        $featuredItemText.animate({opacity: 1}, {duration: 1200});
                        $featuredItemButton.animate({opacity: 1}, {duration: 1200});
                        $collectionGallery
                            .animate({ left: galleryPosition }, {
                                duration: 1500,
                                complete: function () {
                                    var $this = $(this);
                                    $this.css({position: 'relative'});
                                    $this.css({left: 0});
                                    $colContainer.removeAttr('style');
                                }});
                    }
                    isOpened = false;
                    this.update();
                }
            },
            progress: function() {
                if (!isAnimated && ww >= 1024 && this.realIndex > 0) {
                    isAnimated = true;
                    $collectionGallery.removeAttr('style');
                    $colContainer.css({position: 'static', height: $featuredItemAlt.height() - 49});
                    $featuredItem.delay(1100).animate({opacity: 0}, {duration: 800});
                    $featuredItemText.delay(1100).animate({opacity: 0}, {duration: 800});
                    $featuredItemButton.delay(1100).animate({opacity: 0}, {duration: 800});
                    $collectionGallery
                        .css({position: 'absolute', zIndex: 9, width: '100%'})
                        .animate({ left: 0 }, {
                            duration: 1500,
                            start: function () {
                                var $this = $(this);
                                galleryPosition = $this.position().left;
                            }});
                    isOpened = true;
                }
                if (ww >= 1024 && isAnimated && this.realIndex === 0) {
                    isAnimated = false;
                    $featuredItem.animate({opacity: 1}, {duration: 1200});
                    $featuredItemText.animate({opacity: 1}, {duration: 1200});
                    $featuredItemButton.animate({opacity: 1}, {duration: 1200});
                    $collectionGallery
                        .animate({ left: galleryPosition }, {
                            duration: 1500,
                            complete: function () {
                                var $this = $(this);
                                $this.css({position: 'relative'});
                                $this.css({left: 0});
                                $colContainer.removeAttr('style');
                            }});
                    isOpened = false;
                }
            }
        },
    });
    // animation on scroll
    $(document).on("scroll", function () {
        var st = $(this).scrollTop();
        var scrollParams = isScrolledIntoView($section, $window);
        if (st > lastScrollTop && !isAnimated && ww >= 1024) {
            if (scrollParams.intoView) {
                isAnimated = true;
                isOpened = true;
                $collectionGallery.removeAttr('style');
                $colContainer.css({position: 'static', height: $featuredItemAlt.height() - 49});
                $featuredItem.delay(1100).animate({opacity: 0}, {duration: 800});
                $featuredItemText.delay(1100).animate({opacity: 0}, {duration: 800});
                $featuredItemButton.delay(1100).animate({opacity: 0}, {duration: 800});
                $collectionGallery
                    .css({position: 'absolute', zIndex: 10, width: '100%'})
                    .animate({left: 0}, {
                        duration: 1500,
                        start: function () {
                            var $this = $(this);
                            galleryPosition = $this.position().left;
                        },
                    });
            }
        }
        lastScrollTop = st;
    })
}

function isScrolledIntoView($elem, $window) {
    var $docViewTop = $window.scrollTop();
    var $docViewBottom = $docViewTop + $window.height();
    var elemTop = $elem.offset() ? $elem.offset().top : 0;
    var elemBottom = elemTop + $elem.height();

    return {
        isTop: $docViewTop >= elemTop,
        intoView: ((elemBottom <= $docViewBottom) && (elemTop >= $docViewTop)),
        isBottom: $docViewTop >= elemBottom,
    }
}

// open-close init
function initOpenClose() {
  $('.open-close').openClose({
    activeClass: 'active',
    opener: '.open-close__opener',
    slider: '.open-close__slide',
    animSpeed: 400,
    effect: 'slide',
    hideOnClickOutside: true
  });
  $('.open-close__account').openClose({
    activeClass: 'active',
    opener: '.open-close__account__opener',
    slider: '.open-close__account__slide',
    animSpeed: 400,
    effect: 'slide',
    hideOnClickOutside: false
  });
  $('body').openClose({
    activeClass: 'header-search--active',
    opener: '.open-close__opener__fade',
    slider: '.open-close__slide__fade',
    animSpeed: 400,
    effect: 'fade',
    hideOnClickOutside: false
  });
  $('body').openClose({
    activeClass: 'open-close-fade--active',
    opener: '.open-close-fade__opener',
    slider: '.open-close-fade__slide',
    animSpeed: 0,
    effect: 'fade',
    hideOnClickOutside: false
  });
  $('.category-sorting__open-close').openClose({
    activeClass: 'active',
    opener: '.category-sorting__open-close__opener',
    slider: '.category-sorting__open-close__slide',
    animSpeed: 400,
    effect: 'slide',
    hideOnClickOutside: false,
  });
  $('.open-close-secondary').openClose({
    activeClass: 'open-close-secondary--active',
    opener: '.open-close-secondary__opener',
    slider: '.open-close-secondary__slide',
    animSpeed: 200,
    effect: 'slide',
    hideOnClickOutside: true
  });
  ResponsiveHelper.addRange({
    '..1023': {
      on: function() {
        $('.open-close-mobile').openClose({
          activeClass: 'active',
          opener: '.open-close-mobile__opener',
          slider: '.open-close-mobile__slide',
          animSpeed: 400,
          effect: 'slide',
          hideOnClickOutside: true
        });
      },
      off: function() {
        $('.open-close-mobile').openClose('destroy');
      }
    }
  });
  ResponsiveHelper.addRange({
    '..1199': {
      on: function() {
        $('.open-close-megamenu').openClose({
          activeClass: 'active',
          opener: '.open-close-megamenu__opener',
          slider: '.open-close-megamenu__slide',
          animSpeed: 400,
          effect: 'slide',
          hideOnClickOutside: true
        });
      },
      off: function() {
        $('.open-close-megamenu').openClose('destroy');
      }
    }
  });
  ResponsiveHelper.addRange({
    '1200..': {
      on: function() {
        $('.shoping-bag-open-close').openClose({
          activeClass: 'active',
          opener: '.shoping-bag-open-close__opener',
          slider: '.shoping-bag-open-close__slide',
          animSpeed: 400,
          effect: 'fade',
          event: 'hover',
          hideOnClickOutside: false
        });
      },
      off: function() {
        $('.shoping-bag-open-close').openClose('destroy');
      }
    }
  });
  $('.product-block__models-switcher').openClose({
    activeClass: 'product-block__models-switcher--active',
    opener: '.product-block__models-switcher__opener',
    slider: '.product-block__models-switcher__slide',
    animSpeed: 400,
    effect: 'slide',
    hideOnClickOutside: true
  });
  $(".add-to-bag-block__opener").on('click', function (event) {
    event.preventDefault();
    $('body').toggleClass('add-to-bag--active');
    event.stopPropagation();
  });
  $(".page-overlay").click(function (i) {
    $('body').removeClass('add-to-bag--active');
    console.log("close");
  });
  ResponsiveHelper.addRange({
    '..767': {
      on: function() {
        $('.account-menu-open-close').openClose({
          activeClass: 'active',
          opener: '.account-menu-open-close__opener',
          slider: '.account-menu-open-close__slide',
          animSpeed: 400,
          effect: 'slide',
          hideOnClickOutside: true
        });
      },
      off: function() {
        $('.account-menu-open-close').openClose('destroy');
      }
    }
  });
}

// accordion menu init
function initAccordion() {
  $('.accordion').slideAccordion({
    opener: '.accordion__opener',
    slider: '.accordion__slide',
    animSpeed: 300
  });
  ResponsiveHelper.addRange({
    '..1199': {
      on: function () {
        $('.megamenu').slideAccordion({
          opener: '.megamenu__opener',
          slider: '.megamenu__slide',
          animSpeed: 300,
          addClassBeforeAnimation: false,
          allowClickWhenExpanded: true,
          collapsible: true
        });
      },
      off: function () {
        $('.megamenu').slideAccordion('destroy');
      }
    }
  });
}

// mobile menu init
function initMobileNav() {
  $('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.menu__opener',
    menuDrop: '.menu',
    hideOnClickOutside: true
  });
}

// initialize fixed blocks on scroll
function initStickyScrollBlock() {
  $('#header').stickyScrollBlock({
    setBoxHeight: true,
    activeClass: 'fixed-position',
    container: '#wrapper',
    positionType: 'fixed',
    animDelay: 0.1,
    showAfterScrolled: true
  });
  $('.sticky-block').stickyScrollBlock({
    setBoxHeight: true,
    activeClass: '',
    container: '#main',
    positionType: 'fixed',
    // extraTop: function() {
    //   var totalHeightScroll = 0;
    //   jQuery('#header').each(function() {
    //     totalHeightScroll += jQuery(this).outerHeight() + 20;
    //   });
    //   return totalHeightScroll;
    // },
    animDelay: 0.5,
    showAfterScrolled: true
  });
  // $('.product-fancybox__sticky-block').stickyScrollBlock({
  //   setBoxHeight: true,
  //   container: '.product-fancybox__frame',
  //   positionType: 'fixed',
  //   // extraTop: function() {
  //   //   var totalHeightScroll = 0;
  //   //   jQuery('#header').each(function() {
  //   //     totalHeightScroll += jQuery(this).outerHeight() + 20;
  //   //   });
  //   //   return totalHeightScroll;
  //   // },
  //   animDelay: 0.5,
  //   showAfterScrolled: false
  // });
  ResponsiveHelper.addRange({
    '..767': {
      on: function () {
        $('.category-sorting__btns').stickyScrollBlock({
          setBoxHeight: true,
          activeClass: 'fixed-position',
          container: '#wrapper',
          positionType: 'fixed',
          // extraTop: function() {
          //   var totalHeightScroll = 0;
          //   jQuery('#header').each(function() {
          //     totalHeightScroll += jQuery(this).outerHeight() + 20;
          //   });
          //   return totalHeightScroll;
          // },
          animDelay: 0.2,
          showAfterScrolled: true
        });
      },
      off: function () {
        $('.category-sorting__btns').stickyScrollBlock('destroy');
      }
    }
  });
}

// initialize fixed blocks on scroll
function initFixedScrollBlock() {
  $('.product-fancybox__sticky-block').sticky();
}

function initHeaderOnScrollDown() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.sticky-wrap').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If scrolled down and past the navbar, add class .nav-up.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('.sticky-wrap').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('.sticky-wrap').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }
}

// running line init
function initMarquee() {
    $(document).ready(function () {
        $('.js-marquee').removeClass('invisible');
    });
    $('.marquee').marquee({
        speed: 50,
        //gap in pixels between the tickers
        gap: 10,
        //'left' or 'right'
        direction: 'left',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true,
        startVisible: true,
    });
    $('.marquee-2').marquee({
        speed: 50,
        //gap in pixels between the tickers
        gap: 10,
        //'left' or 'right'
        direction: 'right',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true,
        startVisible: true,
    })
}

function initGallery() {
  //Init hero gallery
  var heroSwiper = new Swiper ('.hero-gallery', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

   window.productGalleryThumbs = new Swiper('.product-block__gallery__thumbs', {
    slidesPerGroup: 1,
    spaceBetween: 5,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 6,
        slidesPerGroup: 2,
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  window.productGallery = new Swiper ('.product-block__gallery', {
    slidesPerView: 1.07,
    spaceBetween: 10,
    loop: true,
    speed: 800,
    breakpoints: {
      768: {
        slidesPerView: 2,
      }
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // If we need pagination
    thumbs: {
      swiper: productGalleryThumbs,
    },
  });

  var productSliderThumbs = new Swiper('.product-block__slider__thumbs', {
    direction: 'vertical',
    spaceBetween: 5,
    slidesPerView: "5",
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });

  var productSlider = new Swiper ('.product-block__slider', {
    slidesPerView: 1.07,
    spaceBetween: 10,
    loop: true,
    breakpoints: {
      768: {
        slidesPerView: 1,
      }
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // If we need pagination
    thumbs: {
      swiper: productSliderThumbs,
    },
  });

  var galleryFitsSix = new Swiper ('.gallery-fits-6', {
    slidesPerView: 2.2,
    spaceBetween: 10,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 20,
      }
    },
  });

  var galleryFitsThree = new Swiper ('.gallery-fits-3 ', {
    slidesPerView: 3,
    spaceBetween: 10,
    watchOverflow: true,
    breakpoints: {
      1024: {
        spaceBetween: 20,
      }
    },
  });

  var galleryItems = new Swiper ('.product-item-gallery ', {
    slidesPerView: 1.7,
    spaceBetween: 10,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 3.7,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20,
      }
    },
  });

  var galleryAbout = new Swiper ('.gallery-about ', {
    slidesPerView: 1.05,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView:2,
      },
      1200: {
        slidesPerView:2,
        spaceBetween: 20,
      }
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  var galleryDetails = new Swiper ('.gallery-details', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  var galleryItems = new Swiper ('.gallery-items', {
    slidesPerView: 2.3,
    spaceBetween: 10,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      }
    },
  });

   window.productFancyboxGallery = new Swiper('.product-fancybox__gallery', {
    slidesPerView: 1,
    spaceBetween: 0,
    watchOverflow: true,
    loop: false,
    speed: 800,
    breakpoints: {
      1024: {
        slidesPerView: 10,
        loop: false,
        noSwiping: false,
        allowSlidePrev: false,
        allowSlideNext: false,
      }
    },
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
  });

  //   $(".swiper-button-pause").click(function(){
  //   productGallery.autoplay.stop();
  // });

  // $(".swiper-button-play").click(function(){
  //   productGallery.autoplay.play();
  // });
}

function initBackgroundVideo() {
  var $video = $('.jquery-background-video');
      $video.bgVideo({fadeIn: 2000});
  var el = $video[0];
  var $wrapper = $('.jquery-background-video-wrapper');
  var $pauseplay = $('.jquery-background-video-pauseplay');
  $pauseplay.css('z-index', '100');
  $pauseplay.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
  });
  $wrapper.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!el.paused) {
          $video.trigger('pause');
      } else {
          $video.trigger('play');
      }
  });
  $('.js-background-video').bgVideo({
    fullScreen: false, // Sets the video to be fixed to the full window - your <video> and it's container should be direct descendents of the <body> tag
    fadeIn: 1000, // Milliseconds to fade video in/out (0 for no fade)
    pauseAfter: 120, // Seconds to play before pausing (0 for forever)
    fadeOnPause: false, // For all (including manual) pauses
    fadeOnEnd: true, // When we've reached the pauseAfter time
    showPausePlay: true, // Show pause/play button
    pausePlayXPos: 'center', // left|right|center
    pausePlayYPos: 'center', // top|bottom|center
    pausePlayXOffset: '0', // pixels or percent from side - ignored if positioned center
    pausePlayYOffset: '0' // pixels or percent from top/bottom - ignored if positioned center
  });
  $('.video-hero--custom .jquery-background-video-pauseplay.pause').removeClass('pause').addClass('play');
}

/*
 * jQuery accessible and keyboard-enhanced navigation with dropdown
 * Website: http://a11y.nicolas-hoffmann.net/subnav-dropdown/
 * License MIT: https://github.com/nico3333fr/jquery-accessible-subnav-dropdown/blob/master/LICENSE
 */
$(document).ready(function () {
  ResponsiveHelper.addRange({
    '1200..': {
      on: function () {
        // loading expand paragraphs
        var $nav_system = $('.js-nav-system'),
          $body = $('body');
        if ($nav_system.length) { // if there is at least one :)

          // initialization
          var $nav_system_link = $('.js-nav-system__link');

          $nav_system_link.each(function (index_to_expand) {
            var $this = $(this),
              index_lisible = index_to_expand + 1,
              $subnav = $this.next('.js-nav-system__subnav');

            // if there is a subnav adjacent to the link
            if ($subnav.length === 1) {
              $subnav.attr({
                'data-visually-hidden': 'true'
              });
            }
          });

        }

        // events on main menu
        // mouse !
        $body.on('mouseenter', '.js-nav-system__item', function (event) {
            var $this = $(this),
              $subnav_link = $this.children('.js-nav-system__link'),
              $subnav = $this.children('.js-nav-system__subnav');

            $this.attr({
              'data-show-sub': 'true'
            });

            // show submenu
            if ($subnav.length === 1) {
              $subnav.attr({
                'data-visually-hidden': 'false'
              });
            }

          })
          .on('mouseleave', '.js-nav-system__item', function (event) {
            var $this = $(this),
              $subnav_link = $this.children('.js-nav-system__link'),
              $subnav = $this.children('.js-nav-system__subnav');

            $this.attr({
              'data-show-sub': 'false'
            });
            // show submenu
            if ($subnav.length === 1) {
              $subnav.attr({
                'data-visually-hidden': 'true'
              });
            }

          })
          // keyboard
          .on('focus', '.js-nav-system__link', function (event) {
            var $this = $(this),
              $parent = $this.parents('.js-nav-system'),
              $parent_item = $this.parents('.js-nav-system__item'),
              $subnav = $this.next('.js-nav-system__subnav');

            $parent_item.attr({
              'data-show-sub': 'true'
            });

            // hide other menus and show submenu activated
            $parent.find('.js-nav-system__subnav').attr({
              'data-visually-hidden': 'true'
            });

            if ($subnav.length === 1) {
              $subnav.attr({
                'data-visually-hidden': 'false'
              });
            }

          })
          .on('focusout', '.js-nav-system__link', function (event) {
            var $this = $(this),
              $parent = $this.parents('.js-nav-system'),
              $parent_item = $this.parents('.js-nav-system__item');

            $parent_item.attr({
              'data-show-sub': 'false'
            });
          })
          .on('keydown', '.js-nav-system__link', function (event) {
            var $this = $(this),
              $parent = $this.parents('.js-nav-system'),
              $parent_item = $this.parents('.js-nav-system__item'),
              $subnav = $this.next('.js-nav-system__subnav');

            // event keyboard left
            if (event.keyCode === 37) {
              // select previous nav-system__link

              // if we are on first => activate last
              if ($parent_item.is(".js-nav-system__item:first-child")) {
                $parent.find(" .js-nav-system__item:last-child ").children(".js-nav-system__link").focus();
              }
              // else activate previous
              else {
                $parent_item.prev().children(".js-nav-system__link").focus();
              }
              event.preventDefault();
            }

            // event keyboard right
            if (event.keyCode === 39) {
              // select previous nav-system__link

              // if we are on last => activate first
              if ($parent_item.is(".js-nav-system__item:last-child")) {
                $parent.find(" .js-nav-system__item:first-child ").children(".js-nav-system__link").focus();
              }
              // else activate next
              else {
                $parent_item.next().children(".js-nav-system__link").focus();
              }
              event.preventDefault();
            }

            // event keyboard bottom
            if (event.keyCode === 40) {
              // select first nav-system__subnav__link
              if ($subnav.length === 1) {
                // if submenu has been closed => reopen
                $subnav.attr({
                  'data-visually-hidden': 'false'
                });
                // and select first item
                $subnav.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
              }
              event.preventDefault();
            }

            // event shift + tab
            if (event.shiftKey && event.keyCode === 9) {
              if ($parent_item.is(".js-nav-system__item:first-child")) {
                $subnav.attr({
                  'data-visually-hidden': 'true'
                });
              } else {

                var $prev_nav_link = $parent_item.prev('.js-nav-system__item').children(".js-nav-system__link");
                var $subnav_prev = $prev_nav_link.next('.js-nav-system__subnav');
                if ($subnav_prev.length === 1) { // hide current subnav, show previous and select last element
                  $subnav.attr({
                    'data-visually-hidden': 'true'
                  });
                  $subnav_prev.attr({
                    'data-visually-hidden': 'false'
                  });
                  $subnav_prev.find(" .js-nav-system__subnav__item:last-child ").children(".js-nav-system__subnav__link").focus();
                  event.preventDefault();
                }
              }
            }

          });

        // events on submenu item
        $body.on('keydown', '.js-nav-system__subnav__link', function (event) {
            var $this = $(this),
              $subnav = $this.parents('.js-nav-system__subnav'),
              $subnav_item = $this.parents('.js-nav-system__subnav__item'),
              $nav_link = $subnav.prev('.js-nav-system__link'),
              $nav_item = $nav_link.parents('.js-nav-system__item'),
              $nav = $nav_link.parents('.js-nav-system');

            // event keyboard bottom
            if (event.keyCode === 40) {
              // if we are on last => activate first
              if ($subnav_item.is(".js-nav-system__subnav__item:last-child")) {
                $subnav.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
              }
              // else activate next
              else {
                $subnav_item.next().children(".js-nav-system__subnav__link").focus();
              }
              event.preventDefault();
            }
            // event keyboard top
            if (event.keyCode === 38) {
              // if we are on first => activate last
              if ($subnav_item.is(".js-nav-system__subnav__item:first-child")) {
                $subnav.find(" .js-nav-system__subnav__item:last-child ").children(".js-nav-system__subnav__link").focus();
              }
              // else activate previous
              else {
                $subnav_item.prev().children(".js-nav-system__subnav__link").focus();
              }
              event.preventDefault();
            }
            // event keyboard Esc
            if (event.keyCode === 27) {
              // close the menu
              $nav_link.focus();
              $subnav.attr({
                'data-visually-hidden': 'true'
              });
              event.preventDefault();
            }
            // event keyboard right
            if (event.keyCode === 39) {
              // select next nav-system__link
              $subnav.attr({
                'data-visually-hidden': 'true'
              });

              // if we are on last => activate first and choose first item
              if ($nav_item.is(".js-nav-system__item:last-child")) {
                var $next = $nav.find(" .js-nav-system__item:first-child ").children(".js-nav-system__link");
                $next.focus();
                var $subnav_next = $next.next('.js-nav-system__subnav');
                if ($subnav_next.length === 1) {
                  $subnav_next.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
              }
              // else activate next
              else {
                $next = $nav_item.next().children(".js-nav-system__link");
                $next.focus();
                $subnav_next = $next.next('.js-nav-system__subnav');
                if ($subnav_next.length === 1) {
                  $subnav_next.find(" .js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
              }
              event.preventDefault();
            }
            // event keyboard left
            if (event.keyCode === 37) {
              // select prev nav-system__link
              $subnav.attr({
                'data-visually-hidden': 'true'
              });

              // if we are on first => activate last and choose first item
              if ($nav_item.is(".js-nav-system__item:first-child")) {
                var $prev = $nav.find(" .js-nav-system__item:last-child ").children(".js-nav-system__link");
                $prev.focus();
                var $subnav_prev = $prev.next('.js-nav-system__subnav');
                if ($subnav_prev.length === 1) {
                  $subnav_prev.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
              }
              // else activate prev
              else {
                $prev = $nav_item.prev().children(".js-nav-system__link");
                $prev.focus();
                $subnav_prev = $prev.next('.js-nav-system__subnav');
                if ($subnav_prev.length === 1) {
                  $subnav_prev.find(".js-nav-system__subnav__item:first-child ").children(".js-nav-system__subnav__link").focus();
                }
              }
              event.preventDefault();
            }
            // event tab
            if (event.keyCode === 9 && !event.shiftKey) { // if we are on last subnav of last item and we go forward => hide subnav
              if ($nav_item.is(".js-nav-system__item:last-child") && $subnav_item.is(".js-nav-system__subnav__item:last-child")) {
                $subnav.attr({
                  'data-visually-hidden': 'true'
                });
              }
            }

          })
          .on('focus', '.js-nav-system__subnav__link', function (event) {
            var $this = $(this),
              $subnav = $this.parents('.js-nav-system__subnav'),
              $subnav_item = $this.parents('.js-nav-system__subnav__item'),
              $nav_link = $subnav.prev('.js-nav-system__link'),
              $nav_item = $nav_link.parents('.js-nav-system__item'),
              $nav = $nav_link.parents('.js-nav-system__item');

            $nav_item.attr({
              'data-show-sub': 'true'
            });
          })
          .on('focusout', '.js-nav-system__subnav__link', function (event) {
            var $this = $(this),
              $subnav = $this.parents('.js-nav-system__subnav'),
              $subnav_item = $this.parents('.js-nav-system__subnav__item'),
              $nav_link = $subnav.prev('.js-nav-system__link'),
              $nav_item = $nav_link.parents('.js-nav-system__item'),
              $nav = $nav_link.parents('.js-nav-system__item');

            $nav_item.attr({
              'data-show-sub': 'false'
            });
          });
      }
    }
  });
});


// smooth anchor links
function initAnchors() {
  new SmoothScroll({
    anchorLinks: 'a.back-to-top'
  });
  new SmoothScroll({
    anchorLinks: '.designer__name-list li > a',
    extraOffset: function() {
      var totalHeight = 0;
      $('.designer__sticky-block').each(function() {
        var $box = jQuery(this);
        var stickyInstance = $box.data('StickyScrollBlock');
        if (stickyInstance) {
          stickyInstance.stickyFlag = false;
          stickyInstance.stickyOn();
          totalHeight += $box.outerHeight();
          stickyInstance.onResize();
        } else {
          totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
        }
      });
      return totalHeight;
    },
    activeClasses: 'parent',
    wheelBehavior: 'none'
  });
  new SmoothScroll({
    anchorLinks: '.anchors'
  });
  var anchorZoomBlock;
  anchorZoomBlock = new SmoothScroll({
    anchorLinks: '.anchors-fancybox',
    container: '.product-fancybox',
    activeClasses: 'parent',
    // wheelBehavior: 'ignore',
    // easing: 'linear',
    animMode: 'speed',
    animSpeed: 0,
    useNativeAnchorScrolling: false
  });
}

// running line init
function initDotDotDot() {
  ResponsiveHelper.addRange({
    '..767': {
      on: function () {
        // Configure/customize these variables.
        var showChar = 109; // How many characters are shown by default
        var ellipsestext = "...";
        var moretext = "Read more";
        var lesstext = "Read less";
        $('.text-box-dot').each(function () {
          var content = $(this).html();
          if (content.length > showChar) {
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
            $(this).html(html);
          }
        });
        $(".morelink").click(function () {
          if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
          } else {
            $(this).addClass("less");
            $(this).html(lesstext);
          }
          $(this).parent().prev().toggle();
          $(this).prev().toggle();
          return false;
        });
      },
      off: function () {
        // $('.category-sorting__btns').stickyScrollBlock('destroy');
      }
    }
  });
}

// in view port init
function initInViewport() {
  $('.viewport-section').itemInViewport({
    once: true,
    visibleMode: 2
  });
  $('.viewport-element').itemInViewport({
    once: true,
    visibleMode: 1
  });
  // $('.viewport-img-element').itemInViewport({
  //   once: false,
  //   visibleMode: 1
  // });
}

// in view port init
function initCustomScroll() {
  var $scrollPane = $('.scroll-pane');
  ResponsiveHelper.addRange({
    '1024..': {
      on: function () {
          // this need because error will be generated
          // when no element found in template
          if ($scrollPane.length) {
              $scrollPane.jScrollPane(
                {
                  autoReinitialise: true
                }
              );
          }
      },
      off: function () {
          // this need because error will be generated
          // when no element found in template
          if ($scrollPane.length) {
              $scrollPane.jScrollPane('destroy');
          }
      }
    }
  });
  var $scrollPaneTwo = $('.shoping-bag-open-close__frame');
  if ($scrollPaneTwo.length) {
    $scrollPaneTwo.jScrollPane({
        autoReinitialise: true
    });
  }
  var $scrollPaneSearch = $('.header-search__results');
  if ($scrollPaneSearch.length) {
    $scrollPaneSearch.jScrollPane({
        autoReinitialise: true
    });
  }
}

// initialize custom form elements
function initCustomForms() {
  jcf.replaceAll(".custom-form:not('.not-init-jcf')");
}

// lightbox init
function initFancybox() {
  $('a.lightbox, [data-fancybox]').fancybox({
    parentEl: 'body',
    margin: [50, 5],
    autoFocus: false,
    closeExisting: true,
    smallBtn: false,
    toolbar: false,
    touch: false
  });

  $('[data-fancybox-protected]').fancybox({
    autoFocus: false,
    closeExisting: true,
    smallBtn: false,
    toolbar: false,
    touch: false
  }).trigger('click');
}

function initEasyZoom() {
  ResponsiveHelper.addRange({
    '1200..': {
      on: function () {
          var $easyzoom = $('.easyzoom').easyZoom({
            linkAttribute: "href",
            preventClicks: true
          });
      },
      off: function () {
        var $easyzoom = $('.easyzoom').easyZoom('destroy');
      }
    }
  });
  $('.product-block__slider .image-container').click(function(e) {
    e.preventDefault();
  });
}

function initInput() {
  var defaultVal = '';
  var $input = $('.input-row input');
  var $textarea = $('.input-row textarea');
  var $rowContainerEmail = $('.js-row-container-email');
  var $rowContainerPassword = $('.js-row-container-password');
  $input.focus(function(event) {
      $(this).closest('.input-row').addClass('focus');
  });
  $textarea.focus(function(event) {
      $(this).closest('.input-row').addClass('focus');
  });
  $input.blur(function(event) {
      $(this).closest('.input-row').removeClass('focus');
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
  });
  $textarea.blur(function(event) {
      $(this).closest('.input-row').removeClass('focus');
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
  });
  $input.keyup(function(event) {
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
  });
  $textarea.keyup(function(event) {
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
  });
  $input.change(function(event) {
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
      $(this).blur();
  });
  $textarea.change(function(event) {
      var actionVal = $(this).val();
      if (actionVal !== defaultVal) $(this).closest('.input-row').addClass('enter');
      else $(this).closest('.input-row').removeClass('enter');
      $(this).blur();
  });
  $input.each(function() {
      if ($(this).attr('id') === 'CustomerEmail') {
          $rowContainerEmail.addClass('enter');
      }
      if ($(this).attr('id') === 'CustomerEmail') {
          $rowContainerPassword.addClass('enter');
      }
      if ($(this).is(':disabled') && $(this).attr('id') === 'CustomerEmail') {
          $rowContainerEmail.addClass('disable');
      }
      if ($(this).is(':disabled') && $(this).attr('id') === 'CustomerEmail') {
          $rowContainerPassword.addClass('disable');
      }
  });
  $textarea.each(function() {
      if ($(this).val() !== '') $(this).closest('.input-row').addClass('enter');
      if ($(this).is(':disabled')) $(this).closest('.input-row').addClass('disable');
  });
}

function changeModel() {
  $('.js-change-model').click(function() {
    var current_size = $('.product-block__models-switcher__btn-opener .product-block__models-switcher__size');
    var current_height = $('.product-block__models-switcher__btn-opener .product-block__models-switcher__height');
    var selected_size = $('.product-block__models-switcher__size', this);
    var selected_height = $('.product-block__models-switcher__height', this);
    current_size.text(selected_size.text());
    current_height.text(selected_height.text());
    var imageArr = [];
    var thumbsArr = [];
    var fancyArr = [];
    var fancyThumbArr = [];
    var size = $(this).data('model');
    $('[data-model-size=' + size + ']').each(function(index) {
      var image_width = parseInt($(this).data('image-width'));
      var image_height = parseInt($(this).data('image-height'));
      var video = $(this).data('video-src');
      if (index === 1 && video) {
        imageArr.push(
          '<div class="swiper-slide">' +
            '<div class="jquery-background-video-wrapper">' +
              '<video class="jquery-background-video" autoplay muted playsinline poster="' + $(this).attr('src') + '">' +
                '<source src="' + video + '" type="video/mp4">' +
              '</video>' +
              '<div class="video-overlay" style="background-image:url(' + $(this).attr('src') + ');"></div>' +
              '<div class="media-block__description accessibility">' +
                'Video file decription' +
              '</div>' +
            '</div>' +
          '</div>')
      } else {
        imageArr.push(
          '<div class="swiper-slide">' +
            '<div class="easyzoom easyzoom--overlay">' +
              '<a href="'+ $(this).attr('src') +'" class="image-container open-close-fade__opener">' +
                '<picture>' +
                  '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '327x') + ', ' + Shopify.resizeImage($(this).attr('src'), '654x') + ' 2x" media="(max-width: 767px)">' +
                  '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '435x') + ', ' + Shopify.resizeImage($(this).attr('src'), '870x') + ' 2x">' +
                  '<img src="'+ Shopify.resizeImage($(this).attr('src'), '435x') + '" alt="image description">' +
                '</picture>' +
              '</a>' +
            '</div>' +
          '</div>');
        }

      if (index === 1 && video) {
        thumbsArr.push(
          '<div class="swiper-slide">' +
            '<div class="image-container">' +
              '<picture>' +
                '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '32x') + ', ' + Shopify.resizeImage($(this).attr('src'), '64x') + ' 2x">' +
                '<img src="'+ Shopify.resizeImage($(this).attr('src'), '32x') + '" alt="image description">' +
              '</picture>' +
              '<button class="default product-block__gallery__button-play">' +
                '<span class="visually-hidden">Play button for video slide</span>' +
              '</button>' +
            '</div>' +
          '</div>');
      } else {
        thumbsArr.push(
          '<div class="swiper-slide">' +
            '<div class="image-container">' +
              '<picture>' +
                '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '32x') + ', ' + Shopify.resizeImage($(this).attr('src'), '64x') + ' 2x">' +
                '<img src="'+ Shopify.resizeImage($(this).attr('src'), '32x') + '" alt="image description">' +
              '</picture>' +
            '</div>' +
          '</div>');
      }



        if (image_width < 1780 && image_height < 2672) {
          fancyArr.push(
            '<div class="swiper-slide product-fancybox__gallery__box mb-lg-4" id="product-fancybox-box-' + index + '">' +
              '<picture>' +
                  '<img src="'+ Shopify.resizeImage($(this).attr('src'), '890x1336') + '" alt="image description">' +
              '</picture>' +
            '</div>')
        } else {
          fancyArr.push(
            '<div class="swiper-slide product-fancybox__gallery__box mb-lg-4" id="product-fancybox-box-' + index + '">' +
              '<picture>' +
                  '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '375x') + ', ' + Shopify.resizeImage($(this).attr('src'), '750x') + ' 2x" media="(max-width: 767px)">' +
                  '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '890x1336') + ', ' + Shopify.resizeImage($(this).attr('src'), '1780x2672') + ' 2x">' +
                  '<img src="'+ Shopify.resizeImage($(this).attr('src'), '890x1336') + '" alt="image description">' +
              '</picture>' +
            '</div>')
        }

        fancyThumbArr.push(
          '<div class="product-fancybox__gallery-switchers__box">' +
          '<a href="#product-fancybox-box-' + index + '" class="anchors-fancybox mb-lg-2">' +
            '<picture>' +
              '<source srcset="' + Shopify.resizeImage($(this).attr('src'), '40x') + ', ' + Shopify.resizeImage($(this).attr('src'), '80x') + ' 2x">' +
              '<img src="'+ Shopify.resizeImage($(this).attr('src'), '40x') + '" alt="image description">' +
            '</picture>' +
          '</a>' +
        '</div>')

      });

    window.productGallery.removeAllSlides();
    window.productGalleryThumbs.removeAllSlides();
    window.productFancyboxGallery.removeAllSlides();
    window.productGallery.appendSlide(imageArr);
    window.productGalleryThumbs.appendSlide(thumbsArr);
    window.productFancyboxGallery.appendSlide(fancyArr);
    $('.product-fancybox__gallery-switchers').empty();
    $('.product-fancybox__gallery-switchers').append(fancyThumbArr);
    initEasyZoom();
    initBackgroundVideo();
    // initOpenClose()
    $('body').openClose({
      activeClass: 'open-close-fade--active',
      opener: '.open-close-fade__opener',
      slider: '.open-close-fade__slide',
      animSpeed: 0,
      effect: 'fade',
      hideOnClickOutside: false
    });
    $('[data-fancybox-close]').click(function() {
      $('body').removeClass('open-close-fade--active');
      $('.product-fancybox').addClass('js-slide-hidden')
    })
  })
}

$(document).ready(function () {
  window.initCartKit();

});

function updateShippingBar(total_price) {
  console.log('here');
    var bar = $('.js-free-shipping-bar');
    var bar_text_element = $('.js-free-shipping-text');

    var settings_price = bar.data('price');
    var bar_replace_text = bar_text_element.data('settings-text');
    var bar_text_success = bar_text_element.data('settings-success');

    var free_price = settings_price - total_price;
    var bar_percent = Math.abs(total_price * 100 / settings_price);

    if (bar_percent > 100) {
        bar_percent = 100;
        free_price = 0;
        bar_text_element.html(bar_text_success)
    } else {
        if (bar_replace_text) {
            bar_text_element.html(bar_replace_text.replace('{{price}}', rivets.formatters.money(free_price)))
        }
    }
    bar.css('width', bar_percent + '%')
}

window.initCartKit = (function() {
  function cartKit() {
    $('body').on('click', '.remove-kit-link', function (e) {
      e.preventDefault();
      let btn = $(e.currentTarget);
      let kitIDs = btn.attr('data-kit-id');
      if (kitIDs == '') {
        return false;
      }
      //console.log('kitIDs', kitIDs);
      updateBundleKit(kitIDs, null, function (cart) {
        cartRequestComplete();
        updateShippingBar(cart.total_price)
      });
    });

    $('body').on('click', '.jcf-btn-inc, .jcf-btn-dec', function (e) {
      e.preventDefault();
      let input = $(e.currentTarget);
      let newValue = input.attr('data-new-quantity');
      let kitIDs = input.attr('data-kit-id');
      let inputChanged = input.parent().find('.js-qty__kit');
      if (kitIDs != undefined && inputChanged.length > 0) {
        inputChanged.val(newValue).change();
      }
    });

    $('body').on('change', '.js-qty__kit', function (e) {
      e.preventDefault();
      let input = $(e.currentTarget);
      let kitIDs = input.next().attr('data-kit-id');
      let newValue = input.val();
      //console.log('change', newValue);
      updateBundleKit(kitIDs, newValue, function (cart) {
        cartRequestComplete();
        updateShippingBar(cart.total_price)
      });
    });
  }

  let getCart = function (callback) {
    $.ajax({
      type:     'GET',
      url:      '/cart.js',
      dataType: 'json',
      success:  function (cart) {
        callback(cart);
      },
      error:    function (XMLHttpRequest, textStatus) {
        console.log(XMLHttpRequest, textStatus);
      }
    })
  };

  let updateBundleKit = function (bundleId, newValue, callback) {
    getCart(function(cart) {
      let cartQntArray = [];
      for (let i = 0; i < cart.items.length; i++) {
        //console.log('kitId updateBundleKit', cart.items[i]);
        if (cart.items[i].properties && cart.items[i].properties['_kitId'] == bundleId) {
          cartQntArray.push(newValue == null ? 0 : parseInt(newValue));
        } else {
          cartQntArray.push(cart.items[i].quantity);
        }
      }

      //console.log(newValue, 'cartQntArray', cartQntArray);
      $.ajax({
        type:     'POST',
        url:      '/cart/update.js',
        data:     {updates: cartQntArray},
        dataType: 'json',
        success:  function (cart) {
          console.log('update cart', cart);
          $('.header__bag-btn__num').text(cart.item_count);
          $('.cart__total__price').html(Shopify.formatMoney(cart.total_price, window.theme.moneyFormat));
          (cart.item_count == 0 && cart.total_price == 0 && $('body').hasClass('template-cart')) ? window.location.reload() : callback(cart);
        },
        error: function (XMLHttpRequest, textStatus) {
          console.log(XMLHttpRequest, textStatus);
        }
      });
    });
  };

  return cartKit;
})();

function cartRequestComplete () {
  $.ajax({
    type: 'GET',
    url: '/cart?view=ajax-template',
    cache: false,
    dataType: 'html',
    success: function (data) {
      var $content = $(data);
      var $old_content = $('.cart-items');
      var $old_content_minicart = $('.minicart');
      if ($content.filter('.cart-items-loading')[1] != undefined) {
        $('.shoping-bag-open-close__opener').addClass('active');
        $('.cart__holder').append($content.filter('.cart-items-loading')[1]);
        var $scrollPaneTwo = $('.shoping-bag-open-close__frame.header');
        $scrollPaneTwo.find('.jspPane').length == 0 ? $scrollPaneTwo.html($content.filter('.minicart')[0]) : $scrollPaneTwo.find('.jspPane').html($content.filter('.minicart')[0]);
      }
      setTimeout(function () {
        $('.cart-items-loading, .minicart').removeClass('cart-items-loading');
        $old_content.remove();
        $old_content_minicart.remove();
        if ($scrollPaneTwo.find('.jspPane').length == 0) {
          $scrollPaneTwo.jScrollPane({
            autoReinitialise: true
          });
        }
      },300);
      if (CartJS.cart.item_count === 0) {
        $('.cart__props').hide();
        $('.cart-container').hide();
        $('.empty-cart').show();
      }
    }
  });
}
  function validateEmail() {
    $('#klaviyo_newsletter input[type="email"]')[0].oninvalid = function () {
          this.setCustomValidity("Invalid email");
          $('.success_message', '#klaviyo_newsletter').hide();
      };
    $('#klaviyo_newsletter input[type="email"]')[0].oninput = function () {
          this.setCustomValidity("");
      };
    var sign_up = $('#klaviyo_sign_up')
    if (sign_up.length > 0) {
      $('#klaviyo_sign_up input[type="email"]')[0].oninvalid = function () {
            this.setCustomValidity("Invalid email");
            $('.success_message', '#klaviyo_sign_up').hide();
        };
      $('#klaviyo_sign_up input[type="email"]')[0].oninput = function () {
            this.setCustomValidity("");
        };
    }
  }

  function addToWishlist(variant_id, product_id, product_title, image, price, url) {
    var formatted_price = Shopify.formatMoney(price, "{{amount}}");
    var url = Shopify.shop + url;
    window._swat.addToWishList(
      {
        "epi": variant_id,
        "du": "https://" + url,
        "empi": product_id,
        "dt": product_title,
        "iu" : image,
        "pr": parseFloat(formatted_price)
      },
      function(r) {}
    );
  }

  rivets.formatters.kits = function(value){
    console.log(value);
    if (value && value.length > 0) {
      return true
    }
    return false
  };

function initToggleOpenCloser() {
    var $sortingOpenCloser = $('.js-sort-open-closer');
    var $filterOpenCloserContainer = $('.js-open-closer-container');
    var $filterContent = $('.js-category-sorting');

    $sortingOpenCloser.on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        if (!$filterContent.hasClass('js-slide-hidden')) {
            $filterContent.slideUp({speed: 400, complete: function(){
                $filterContent.addClass('js-slide-hidden');
            }});
            $filterOpenCloserContainer.removeClass('active');
        }
    })
}

function createCookie(name, value, days) {
  var expires;

  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  } else {
      expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ')
          c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function plpProtected() {
  var passcode = '12345'

  if ($('body').hasClass('plp-protected') && readCookie('plp_protected') !== "false") {
    $("#protected_fancybox").fancybox({
      toolbar: false,
      touch: false,
      closeExisting: false,
      closeBtn    : false, // hide close button
      closeClick  : false, // prevents closing when clicking INSIDE fancybox
      helpers     : {
        // prevents closing when clicking OUTSIDE fancybox
        overlay : {closeClick: false}
      },
    }).trigger('click')
  }

  if ($('body').hasClass('email-signup') && readCookie('plp_protected') !== "false") {
    KlaviyoSubscribe.attachToModalForm('#k_id_modal', {
     list: '{{settings.klaviyo_list}}',
     hide_form_on_success: true,
     ignore_cookie: true,
     content: {
        header: 'Want exclusive deals?',
        subheader: 'Be the first to know about special offers',
        button: 'Sign Up',
        success: 'Thanks! Check your email for a confirmation.'
     },
     modal_content: false,
     success: function($form) {
       setTimeout(function () {
         $form.hide();
         $("#k_id_modal").hide();
         createCookie('plp_protected', false, 1);
       }, 1000);
     }
    });
  }

  $('#check_password').click(function(e) {
    console.log($(this));
    e.preventDefault();
    var password_input = $('[type="password"]').val();
    console.log(password_input);
    if (password_input === passcode) {
      $('.password-error').hide()
      createCookie('plp_protected', false, 1)
      $.fancybox.close();
    } else {
      $('.password-error').show()
    }
  })

}
if(!window.SwymCallbacks){
 window.SwymCallbacks = [];
}
window.SwymCallbacks.push(initWishlistCount);
function initWishlistCount() {
  window._swat.renderWishlistCount($('.js-wishlist-amount')[0], function(cnt, elem){
  }, 1500);
}
