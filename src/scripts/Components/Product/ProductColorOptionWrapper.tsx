import { h, FunctionComponent, Fragment } from 'preact';
import { StateUpdater, useContext, useMemo } from 'preact/hooks';

import { OptionWithValuesType, ProductType, VariantType } from '../../types';
import ProductColorOptionItem from './ProductColorOptionItem';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';
import { ProductContext } from '../../contexts/productContext';
import theme from '../../helpers/themeSettings';

interface Props {
  variants?: boolean;
  key?: string | number;
  option?: OptionWithValuesType | null;
  variantOptions?: object | null;
  setVariantOptions?: StateUpdater<any>;
  setChosenVariant?: StateUpdater<any>;
  setQuantity?: StateUpdater<any>;
  chosenProduct?: ProductType;
  chosenVariant?: VariantType;
}

const ProductColorOptionWrapper: FunctionComponent<Props> = ({
  chosenVariant,
  variants,
  option,
  variantOptions,
  setVariantOptions,
  setChosenVariant,
  setQuantity,
}) => {
  const { swatchProducts, swatchTypes } = useContext(SwatcherProductsContext);
  const {
    settings,
    chosenProduct,
    setChosenProduct,
    enhanceProduct,
    getSwatchData,
  } = useContext(ProductContext);

  const renderVariants = useMemo(() => {
    if (!option?.values?.length) return;

    return option.values.map((color, idx) => (
      <ProductColorOptionItem
        enhanceProduct={enhanceProduct}
        chosenVariant={chosenVariant}
        variants={variants}
        settings={settings}
        swatchTypes={swatchTypes}
        variantOptions={variantOptions}
        setVariantOptions={setVariantOptions}
        idx={idx}
        key={color + idx}
        color={color}
        name={option?.name?.toLowerCase()}
      />
    ));
  }, [option, variantOptions]);

  const renderProducts = useMemo(() => {
    if (!swatchProducts) return;

    return swatchProducts.map((product, idx) => {
      const { swatchName, swatchColor } = getSwatchData(product);

      return (
        <ProductColorOptionItem
          enhanceProduct={enhanceProduct}
          product={product}
          chosenProduct={chosenProduct}
          settings={settings}
          swatchTypes={swatchTypes}
          variantOptions={variantOptions}
          setVariantOptions={setVariantOptions}
          color={swatchColor}
          name={swatchName}
          key={product.id}
          idx={idx}
          setChosenProduct={setChosenProduct}
          setChosenVariant={setChosenVariant}
          setQuantity={setQuantity}
        />
      );
    });
  }, [swatchProducts, chosenProduct]);

  return (
    // option.values?.length && (
    <div class="row mb-2">
      <div class="col-sm-6 col-md-9 col-lg-6">
        <div class="product__variant-label-box mb-1">
          {settings?.swatcher_type === swatchTypes.products && !variants ? (
            <Fragment>
              <span class="product__variant-label">
                {theme.product.color_title}:{' '}
              </span>
              <span>{chosenProduct?.swatchName}</span>
            </Fragment>
          ) : (
            <Fragment>
              <span class="product__variant-label">{option.name}: </span>
              <span>{variantOptions[option?.name.toLowerCase()]}</span>
            </Fragment>
          )}
        </div>
        <div class="flex flex-wrap">
          {settings?.swatcher_type === swatchTypes.products && !variants
            ? renderProducts
            : renderVariants}
        </div>
      </div>
    </div>
    // )
  );
};

export default ProductColorOptionWrapper;
