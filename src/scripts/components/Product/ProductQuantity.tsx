import { h, FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

import theme from 'helpers/themeSettings';

interface Props {
  quantity: number;
  setQuantity: StateUpdater<number>;
}

const ProductQuantity: FunctionComponent<Props> = ({ quantity, setQuantity }) => (
  <div className="sm:flex product__row">
    <div className="sm:w-7/12 lg:w-5/12">
      <label className="product__label" htmlFor="Quantity">
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

          setQuantity(parseInt((e.target as HTMLInputElement).value, 10));
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

export default ProductQuantity;
