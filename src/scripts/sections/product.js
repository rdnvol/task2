import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';
import { Product } from '../models/product';

register('product', {
  _initProduct(handle) {
    if (handle) window.Product = new Product(this.container);
  },

  onLoad() {
    performanceMeasure(this.id, this._initProduct.bind(this, this.container.dataset.handle));
  },

  onBlockSelect() {
    this._initProduct(this.container.dataset.handle);
  },
});
