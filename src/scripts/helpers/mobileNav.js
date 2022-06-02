function MobileNav(container, options) {
  this.defaultOptions = {
    container: null,
    hideOnClickOutside: false,
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener',
    menuDrop: '.nav-drop',
    toggleEvent: 'click',
    outsideClickEvent: ['click', 'touchstart', 'pointerdown', 'MSPointerDown'],
  };

  this.options = Object.assign(this.defaultOptions, { ...options });
  this.options.container = document.querySelector(container);
  this.initStructure();
  this.attachEvents();
}

const activateResizeHandler = function() {
  const win = window,
    doc = document.documentElement,
    resizeClass = 'resize-active',
    events = ['resize', 'orientationchange'];
  let flag, timer;

  const removeClassHandler = function() {
    flag = false;
    doc.classList.remove(resizeClass);
  };
  const resizeHandler = function() {
    if (!flag) {
      flag = true;
      doc.classList.add(resizeClass);
    }
    clearTimeout(timer);
    timer = setTimeout(removeClassHandler, 500);
  };
  events.forEach((event) => {
    win.addEventListener(event, resizeHandler);
  });
};

MobileNav.prototype = {
  initStructure() {
    this.page = document.documentElement;
    this.container = this.options.container;
    this.openers = this.container.querySelectorAll(this.options.menuOpener);
    this.drop = this.container.querySelector(this.options.menuDrop);
  },
  attachEvents: function() {
    const self = this;
    if (activateResizeHandler) {
      activateResizeHandler();
      activateResizeHandler = null;
    }
    this.outsideClickHandler = function(e) {
      if (self.isOpened()) {
        const target = e.target;
        if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
          self.hide();
        }
      }
    };
    this.openerClickHandler = function(e) {
      e.preventDefault();
      self.toggle();
    };
    this.openers.forEach((opener) => {
      opener.addEventListener(this.options.toggleEvent, this.openerClickHandler);
    });
  },
  isOpened: function() {
    return this.container.classList.contains(this.options.menuActiveClass);
  },
  show: function() {
    this.container.classList.add(this.options.menuActiveClass);
    if (this.options.hideOnClickOutside) {
      this.options.outsideClickEvent.forEach((event) => {
        this.page.addEventListener(event, this.outsideClickHandler);
      });
    }
  },
  hide: function() {
    this.container.classList.remove(this.options.menuActiveClass);
    if (this.options.hideOnClickOutside) {
      this.options.outsideClickEvent.forEach((event) => {
        this.page.removeEventListener(event, this.outsideClickHandler);
      });
    }
  },
  toggle: function() {
    if (this.isOpened()) {
      this.hide();
    } else {
      this.show();
    }
  },
  destroy: function() {
    this.container.classList.remove(this.options.menuActiveClass);
    this.opener.removeEventListener(this.options.toggleEvent, this.clickHandler);
    this.options.outsideClickEvent.forEach((event) => {
      this.page.removeEventListener(event, this.outsideClickHandler);
    });
  },
};

export default MobileNav;
