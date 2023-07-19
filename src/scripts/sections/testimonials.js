import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';

register('testimonials', {
  _slideToBlock(index) {
    this.splide.go(index);
  },

  initTestimonialsSlider() {
    import('@splidejs/splide').then(({ Splide }) => {
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
    });
  },

  onLoad() {
    performanceMeasure(this.id, this.initTestimonialsSlider.bind(this));
  },

  onUnload() {
    this.splide.destroy();
  },

  onDeselect() {
    this.splide.go(1);
  },

  onBlockSelect(e) {
    this._slideToBlock(+e.target.dataset.index);
  },

  onBlockDeselect() {
    this.splide.go(1);
  },
});
