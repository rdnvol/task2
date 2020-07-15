import { h, Component, render, Fragment } from "preact";
import { formatMoney } from "@shopify/theme-currency/currency";
import { debounce } from "debounce";

class LineItem extends Component {
  constructor(props) {
    super(props);
  }
  
  removeItem = e => {
    e.preventDefault();
    let item = this.props.item;
    this.props.removeItem(item.key);
  }
  
  updateItem = e => {
    let key = this.props.item.key;
    let quantity = +e.target.value;
    this.props.updateItem(key, {quantity});
  }
  
  renderImage({image, title, url}) {
    return (
      <div className="cart__product-img">
        <a href={ url }>
          <picture>
            <source data-srcset={ resizeImageSrcset(image, '120x') }
                    media="(max-width: 767px)"
                    srcSet={ theme.placeholder_data }/>
            <source data-srcset={ resizeImageSrcset(image, '240x') }
                    srcSet={ theme.placeholder_data }/>
            <img data-src={ resizeImage(image, '240x') } className="lazyload" data-sizes="auto"
                 alt={ title }
                 src={ theme.placeholder_data }/>
          </picture>
        </a>
      </div>
    )
  }
  
  renderProperties(properties) {
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        var obj = properties[key];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return obj[prop];
          }
        }
      }
    }
  }
  
  renderPrice({original_line_price, line_price, original_price, price}) {
    if (original_line_price !== line_price) {
      return (
        <Fragment>
          <span className="visually-hidden">{ theme.cart.discounted_price }</span>
          { formatMoney(price, theme.moneyFormat) }
          <span className="visually-hidden">{ theme.cart.original_price }</span>
          <s>{ formatMoney(line_price, theme.moneyFormat) }</s>
        </Fragment>
      )
    } else {
      return formatMoney(price, theme.moneyFormat)
    }
  }
  
  renderItemOptions({options_with_values, product_has_only_default_variant}) {
    if (!product_has_only_default_variant) {
      return options_with_values.map(option =>
        <div>{ option.name }: { option.value }</div>
      )
    }
  }
  
  render({item, updateCart}) {
    const {
      key,
      image,
      product_title,
      url,
      product_has_only_default_variant,
      variant_title,
      properties,
      vendor,
      quantity,
      line_price
    } = item;
    return (
      <tr className="responsive-table-row">
        <td>
          <div className="row">
            <div className="col-4 col-md-3">
              { this.renderImage(item) }
            </div>
            <div className="col-8 col-md-9">
              <div className="cart__product-text">
                <a href={ url } className="cart__product-link">
                  <strong>
                    { product_title }
                  </strong>
                </a>
                { this.renderItemOptions(item) }
                <p>{ vendor }</p>
                { this.renderProperties(properties) }
                
                <a href="/cart/change?line={{ forloop.index }}&amp;quantity=0" onClick={ this.removeItem }>
                  <small>{ theme.cart.remove }</small>
                </a>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div className="mb-4 mb-md-0">
            { this.renderPrice(item) }
          </div>
          <div className="d-flex d-md-none align-items-center justify-content-end">
            <label htmlFor={ `updates_mobile_${ key }` } className="mr-2">Qty</label>
            <input type="number"
                   name="updates[]"
                   id={ `updates_mobile_${ key }` }
                   value={ quantity }
                   onChange={ debounce(this.updateItem, 200) }
                   min="0"
                   aria-label={ theme.cart.quantity }/>
          </div>
        </td>
        <td>
          <input type="number"
                 name="updates[]"
                 id={ `updates_${ key }` }
                 value={ quantity }
                 onChange={ debounce(this.updateItem, 200) }
                 min="0"
                 aria-label={ theme.cart.quantity }/>
        </td>
        <td>
          { formatMoney(line_price, theme.moneyFormat) }
        </td>
      </tr>
    )
  }
}

export default LineItem;
