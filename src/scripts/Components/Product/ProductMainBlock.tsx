import { h, FunctionComponent } from 'preact';

import { ProductType, AddItemType } from '../../types';
import ProductForm from './ProductForm';
import ProductAccordion from './ProductAccordion';

interface Props {
  addItem: AddItemType;
  product: ProductType;
}

const ProductMainBlock: FunctionComponent<Props> = ({ product, addItem }) => {
  return (
    <div class="product-main-block__details body-2">
      <div class="product__vendor body-2">
        by <mark>{product.vendor}</mark>
      </div>
      <h1 class="product__title h3">{product.title}</h1>
      <ProductForm addItem={addItem} product={product} />
      <ProductAccordion />
      {/* {% if section.settings.show_share_buttons %}
          {% include 'social-sharing', share_title: product.title, share_permalink: product.url, share_image: product %}
        {% endif %} */}
    </div>
  );
};

export default ProductMainBlock;