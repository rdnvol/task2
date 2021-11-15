import { register } from '@shopify/theme-sections';

register('product-recommendations', {
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    console.log(this);
    new RelatedProducts(this.container);
    console.log('recommendations loaded sds d');
    // Do something when a section instance is loaded
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function () {
    // Do something when a section instance is unloaded
  },
});

class RelatedProducts {
  constructor(elem) {
    this.wrapper = $(elem);
    this.limit = this.wrapper.data('limit');

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this.wrapper[0]);
      this.init();
    }
    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 200px 0px'}).observe(this.wrapper[0]);
  }

  async initRelatedProducts() {
    const url = this.wrapper.data('url');
    const response = await fetch(url);
    return await response.text();
  }

  async init() {
    let relatedProductsData = await this.initRelatedProducts();
    this.wrapper.html($(relatedProductsData).find('.container'));
    console.log('loaded recommendations');
  }
}
