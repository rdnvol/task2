import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';

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

    import('@splidejs/splide').then(({ Splide }) => {
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
    });
  },

  onLoad() {
    performanceMeasure(this.id, this.initSlider.bind(this));
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
