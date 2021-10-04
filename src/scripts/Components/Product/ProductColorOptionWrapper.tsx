import { h, FunctionComponent } from 'preact';
import { StateUpdater, useMemo } from 'preact/hooks';

import { Image } from '../Image';
import { OptionWithValuesType } from '../../types';
import theme from '../../helpers/themeSettings';
import ProductColorOptionItem from './ProductColorOptionItem';

interface Props {
  key?: string | number;
  option: OptionWithValuesType | null;
  variantOptions: object | null;
  setVariantOptions: StateUpdater<any>;
}

const ProductColorOptionWrapper: FunctionComponent<Props> = ({
  option,
  variantOptions,
  setVariantOptions,
}) => {
  console.log('Option from Product color option', option);
  return (
    option.values?.length && (
      <div class="row mb-2">
        <div class="col-sm-6 col-md-9 col-lg-6">
          <div class="product__variant-label-box mb-1">
            <span class="product__variant-label">{option.name}: </span>
            <span>{variantOptions[option.name.toLowerCase()]}</span>
          </div>
          {option.values.map((color, idx) => (
            <ProductColorOptionItem
              variantOptions={variantOptions}
              setVariantOptions={setVariantOptions}
              idx={idx}
              key={color + idx}
              color={color}
              name={option.name.toLowerCase()}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default ProductColorOptionWrapper;
