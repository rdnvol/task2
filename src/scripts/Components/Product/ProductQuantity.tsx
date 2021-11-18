import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

import theme from '../../helpers/themeSettings';

interface Props {
  quantity: number;
  setQuantity: StateUpdater<number>;
}

const ProductQuantity: FunctionComponent<Props> = ({
  quantity,
  setQuantity,
}) => {
  return (
    <div class="sm:flex product__row">
      <div class="sm:w-7/12 lg:w-5/12">
        <label class="product__label" for="Quantity">
          {theme.product.quantity}
        </label>
        <input
          type="number"
          id="Quantity"
          name="quantity"
          className="w-100"
          value={quantity}
          min="1"
          onChange={(e) => {
            if (!(e.target as HTMLInputElement).value) {
              return setQuantity(1);
            }
            setQuantity(parseInt((e.target as HTMLInputElement).value));
          }}
          onBlur={(e) => {
            if (!(e.target as HTMLInputElement).value) {
              return setQuantity(1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProductQuantity;
