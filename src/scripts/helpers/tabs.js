function Tabs(holder, options) {
  this.defaultOptions = {
    activeClass: 'active',
    addToParent: false,
    autoHeight: false,
    checkHash: false,
    defaultTab: false,
    animSpeed: 500,
    tabLinks: 'a',
    attrib: 'href',
    event: 'click',
    tabHiddenClass: 'js-tab-hidden'
  }

  this.holder = holder;
  this.options = Object.assign(this.defaultOptions, {...options});
  this.options.autoHeight ?? false;

  this.init();
}

Tabs.prototype = {
  init() {
    this.tabLinks = this.holder.querySelectorAll(this.options.tabLinks);

    this.setStartActiveIndex();
    this.setActiveTab();

    if (this.options.autoHeight) {
      this.tabHolder = this.holder.querySelector(this.tabLinks[0].getAttribute(this.options.attrib)).parentElement;
    }

    this.makeCallback('onInit', this);
  },

  setStartActiveIndex() {
    const classTargets = this.getClassTarget(this.tabLinks);
    const activeLink = Array.from(classTargets).filter((elem) => {
      return elem.classList.contains(this.options.activeClass)
    });

    const hashLink = Array.from(this.tabLinks).filter((link) => {
      return link.getAttribute(this.options.attrib) === location.hash
    });
    let activeIndex;

    if (this.options.checkHash && hashLink.length) {
      activeLink = hashLink;
    }

    activeIndex = Array.from(classTargets).indexOf(activeLink[0]);

    this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
  },

  setActiveTab() {

    this.tabLinks.forEach((link, i) => {
      const classTarget = this.getClassTarget(link);
      const tab = this.holder.parentElement.querySelector('.tab-content').querySelector(link.getAttribute(this.options.attrib));

      if (i !== this.activeTabIndex) {
        classTarget.classList.remove(this.options.activeClass);
        tab.classList.add(this.options.tabHiddenClass);
        tab.classList.remove(this.options.activeClass);
      } else {
        classTarget.classList.add(this.options.activeClass);
        tab.classList.remove(this.options.tabHiddenClass);
        tab.classList.add(this.options.activeClass);
      }

      this.attachTabLink(link, i);
    });
  },

  eventHandler({e, i, link}) {
    e.preventDefault();

    if (this.activeTabIndex === this.prevTabIndex && this.activeTabIndex !== i) {
      this.activeTabIndex = i;
      this.switchTabs();
    }
    if (this.options.checkHash) {
      location.hash = link.getAttribute('href').split('#')[1];
    }
  },

  attachTabLink(link, i) {
    link.addEventListener(this.options.event, (e) => {
      const parameters = {
        e,
        link,
        i
      }
      this.eventHandler(parameters);
    });
  },

  resizeHolder(height) {
    const self = this;
    if (height) {
      this.tabHolder.style.height = height;
      setTimeout(function () {
        self.tabHolder.classList.add('transition');
      }, 10);
    } else {
      self.tabHolder.classList.remove('transition');
      self.tabHolder.style.height = '';
    }
  },

  switchTabs() {
    const self = this;

    const prevLink = this.tabLinks[this.prevTabIndex];
    const nextLink = this.tabLinks[this.activeTabIndex];

    const prevTab = this.getTab(prevLink);
    const nextTab = this.getTab(nextLink);

    prevTab.classList.remove(this.options.activeClass);

    if (self.haveTabHolder()) {
      this.resizeHolder(prevTab.getBoundingClientRect().height);
    }

    setTimeout(function () {
      self.getClassTarget(prevLink).classList.remove(self.options.activeClass);

      prevTab.classList.add(self.options.tabHiddenClass);
      nextTab.classList.remove(self.options.tabHiddenClass);
      nextTab.classList.add(self.options.activeClass);

      self.getClassTarget(nextLink).classList.add(self.options.activeClass);

      if (self.haveTabHolder()) {
        self.resizeHolder(nextTab.getBoundingClientRect().height);

        setTimeout(function () {
          self.resizeHolder();
          self.prevTabIndex = self.activeTabIndex;
          self.makeCallback('onChange', self);
        }, self.options.animSpeed);
      } else {
        self.prevTabIndex = self.activeTabIndex;
      }
    }, this.options.autoHeight ? this.options.animSpeed : 1);
  },

  getClassTarget(link) {
    return this.options.addToParent ? link.parentElement : link;
  },

  getActiveTab() {
    return this.getTab(this.tabLinks[this.activeTabIndex]);
  },

  getTab(link) {
    return this.holder.parentElement.querySelector('.tab-content').querySelector(link.getAttribute(this.options.attrib));
  },

  haveTabHolder() {
    return this.tabHolder && this.tabHolder.length;
  },

  destroy() {
    const self = this;

    this.tabLinks.forEach((link) => {
      link.removeEventListener(this.options.event, this.eventHandler);
    });

    this.tabLinks.forEach(function () {
      const link = this;

      self.getClassTarget(link).classList.remove(self.options.activeClass);
      (link.querySelector(link.getAttribute(self.options.attrib))).classList.remove(self.options.activeClass + ' ' + self.options.tabHiddenClass);
    });

    this.holder.removeAttribute('data-Tabset');
  },

  makeCallback(name) {
    if (typeof this.options[name] === 'function') {
      const args = Array.prototype.slice.call(arguments);
      args.shift();
      this.options[name].apply(this, args);
    }
  },

};

export default Tabs;