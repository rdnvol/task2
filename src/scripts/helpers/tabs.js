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
};

export default tabs;
