import { h, FunctionComponent, Fragment } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import { ProductType } from 'types';
import { ProductContext } from 'contexts/productContext';
import { SwatcherProductsContext } from 'contexts/swatcherProductsContext';

import ProductForm from './ProductForm';
import ProductAccordion from './ProductAccordion';

interface Props {
  product: ProductType;
  swatcherProducts?: ProductType[] | null;
}

const ProductMainBlock: FunctionComponent<Props> = ({ product }) => {
  const { settings, chosenProduct } = useContext(ProductContext);
  const { swatchTypes } = useContext(SwatcherProductsContext);

  const returnProduct = useMemo(() => {
    if (settings?.swatcher_type === swatchTypes.variants) {
      return product;
    }

    return chosenProduct;
  }, [settings, product, chosenProduct]);

  return (
    <div className="product-main-block__details product-main-block__details--sticky body-2">
      <div className="product__vendor">
        by <mark>{returnProduct?.vendor}</mark>
      </div>
      <h1 className="product__title h3">{returnProduct?.title}</h1>
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
