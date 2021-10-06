import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

import { Image } from '../Image';
import theme from '../../helpers/themeSettings';

interface Props {
  color: string;
  idx: number;
  name: string;
  variantOptions: object;
  setVariantOptions: StateUpdater<any>;
}

const ProductColorOptionItem: FunctionComponent<Props> = ({
  color,
  idx,
  name,
  variantOptions,
  setVariantOptions,
}) => {
  return (
    <div class="input-holder custom-input custom-input--colors d-inline-flex">
      <input
        id={`filter-field-colors-01-${idx}-${name}`}
        type="radio"
        name={`filter-field-colors-${idx}-${name}`}
        onChange={() => setVariantOptions({ ...variantOptions, [name]: color })}
        checked={variantOptions && variantOptions[name] === color}
      />
      <label for={`filter-field-colors-01-${idx}-${name}`} class="custom-label">
        <span
          style={{
            width: '25px',
            height: '25px',
            backgroundColor: color.replace(' ', ''),
            display: 'inline-block',
          }}
        ></span>
        {/* <Image src={theme.placeholder_image} sizes={['26x26', '26x26']} /> */}
      </label>
    </div>
  );
};

export default ProductColorOptionItem;
