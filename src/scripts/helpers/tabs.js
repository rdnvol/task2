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
};

export default tabs;
