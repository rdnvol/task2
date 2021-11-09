import { h, Component } from 'preact';
import { Image } from './Image';

class CartJustAdded extends Component {
  constructor(props) {
    super(props);
  }

  renderItemOptions({ options_with_values, product_has_only_default_variant }) {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div>
          {option.name}: {option.value}
        </div>
      ));
    }
  }

  render({ justAdded }) {
    const { featured_image, product_title, quantity, id } = justAdded;

    return (
      <div className="cart-popup__item">
        <div className="row align-items-center">
          <div className="col-3">
            <div className="cart-popup__item__img">
              <Image
                key={id}
                src={featured_image.url}
                sizes={['63x79']}
                alt={featured_image.alt}
                ratio={featured_image.aspect_ratio}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="cart-popup__item__title">{product_title}</div>
            {this.renderItemOptions(justAdded)}
          </div>
          <div className="col-3 text-right">
            {theme.cart.quantity} {quantity}
          </div>
        </div>
      </div>
    );
  }
}

export default CartJustAdded;
