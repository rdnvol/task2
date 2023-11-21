import { h, Fragment, FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { getId } from 'helpers/utils';

import { CartItem } from 'types';
import theme from 'helpers/themeSettings';

import { LineItemDiscountBlock } from 'components/Cart/LineItemDiscountBlock';
import { useHandleQuantity } from 'hooks/useHandleQuantity';
import { Image } from '../Image';

interface PropsType {
  item?: CartItem;
}

const LineItem: FunctionComponent<PropsType> = ({ item }) => {
  const { inputValue, setInputValue, handleChange, handleUpdateItem, removeItem, changeQuantity, decreaseQuantity } =
    useHandleQuantity(item);

  const mobileQuantityInputRef = useRef<HTMLInputElement>();
  const quantityInputRef = useRef<HTMLInputElement>();

  const renderImage = ({ featured_image, url, product_title }) =>
    featured_image.url && (
      <div className="cart__product-img mr-5">
        <a
          href={url}
          aria-label={product_title}
        >
          <Image
            src={featured_image.url}
            sizes={['64x82', '90x112', '90x112']}
            ratio={featured_image.aspect_ratio}
            alt={featured_image.alt}
          />
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
          <del className="base-secondary-text">{formatMoney(original_price, theme.moneyFormat)}</del>
          <ins>{formatMoney(final_price, theme.moneyFormat)}</ins>
        </Fragment>
      );
    }

    return <div>{formatMoney(price, theme.moneyFormat)}</div>;
  };

  const renderTotalPrice = ({ final_line_price, original_line_price }) => {
    const finalPrice = (
      <div className="product-price-large">
        <ins>{formatMoney(final_line_price, theme.moneyFormat)}</ins>
      </div>
    );

    if (original_line_price !== final_line_price) {
      return (
        <Fragment>
          <div className="product-price-large base-secondary-text">
            <del>{formatMoney(original_line_price, theme.moneyFormat)}</del>
          </div>
          {finalPrice}
        </Fragment>
      );
    }

    return finalPrice;
  };

  const renderUnitPrice = ({ unit_price, unit_price_measurement }: CartItem) => {
    if (unit_price) {
      const unitPrice = formatMoney(unit_price, theme.moneyFormat);

      const referenceUnit =
        unit_price_measurement.reference_value !== 1
          ? `${unit_price_measurement.reference_value} ${unit_price_measurement.reference_unit}`
          : unit_price_measurement.reference_unit;

      return (
        <div className="product-price-small pt-2 md:pt-0">
          {unitPrice} / {referenceUnit}
        </div>
      );
    }
  };

  const renderItemOptions = ({ options_with_values, product_has_only_default_variant }) => {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div
          className="mb-1"
          key={`${option.name}-${option.value}`}
        >
          <span className="base-secondary-text mr-1 inline-block">{option.name}:</span>
          {option.value}
        </div>
      ));
    }
  };

  return (
    <tr className="responsive-table-row">
      <td>
        <div className="flex md:items-center">
          {renderImage(item)}
          <div className="cart__product-text">
            <div className="base-secondary-text body-small mb-1">{item.vendor}</div>
            <div className="title mb-2">
              <a
                href={item.url}
                className="no-underline hover:underline"
              >
                {item.product_title}
              </a>
            </div>
            <div className="mb-3 md:hidden">
              <label
                htmlFor={`updates_mobile_${item.key}`}
                className="visually-hidden"
              >
                Qty
              </label>
              <div className="jcf-number flex items-center">
                <button
                  className="jcf-btn-dec"
                  type="button"
                  onMouseDown={decreaseQuantity}
                  onMouseUp={changeQuantity}
                >
                  <span className="visually-hidden">Decrease quantity</span>
                </button>
                <input
                  type="number"
                  name="updates[]"
                  ref={mobileQuantityInputRef}
                  id={`updates_mobile_${item.key}`}
                  value={inputValue}
                  onChange={handleChange}
                  onBlur={handleUpdateItem}
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
            <div className="body-small">
              {renderItemOptions(item)}
              {renderProperties(item.properties)}
            </div>
            <div className="body-small base-secondary-text mb-2">
              <ul>
                {item.line_level_discount_allocations.length > 0 &&
                  item.line_level_discount_allocations.map(({ discount_application }) => (
                    <LineItemDiscountBlock
                      key={discount_application.key}
                      title={discount_application.title}
                    />
                  ))}
              </ul>
            </div>
            <a
              className="body-small no-underline hover:underline"
              href="/cart/change?line={{ forloop.index }}&amp;quantity=0"
              onClick={removeItem}
            >
              {theme.cart.remove}
            </a>
          </div>
        </div>
      </td>
      <td>
        <div className="product__price__box product-price-large">{renderPrice(item)}</div>
        {renderUnitPrice(item)}
      </td>
      <td>
        <label
          htmlFor={`updates_${item.key}`}
          className="visually-hidden"
        >
          Quantity
        </label>
        <div className="jcf-number ml-auto flex items-center">
          <button
            className="jcf-btn-dec"
            type="button"
            onMouseDown={decreaseQuantity}
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
            onChange={handleChange}
            onBlur={handleUpdateItem}
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
      <td>{renderTotalPrice(item)}</td>
    </tr>
  );
};

export default LineItem;
