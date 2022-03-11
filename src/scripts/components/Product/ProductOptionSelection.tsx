import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

import { OptionWithValuesType, ProductType } from 'types';
import ProductOptionItem from './ProductOptionItem';

interface Props {
  option: OptionWithValuesType | null;
  variantOptions: object;
  setVariantOptions: StateUpdater<any>;
  product?: ProductType;
}

const ProductOptionSelection: FunctionComponent<Props> = ({ option, variantOptions, setVariantOptions, product }) =>
  option?.values?.length && (
    <div className="sm:flex mb-2">
      <div className="sm:w-6/12 md:w-9/12 lg:w-6/12">
        <div className="product__variant-label-box mb-1">
          <span className="product__variant-label">{option.name}: </span>
          <span>{variantOptions[option.name.toLowerCase()]}</span>
        </div>
        {option.values.map((value, idx) => (
          <ProductOptionItem
            name={option.name.toLowerCase()}
            value={value}
            idx={idx}
            key={option.name}
            variantOptions={variantOptions}
            setVariantOptions={setVariantOptions}
            product={product}
          />
        ))}
      </div>
    </div>
  );

export default ProductOptionSelection;
