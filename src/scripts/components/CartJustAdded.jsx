import { h, Component } from 'preact';
import { getId } from 'helpers/utils';
import { Image } from './Image';

class CartJustAdded extends Component {
  constructor(props) {
    super(props);
  }

  renderItemOptions({ options_with_values, product_has_only_default_variant }) {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div key={`${getId()}-${option}`}>
          <span className="base-secondary-text inline-block mr-1">{option.name}:</span>
          {option.value}
        </div>
      ));
    }
  }

  render({ justAdded }) {
    const { featured_image, product_title, quantity, id } = justAdded;

    return (
      <div className="flex items-center">
        <div className="cart-popup__img flex-shrink-0 mr-4">
          <Image
            key={id}
            src={featured_image.url}
            sizes={['64x80', '90x90', '90x90']}
            alt={featured_image.alt}
            ratio={featured_image.aspect_ratio}
          />
        </div>
        <div className="-mb-2">
          <div className="title mb-2">{product_title}</div>
          <div className="body-small mb-2">{this.renderItemOptions(justAdded)}</div>
          <div className="body-small mb-2" data-test-id="added-quantity">
            <span className="base-secondary-text inline-block mr-1">{theme.cart.quantity}:</span>
            {quantity}
          </div>
        </div>
      </div>
    );
  }
}

export default CartJustAdded;
