import { h, Fragment, FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { useDispatch } from './hook';
import { debounce } from 'debounce';

import { CartItem } from '../types/index';
import { resizeImage, resizeImageSrcset } from '../helpers/utils';
import {
  removeItem as removeItemAction,
  updateItem as updateItemAction,
} from '../redux/features/cart/cartSlice';
import theme from '../helpers/themeSettings';

interface PropsType {
  item?: CartItem;
}

const LineItem: FunctionComponent<PropsType> = ({ item }) => {
  const dispatch = useDispatch();

  const mobileQuantityInputRef = useRef<HTMLInputElement>();
  const quantityInputRef = useRef<HTMLInputElement>();

  const removeItem = (e) => {
    e.preventDefault();
    dispatch(removeItemAction({ key: item.key }));
  };

  const updateItem = (e) => {
    const key = item.key;
    const quantity = +e.target.value;

    dispatch(updateItemAction({ id: key, options: { quantity } }));
  };

  const changeQuantity = (action, element) => {
    const key = item.key;

    switch (action) {
      case '+':
        element.value = ++element.value;

        dispatch(
          updateItemAction({
            id: key,
            options: { quantity: parseInt(element.value) },
          })
        );

        break;
      case '-':
        element.value = --element.value;
        dispatch(
          updateItemAction({
            id: key,
            options: { quantity: parseInt(element.value) },
          })
        );
    }
  };

  const renderImage = ({ image, title, url }) => {
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
  };

  const renderProperties = (properties) => {
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
  };

  const renderPrice = ({
    original_price,
    price,
    final_price
  }) => {
    if (original_price !== final_price) {
      return (
        <Fragment>
          <ins>{formatMoney(final_price, theme.moneyFormat)}</ins>
          <del>{formatMoney(original_price, theme.moneyFormat)}</del>
        </Fragment>
      );
    } else {
      return <div>{formatMoney(price, theme.moneyFormat)}</div>;
    }
  };

  const renderItemOptions = ({
    options_with_values,
    product_has_only_default_variant,
  }) => {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div>
          {option.name}: {option.value}
        </div>
      ));
    }
  };

  return (
    <tr className="responsive-table-row">
      <td>
        <div className="d-flex align-items-start">
          {renderImage(item)}
          <div className="cart__product-text">
            <div className="cart__product-vendor body-3">{item.vendor}</div>
            <div className="mb-3 mb-md-2">
              <a href={item.url} className="cart__product-link">
                {item.product_title}
              </a>
            </div>
            <div className="d-md-none mb-3">
              <label
                htmlFor={`updates_mobile_${item.key}`}
                className="visually-hidden"
              >
                Qty
              </label>
              <span class="jcf-number">
                <input
                  type="number"
                  name="updates[]"
                  ref={mobileQuantityInputRef}
                  id={`updates_mobile_${item.key}`}
                  value={item.quantity}
                  onChange={debounce(updateItem, 200)}
                  min="0"
                  aria-label={theme.cart.quantity}
                />
                <span
                  class="jcf-btn-inc"
                  onClick={() =>
                    changeQuantity('+', mobileQuantityInputRef.current)
                  }
                />
                <span
                  class="jcf-btn-dec jcf-disabled"
                  onClick={() =>
                    changeQuantity('-', mobileQuantityInputRef.current)
                  }
                />
              </span>
            </div>
            <div>
              {renderItemOptions(item)}
              {renderProperties(item.properties)}
            </div>
            <a
              className="cart__button-remove body-3"
              href="/cart/change?line={{ forloop.index }}&amp;quantity=0"
              onClick={removeItem}
            >
              {theme.cart.remove}
            </a>
          </div>
        </div>
      </td>
      <td>
        <div className="product__price__box mb-4 mb-md-0">
          {renderPrice(item)}
        </div>
      </td>
      <td>
        <span class="jcf-number">
          <input
            type="number"
            name="updates[]"
            ref={quantityInputRef}
            id={`updates_${item.key}`}
            value={item.quantity}
            onChange={debounce(updateItem, 200)}
            min="0"
            aria-label={theme.cart.quantity}
          />
          <span
            className="jcf-btn-inc"
            onClick={() => changeQuantity('+', quantityInputRef.current)}
          />
          <span
            className="jcf-btn-dec"
            onClick={() => changeQuantity('-', quantityInputRef.current)}
          />
        </span>
      </td>
      <td>{formatMoney(item.line_price, theme.moneyFormat)}</td>
    </tr>
  );
};

export default LineItem;
