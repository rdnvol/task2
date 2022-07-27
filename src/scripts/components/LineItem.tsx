import { h, Fragment, FunctionComponent } from 'preact';
import { useRef, useState, useEffect } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { getId } from 'helpers/utils';

import { useDispatch } from 'store/hook';
import useDebounce from 'hooks/useDebounce';
import { removeItem as removeItemAction, updateItem as updateItemAction } from 'store/features/cart/cartSlice';
import { CartItem } from 'types';
import theme from 'helpers/themeSettings';

import { Image } from './Image';

interface PropsType {
  item?: CartItem;
}

const LineItem: FunctionComponent<PropsType> = ({ item }) => {
  const [inputValue, setInputValue] = useState<number | null>(null);
  const dispatch = useDispatch();

  const mobileQuantityInputRef = useRef<HTMLInputElement>();
  const quantityInputRef = useRef<HTMLInputElement>();

  const removeItem = (e) => {
    e.preventDefault();
    dispatch(removeItemAction({ key: item.key }));
  };

  const updateItem = (quantity) => {
    const { key } = item;

    dispatch(
      updateItemAction({
        id: key,
        options: { quantity },
      })
    );
  };

  const changeQuantity = useDebounce(() => {
    updateItem(inputValue);
  }, 500);

  const renderImage = ({ image, url, product_title }) => (
    <div className="cart__product-img">
      <a href={url} aria-label={product_title}>
        <Image src={image} sizes={['71x88', '71x88']} />
      </a>
    </div>
  );

  const renderProperties = (properties) => {
    if (!properties) return false;

    const keys = Object.keys(properties);

    return keys.map(
      (key) =>
        properties.hasOwnProperty(key) && (
          <div key={getId()}>
            {key}: {properties[key]}
          </div>
        )
    );
  };

  const renderPrice = ({ original_price, price, final_price }) => {
    if (original_price !== final_price) {
      return (
        <Fragment>
          <ins>{formatMoney(final_price, theme.moneyFormat)}</ins>
          <del>{formatMoney(original_price, theme.moneyFormat)}</del>
        </Fragment>
      );
    }

    return <div>{formatMoney(price, theme.moneyFormat)}</div>;
  };

  const renderItemOptions = ({ options_with_values, product_has_only_default_variant }) => {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div key={`${option.name}-${option.value}`}>
          {option.name}: {option.value}
        </div>
      ));
    }
  };

  useEffect(() => {
    if (!item || inputValue) return;

    setInputValue(item?.quantity);
  }, []);

  return (
    <tr className="responsive-table-row">
      <td>
        <div className="flex items-start">
          {renderImage(item)}
          <div className="cart__product-text">
            <div className="cart__product-vendor body-3">{item.vendor}</div>
            <div className="mb-3 md:mb-2">
              <a href={item.url} className="cart__product-link">
                {item.product_title}
              </a>
            </div>
            <div className="md:hidden mb-3">
              <label htmlFor={`updates_mobile_${item.key}`} className="visually-hidden">
                Qty
              </label>
              <div className="jcf-number flex items-center">
                <button
                  className="jcf-btn-dec"
                  type="button"
                  onMouseDown={() => {
                    setInputValue(inputValue - 1);
                  }}
                  onMouseUp={changeQuantity}
                >
                  <span className="visually-hidden">Decrease quantity</span>
                </button>
                <input
                  type="number"
                  name="updates[]"
                  ref={mobileQuantityInputRef}
                  id={`updates_mobile_${item.key}`}
                  value={item.quantity}
                  onChange={(e) => setInputValue(parseInt((e.target as HTMLInputElement).value, 10))}
                  onBlur={() => updateItem(inputValue)}
                  min="0"
                  aria-label={theme.cart.quantity}
                />
                <button
                  className="jcf-btn-inc jcf-disabled"
                  type="button"
                  onMouseDown={() => {
                    setInputValue(inputValue + 1);
                  }}
                  onMouseUp={changeQuantity}
                >
                  <span className="visually-hidden">Increase quantity</span>
                </button>
              </div>
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
        <div className="product__price__box mb-4 md:mb-0">{renderPrice(item)}</div>
      </td>
      <td>
        <label htmlFor={`updates_${item.key}`} className="visually-hidden">
          Quantity
        </label>
        <div className="jcf-number flex items-center ml-auto">
          <button
            className="jcf-btn-dec"
            type="button"
            onMouseDown={() => {
              setInputValue(inputValue - 1);
            }}
            onMouseUp={changeQuantity}
          >
            <span className="visually-hidden">Decrease quantity</span>
          </button>
          <input
            type="number"
            name="updates[]"
            ref={quantityInputRef}
            id={`updates_${item.key}`}
            value={inputValue}
            onChange={(e) => setInputValue(parseInt((e.target as HTMLInputElement).value, 10))}
            onBlur={() => updateItem(inputValue)}
            min="0"
            aria-label={theme.cart.quantity}
          />
          <button
            className="jcf-btn-inc jcf-disabled"
            type="button"
            onMouseDown={() => {
              setInputValue(inputValue + 1);
            }}
            onMouseUp={changeQuantity}
          >
            <span className="visually-hidden">Increase quantity</span>
          </button>
        </div>
      </td>
      <td>{formatMoney(item.final_line_price, theme.moneyFormat)}</td>
    </tr>
  );
};

export default LineItem;
