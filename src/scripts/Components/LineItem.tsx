import { h, Fragment, FunctionComponent } from 'preact';
import { useRef, useState, useEffect } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { useDispatch } from '../redux/hook';
import { debounce } from 'debounce';

import { CartItem } from '../types/index';
import { resizeImage, resizeImageSrcset } from '../helpers/utils';
import {
  removeItem as removeItemAction,
  updateItem as updateItemAction,
} from '../redux/features/cart/cartSlice';
import { Image } from '../Components/Image';
import useDebounce from '../hooks/useDebounce';
import theme from '../helpers/themeSettings';

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
    const key = item.key;

    dispatch(updateItemAction({ id: key, options: { quantity } }));
  };

  const handleChange = (quantity) => {
    const key = item.key;
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

  const renderImage = ({ image, url }) => {
    return (
      <div className="cart__product-img">
        <a href={url}>
          <Image src={image} sizes={['71x88', '71x88']} />
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

  const renderPrice = ({ original_price, price, final_price }) => {
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
              <label
                htmlFor={`updates_mobile_${item.key}`}
                className="visually-hidden"
              >
                Qty
              </label>
              <div class="jcf-number flex items-center">
                <button
                  class="jcf-btn-dec"
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
                  onChange={(e) =>
                    setInputValue(
                      parseInt((e.target as HTMLInputElement).value)
                    )
                  }
                  onBlur={() => updateItem(inputValue)}
                  min="0"
                  aria-label={theme.cart.quantity}
                />
                <button
                  class="jcf-btn-inc jcf-disabled"
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
        <div className="product__price__box mb-4 md:mb-0">
          {renderPrice(item)}
        </div>
      </td>
      <td>
        <label htmlFor={`updates_${item.key}`} className="visually-hidden">
          Quantity
        </label>
        <div class="jcf-number flex items-center ml-auto">
          <button
            class="jcf-btn-dec"
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
            onChange={(e) =>
              setInputValue(parseInt((e.target as HTMLInputElement).value))
            }
            onBlur={() => updateItem(inputValue)}
            min="0"
            aria-label={theme.cart.quantity}
          />
          <button
            class="jcf-btn-inc jcf-disabled"
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
