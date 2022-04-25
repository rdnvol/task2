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
  }
};

export default tabs;
