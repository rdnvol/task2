import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

interface Props {
  name: string;
  idx?: number;
  value: string | number;
  variantOptions: object;
  setVariantOptions: StateUpdater<any>;
}

const ProductOptionItem: FunctionComponent<Props> = ({
  name,
  idx,
  value,
  variantOptions,
  setVariantOptions,
}) => {
  return (
    <div class="input-holder custom-input custom-input--size inline-flex">
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
      />
      <label for={`filter-field-size-01-${idx}-${value}`} class="custom-label">
        <span>{value}</span>
      </label>
    </div>
  );
};

export default ProductOptionItem;
