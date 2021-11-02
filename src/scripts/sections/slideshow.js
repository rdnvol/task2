import { register } from '@shopify/theme-sections';
import Splide from '@splidejs/splide';

register('slideshow', {
  _slideToBlock: function (index) {
    this.splide.go(index);
  },

  initSlider: function () {
    let delay = this.container.dataset.slidesEvery * 1000;
    let autorotate = this.container.dataset.autorotate === 'true';
    let blocksLength = +this.container.dataset.blocks;
    let rewind = blocksLength > 1;
    let autoplay = autorotate ? { delay } : false;

    this.splide = new Splide(
      this.container.querySelector('.slideshow-gallery'), {
      type: 'fade',
      speed: 800,
      rewind,
      autoplay,
      interval: delay,
      perPage: 1,
      gap: 0,
      pagination: true,
      arrows: true,
      keyboard: 'focused',
    }).mount();
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initSlider();
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function () {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function (e) {
    this.splide.destroy();
    // Do something when a section instance is unloaded
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function () {
    this.splide.go(1);
    // Do something when a section instance is deselected
  },
  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect: function (e) {
    this._slideToBlock(+e.target.dataset.index);
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect: function (e) {
    this.splide.go(1);
    // Do something when a section block is deselected
  },
});
