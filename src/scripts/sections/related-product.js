import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';

class RelatedProducts {
  constructor(elem) {
    this.wrapper = elem;
    this.limit = this.wrapper.getAttribute('data-limit');

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;

      observer.unobserve(this.wrapper);
      this.init();
    };

    new IntersectionObserver(handleIntersection.bind(this), { rootMargin: '0px 0px 200px 0px' }).observe(this.wrapper);
  }

  async initRelatedProducts() {
    const url = this.wrapper.getAttribute('data-url');
    const response = await fetch(url);
    const text = await response.text();

    return text;
  }

  async init() {
    const relatedProductsData = await this.initRelatedProducts();

    this.wrapper.appendChild(
      new DOMParser().parseFromString(relatedProductsData, 'text/html').querySelector('.container')
    );
  }
}

register('product-recommendations', {
  onLoad() {
    const sectionName = `${this.container.getAttribute('data-section-type')}-${this.id}`;

    performanceMeasure(sectionName, () => {
      performance.mark(`${sectionName}-Start`);

      new RelatedProducts(this.container);

      performance.mark(`${sectionName}-End`);
    });
  },
});
