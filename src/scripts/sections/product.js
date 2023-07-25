import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';
import { Product } from '../models/product';

register('product', {
  _initProduct(handle) {
    if (handle) window.Product = new Product(this.container);
  },

  _initCcomplementaryProducts() {
    const productRecommendationsSection = document.querySelector('.product-complementary');
    const { url } = productRecommendationsSection.dataset;
    const button = document.querySelector('#accordion5id').parentElement;

    button.addEventListener('click', (event) => {
      if (button.classList.contains('open')) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            const html = document.createElement('div');

            html.innerHTML = text;
            const recommendations = html.querySelector('.product-complementary');

            if (recommendations && recommendations.innerHTML.trim().length) {
              productRecommendationsSection.innerHTML = recommendations.innerHTML;
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    });
  },

  onLoad() {
    performanceMeasure(this.id, this._initProduct.bind(this, this.container.dataset.handle));
    this._initCcomplementaryProducts();
  },

  onBlockSelect() {
    this._initProduct(this.container.dataset.handle);
  },
});
