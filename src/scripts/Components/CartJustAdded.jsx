import { h, Component } from "preact";

class CartJustAdded extends Component {
  constructor(props) {
    super(props);
    console.log('justAdded', props.justAdded);
  }
  
  renderItemOptions({options_with_values, product_has_only_default_variant}) {
    if (!product_has_only_default_variant) {
      return options_with_values.map(option =>
        <div>{ option.name }: { option.value }</div>
      )
    }
  }
  
  render({justAdded}) {
    const {image, product_title, quantity} = justAdded;
    return (
      <div className="cart-popup__item">
        <div className="row align-items-center">
          <div className="col-3">
            <div className="cart-popup__item__img">
              <picture>
                <source data-srcset={ resizeImageSrcset(image, '70x') } media="(max-width: 767px)"
                        srcSet={ theme.placeholder_data }/>
                <source data-srcset={ resizeImageSrcset(image, '80x') } srcSet={ theme.placeholder_data }/>
                <img data-src={ resizeImage(image, '80x') } className="lazyload" data-sizes="auto"
                     alt="image description" src={ theme.placeholder_data }/>
              </picture>
            </div>
          </div>
          <div className="col-6">
            <div className="cart-popup__item__title">{ product_title }</div>
            { this.renderItemOptions(justAdded) }
          </div>
          <div className="col-3 text-right">Qty: { quantity }</div>
        </div>
      </div>
    )
  }
}

export default CartJustAdded;
