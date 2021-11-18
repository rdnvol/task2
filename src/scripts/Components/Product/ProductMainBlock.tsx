import { h, FunctionComponent, Fragment } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import { ProductType } from '../../types';
import { ProductContext } from '../../contexts/productContext';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';
import ProductForm from './ProductForm';
import ProductAccordion from './ProductAccordion';

interface Props {
  product: ProductType;
  swatcherProducts?: ProductType[] | null | undefined;
}

const ProductMainBlock: FunctionComponent<Props> = ({
  product,
  swatcherProducts,
}) => {
  const { settings, chosenProduct } = useContext(ProductContext);
  const { swatchTypes } = useContext(SwatcherProductsContext);

  const returnProduct = useMemo(() => {
    if (settings?.swatcher_type === swatchTypes.variants) {
      return product;
    }

    return chosenProduct;
  }, [settings, product, chosenProduct]);

  return (
    <div class="product-main-block__details body-2">
      <div class="product__vendor">
        by <mark>{returnProduct?.vendor}</mark>
      </div>
      <h1 class="product__title h3">{returnProduct?.title}</h1>
      {returnProduct && (
        <Fragment>
          <ProductForm product={returnProduct} />
          <ProductAccordion product={returnProduct} />
        </Fragment>
      )}
    </div>
  );
};

export default ProductMainBlock;
