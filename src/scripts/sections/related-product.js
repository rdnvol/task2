import { register } from '@shopify/theme-sections';

register('product-recommendations', {
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad(e) {
    new RelatedProducts(this.container);
    // Do something when a section instance is loaded
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
    // Do something when a section instance is unloaded
  },
});

class RelatedProducts {
  constructor(elem) {
    this.wrapper = elem;
    this.limit = this.wrapper.getAttribute('data-limit');

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;

      observer.unobserve(this.wrapper);
      this.init();
    };

    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 200px 0px' }).observe(
      this.wrapper
    );
  }

  async initRelatedProducts() {
    const url = this.wrapper.getAttribute('data-url');
    const response = await fetch(url);

    return await response.text();
  }

  async init() {
    const relatedProductsData = await this.initRelatedProducts();

    this.wrapper.appendChild(new DOMParser().parseFromString(relatedProductsData, 'text/html').querySelector('.container'));
  }
}
