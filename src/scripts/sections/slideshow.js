import { register } from '@shopify/theme-sections';
import Splide from '@splidejs/splide';

register('slideshow', {
  _slideToBlock(index) {
    this.splide.go(index);
  },

  initSlider() {
    const delay = this.container.dataset.slidesEvery * 1000;
    const autorotate = this.container.dataset.autorotate === 'true';
    const blocksLength = +this.container.dataset.blocks;
    const rewind = blocksLength > 1;
    const autoplay = autorotate ? { delay } : false;

    this.splide = new Splide(this.container.querySelector('.slideshow-gallery'), {
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
  onLoad(e) {
    this.initSlider();
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload(e) {
    this.splide.destroy();
    // Do something when a section instance is unloaded
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect() {
    this.splide.go(1);
    // Do something when a section instance is deselected
  },
  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect(e) {
    this._slideToBlock(+e.target.dataset.index);
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect(e) {
    this.splide.go(1);
    // Do something when a section block is deselected
  },
});
