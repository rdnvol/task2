import { h, Component, render, Fragment } from 'preact';
import { formatMoney } from '@shopify/theme-currency/currency';
import { debounce } from 'debounce';

class LineItem extends Component {
  constructor(props) {
    super(props);
  }

  removeItem = (e) => {
    e.preventDefault();
    let item = this.props.item;
    this.props.removeItem(item.key);
  };

  updateItem = (e) => {
    let key = this.props.item.key;
    let quantity = +e.target.value;
    this.props.updateItem(key, { quantity });
  };

  changeQuantity(action, element) {
    let changeEvent = new Event('change');
    switch (action) {
      case '+':
        element.value = ++element.value;
        element.dispatchEvent(changeEvent);
        break;
      case '-':
        element.value = --element.value;
        element.dispatchEvent(changeEvent);
    }
  }

  renderImage({ image, title, url }) {
    return (
      <div className="cart__product-img">
        <a href={url}>
          <picture>
            <source
              data-srcset={resizeImageSrcset(image, '71x88 ')}
              media="(max-width: 767px)"
              srcSet={theme.placeholder_data}
            />
            <source
              data-srcset={resizeImageSrcset(image, '71x88')}
              srcSet={theme.placeholder_data}
            />
            <img
              data-src={resizeImage(image, '71x88')}
              className="lazyload"
              data-sizes="auto"
              alt={title}
              src={theme.placeholder_data}
            />
          </picture>
        </a>
      </div>
    );
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

  renderPrice({ original_line_price, line_price, original_price, price }) {
    if (original_line_price !== line_price) {
      return (
        <Fragment>
          <ins>{formatMoney(price, theme.moneyFormat)}</ins>
          <del>{formatMoney(line_price, theme.moneyFormat)}</del>
        </Fragment>
      );
    } else {
      return <div>{formatMoney(price, theme.moneyFormat)}</div>;
    }
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

  render({ item, updateCart }) {
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
      line_price,
    } = item;
    return (
      <tr className="responsive-table-row">
        <td>
          <div className="d-flex align-items-start">
            {this.renderImage(item)}
            <div className="cart__product-text">
              <div className="cart__product-vendor body-3">{vendor}</div>
              <div className="mb-3 mb-md-2">
                <a href={url} className="cart__product-link">
                  {product_title}
                </a>
              </div>
              <div className="d-md-none mb-3">
                <label
                  htmlFor={`updates_mobile_${key}`}
                  className="visually-hidden"
                >
                  Qty
                </label>
                <span class="jcf-number">
                  <input
                    type="number"
                    name="updates[]"
                    ref={(c) => (this.mobileQuantityInput = c)}
                    id={`updates_mobile_${key}`}
                    value={this.props.item.quantity}
                    onChange={debounce(this.updateItem, 200)}
                    min="0"
                    aria-label={theme.cart.quantity}
                  />
                  <span
                    class="jcf-btn-inc"
                    onClick={() =>
                      this.changeQuantity('+', this.mobileQuantityInput)
                    }
                  />
                  <span
                    class="jcf-btn-dec jcf-disabled"
                    onClick={() =>
                      this.changeQuantity('-', this.mobileQuantityInput)
                    }
                  />
                </span>
              </div>
              <div>
                {this.renderItemOptions(item)}
                {this.renderProperties(properties)}
              </div>
              <a
                className="cart__button-remove body-3"
                href="/cart/change?line={{ forloop.index }}&amp;quantity=0"
                onClick={this.removeItem}
              >
                {theme.cart.remove}
              </a>
            </div>
          </div>
        </td>
        <td>
          <div className="product__price__box mb-4 mb-md-0">
            {this.renderPrice(item)}
          </div>
        </td>
        <td>
          <span class="jcf-number">
            <input
              type="number"
              name="updates[]"
              ref={(c) => (this.quantityInput = c)}
              id={`updates_${key}`}
              value={this.props.item.quantity}
              onChange={debounce(this.updateItem, 200)}
              min="0"
              aria-label={theme.cart.quantity}
            />
            <span
              className="jcf-btn-inc"
              onClick={() => this.changeQuantity('+', this.quantityInput)}
            />
            <span
              className="jcf-btn-dec"
              onClick={() => this.changeQuantity('-', this.quantityInput)}
            />
          </span>
        </td>
        <td>{formatMoney(line_price, theme.moneyFormat)}</td>
      </tr>
    );
  }
}

export default LineItem;
