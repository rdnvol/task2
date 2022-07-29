import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';

class RelatedProducts {
  constructor(elem, sectionId) {
    this.wrapper = elem;
    this.limit = this.wrapper.getAttribute('data-limit');

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;

      observer.unobserve(this.wrapper);
      this.init(sectionId);
    };

    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 200px 0px' }).observe(this.wrapper);
  }

  async initRelatedProducts() {
    const url = this.wrapper.getAttribute('data-url');
    const response = await fetch(url);
    const text = await response.text();

    return text;
  }

  async init(sectionId) {
    performanceMeasure(
      sectionId,
      async () => {
        const relatedProductsData = await this.initRelatedProducts();

        this.wrapper.appendChild(
          new DOMParser().parseFromString(relatedProductsData, 'text/html').querySelector('.container')
        );
      },
      true
    );
  }
}

register('product-recommendations', {
  onLoad() {
    new RelatedProducts(this.container, this.id);
  },
});
