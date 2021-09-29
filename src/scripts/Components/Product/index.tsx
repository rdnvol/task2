import { h, FunctionComponent } from "preact";

import { ProductType } from "../../types";
import ProductGallery from "./ProductGallery";
import ProductMainBlock from "./ProductMainBlock";

const Product: FunctionComponent<{ product: ProductType }> = ({ product }) => {
  console.log("Product data", product);
  return (
    <div class="container">
      <div class="product-main-block position-relative">
        <div class="row">
          <div class="col-md-6 mb-4 mb-md-0">
            <ProductGallery media={product.media} />
          </div>
          <div class="col-md-6">
            <ProductMainBlock product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
