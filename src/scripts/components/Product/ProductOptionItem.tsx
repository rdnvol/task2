import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';
import { ProductType, VariantType } from 'types';

interface Props {
  name: string;
  idx?: number;
  value: string | number;
  variantOptions: object;
  setVariantOptions: StateUpdater<any>;
  product?: ProductType;
  chosenVariant?: VariantType;
}

const ProductOptionItem: FunctionComponent<Props> = ({
  name,
  idx,
  value,
  variantOptions,
  setVariantOptions,
  product,
}) => {
  const currentVariantObj = product.variants.find(
    // @ts-ignore
    (variant) => variant.options[1] === value && variant.options[0] === variantOptions.color
  );

  const isDisabled = !currentVariantObj?.available;

  return (
    <div className="input-holder custom-input custom-input--size inline-flex">
      <input
        id={`filter-field-size-01-${idx}-${value}`}
        type="radio"
        name={`filter-field-size-${idx}-${value}`}
        onChange={() =>
          setVariantOptions({
            ...variantOptions,
            [name]: value,
          })
        }
        checked={variantOptions && variantOptions[name] === value}
        disabled={isDisabled}
      />
      <label htmlFor={`filter-field-size-01-${idx}-${value}`} className="custom-label">
        <span>{value}</span>
      </label>
    </div>
  );
};

export default ProductOptionItem;
