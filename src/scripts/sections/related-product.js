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
    this.productId = this.wrapper.data('product-id');
    this.init();
  }

  async initRelatedProducts() {
    const url = `/recommendations/products?section_id=product-recommendations&limit=${this.limit}&product_id=${this.productId}`;
    const response = await fetch(url);
    return await response.text();
  }

  async init() {
    let relatedProductsData = await this.initRelatedProducts();
    this.wrapper.html($(relatedProductsData).find('.container'));
    console.log('loaded recommendations');
  }
}
