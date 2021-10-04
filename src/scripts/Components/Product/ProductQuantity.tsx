import { h, FunctionComponent } from 'preact';

interface Props {
  quantity: number;
  setQuantity: (quantity: number | string) => void;
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
            <label class="product__label accessibility" for="Quantity">
              {quantity}
            </label>
            <input
              type="number"
              id="Quantity"
              name="quantity"
              value={quantity}
              min="1"
              onChange={(e) =>
                setQuantity((e.target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuantity;
