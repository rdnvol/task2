import { register } from '@shopify/theme-sections';
import Splide from '@splidejs/splide';
import { performanceMeasure } from 'helpers/utils';

register('testimonials', {
  _slideToBlock(index) {
    this.splide.go(index);
  },

  initTestimonialsSlider() {
    this.splide = new Splide(this.container.querySelector('.testimonials-slider'), {
      type: 'loop',
      speed: 800,
      perPage: 3,
      gap: 60,
      pagination: true,
      arrows: false,
      keyboard: 'focused',
      breakpoints: {
        840: {
          perPage: 2,
          gap: 20,
        },
        567: {
          perPage: 1,
          gap: 0,
        },
      },
    }).mount();
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad() {
    const sectionName = `${this.container.getAttribute('data-section-type')}-${this.id}`;

    performanceMeasure(sectionName, () => {
      performance.mark(`${sectionName}-Start`);

      this.initTestimonialsSlider();

      performance.mark(`${sectionName}-End`);
    });
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
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
  onBlockDeselect() {
    this.splide.go(1);
    // Do something when a section block is deselected
  },
});
