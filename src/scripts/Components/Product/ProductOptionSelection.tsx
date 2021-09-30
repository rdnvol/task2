import { h, FunctionComponent, Fragment } from 'preact';
import { StateUpdater } from 'preact/hooks';

import { OptionWithValuesType } from '../../types';
import ProductOptionItem from './ProductOptionItem';

interface Props {
  option: OptionWithValuesType | null;
  variantOptions: object;
  setVariantOptions: StateUpdater<any>;
}

const ProductOptionSelection: FunctionComponent<Props> = ({
  option,
  variantOptions,
  setVariantOptions,
}) => {
  return (
    option?.values?.length && (
      <Fragment>
        <div class="row mb-2">
          <div class="col-sm-6 col-md-9 col-lg-6">
            <div class="product__variant-label-box mb-1">
              <span class="product__variant-label">{option.name}: </span>
              <span>{variantOptions[option.name.toLowerCase()]}</span>
            </div>
            {option.values.map((value, idx) => (
              <ProductOptionItem
                name={option.name.toLowerCase()}
                value={value}
                idx={idx}
                variantOptions={variantOptions}
                setVariantOptions={setVariantOptions}
              />
            ))}
          </div>
        </div>
      </Fragment>
    )
  );
};

export default ProductOptionSelection;
