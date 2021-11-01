import { h, FunctionComponent } from 'preact';

import { ProductType, AddItemType } from '../../types';
import ProductGallery from './ProductGallery';
import ProductMainBlock from './ProductMainBlock';

interface Props {
  product: ProductType;
  addItem: AddItemType;
}

const Product: FunctionComponent<Props> = ({ product, addItem }) => {
  return (
    <div class="container">
      <div class="product-main-block position-relative">
        <div class="row">
          <div class="col-md-6 mb-4 mb-md-0">
            <ProductGallery media={product.media} />
          </div>
          <div class="col-md-6">
            <ProductMainBlock addItem={addItem} product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;