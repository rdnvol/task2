import { register } from '@shopify/theme-sections';
import Swiper from "swiper";

register('testimonials', {
  
  _slideToBlock: function (index) {
    this.swiper.slideTo(index);
  },
  
  initTestimonialsSlider: function () {
    this.swiper = new Swiper(this.container.querySelector('.swiper-container'), {
      slidesPerView: 1,
      watchOverflow: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      //   navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      breakpoints: {
        567: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 60,
        },
      }
    });
    console.log("Swiper", this.swiper)
  },
  
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initTestimonialsSlider()
  },
  
  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function () {
    // Do something when a section instance is selected
  },
  
  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function (e) {
    this.swiper.destroy();
    // Do something when a section instance is unloaded
  },
  
  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function () {
    this.swiper.slideTo(1);
    // Do something when a section instance is deselected
  },
  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect: function (e) {
    this._slideToBlock(e.target.dataset.index)
    // Do something when a section block is selected
  },
  
  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect: function (e) {
    this.swiper.slideTo(1);
    // Do something when a section block is deselected
  }
});

