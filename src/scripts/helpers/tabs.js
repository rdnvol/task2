function tabs(holder, options) {
  this.holder = holder;
  this.options = options;

  this.init();
}

tabs.prototype = {
  init() {
    console.log('data', this.holder, this.options);
    this.tabLinks = this.holder.querySelectorAll(this.options.tabLinks);

    this.setStartActiveIndex();
    this.setActiveTab();

    if (this.options.autoHeight) {
      this.tabHolder = (this.tabLinks[0].getAttribute(this.options.attrib)).parentElement;
    }

    this.makeCallback('onInit', this);
  },

  setStartActiveIndex() {
    const classTargets = this.getClassTarget(this.tabLinks);
    const activeLink = classTargets.filter('.' + this.options.activeClass);
    const hashLink = this.tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
    let activeIndex;

    if (this.options.checkHash && hashLink.length) {
      activeLink = hashLink;
    }

    activeIndex = classTargets.indexOf(activeLink);

    this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
  },

  setActiveTab() {

    this.tabLinks.forEach((link, i) => {
      const classTarget = this.getClassTarget(link);
      const tab = link.getAttribute(this.options.attrib);

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

  attachTabLink(link, i) {

    link.addeventlistener(this.options.event + '.tabset', (e) => {
      e.preventDefault();

      if (this.activeTabIndex === this.prevTabIndex && this.activeTabIndex !== i) {
        this.activeTabIndex = i;
        this.switchTabs();
      }
      if (this.options.checkHash) {
        location.hash = link.getAttribute('href').split('#')[1];
      }
    });
  },

  resizeHolder(height) {
    const self = this;
    if (height) {
      this.tabHolder.style.height = height;
      setTimeout(function() {
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

    setTimeout(function() {
      self.getClassTarget(prevLink).classList.remove(self.options.activeClass);

      prevTab.classList.add(self.options.tabHiddenClass);
      nextTab.classList.remove(self.options.tabHiddenClass);
      nextTab.classList.add(self.options.activeClass);

      self.getClassTarget(nextLink).classList.add(self.options.activeClass);

      if (self.haveTabHolder()) {
        self.resizeHolder(nextTab.getBoundingClientRect().height);

        setTimeout(function() {
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
    return link.getAttribute(this.options.attrib);
  },

};

export default tabs;
