import { renderImage } from 'helpers/utils';
import { Product } from './product';

export default class ProductCard extends Product {
  constructor(elem) {
    super(elem);
  }

  changeVariantImage(variant) {
    const imageWrapper = this.wrapper.querySelector('[data-featured-image]');

    if (variant.featured_image?.src) {
      imageWrapper.innerHTML = '';
      imageWrapper.insertAdjacentHTML(
        'afterbegin',
        renderImage(variant.featured_image.src, ['288x288', '573x573'], variant.featured_image.alt, true)
      );
    }
  }

  onOptionChange(variant) {
    this.updatePickupAvailability(variant);
    this.updateVariantPrice(variant);
    this.updateVariantUnitPrice(variant);
    this.updateSubmitButton(variant);
    this.changeVariantImage(variant);
  }
}
