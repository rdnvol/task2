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
    <div class="row">
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6 mb-4 mb-lg-0 custom-form">
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
      </div>
    </div>
  );
};

export default ProductQuantity;
