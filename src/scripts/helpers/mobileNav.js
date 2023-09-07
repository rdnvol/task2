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

const activateResizeHandler = function () {
  const win = window;
  const doc = document.documentElement;
  const resizeClass = 'resize-active';
  const events = ['resize', 'orientationchange'];

  let flag;
  let timer;

  const removeClassHandler = function () {
    flag = false;
    doc.classList.remove(resizeClass);
  };

  const resizeHandler = function () {
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
  attachEvents() {
    activateResizeHandler();

    this.outsideClickHandler = (e) => {
      if (this.isOpened()) {
        const { target } = e;

        if (!target.closest(this.opener).length && !target.closest(this.drop).length) {
          this.hide();
        }
      }
    };

    this.openerClickHandler = (e) => {
      e.preventDefault();
      this.toggle();
    };

    this.openers.forEach((opener) => {
      opener.addEventListener(this.options.toggleEvent, this.openerClickHandler);
    });
  },
  isOpened() {
    return this.container.classList.contains(this.options.menuActiveClass);
  },
  show() {
    this.container.classList.add(this.options.menuActiveClass);

    if (this.options.hideOnClickOutside) {
      this.options.outsideClickEvent.forEach((event) => {
        this.page.addEventListener(event, this.outsideClickHandler);
      });
    }
  },
  hide() {
    this.container.classList.remove(this.options.menuActiveClass);

    if (this.options.hideOnClickOutside) {
      this.options.outsideClickEvent.forEach((event) => {
        this.page.removeEventListener(event, this.outsideClickHandler);
      });
    }
  },
  toggle() {
    if (this.isOpened()) {
      this.hide();
    } else {
      this.show();
    }
  },
  destroy() {
    this.container.classList.remove(this.options.menuActiveClass);
    this.opener.removeEventListener(this.options.toggleEvent, this.clickHandler);
    this.options.outsideClickEvent.forEach((event) => {
      this.page.removeEventListener(event, this.outsideClickHandler);
    });
  },
};

export default MobileNav;
