import { h, Fragment, FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { getId } from 'helpers/utils';

import { CartItem } from 'types';
import theme from 'helpers/themeSettings';

import { useHandleQuantity } from 'hooks/useHandleQuantity';
import { Image } from '../Image';
import { DrawerLineItemDiscount } from './DrawerLineItemDiscount';

interface PropsType {
  item?: CartItem;
}

const LineItem: FunctionComponent<PropsType> = ({ item }) => {
  const { inputValue, setInputValue, handleChange, handleUpdateItem, removeItem, changeQuantity, decreaseQuantity } =
    useHandleQuantity(item);

  const mobileQuantityInputRef = useRef<HTMLInputElement>();

  const renderImage = ({ featured_image, url, product_title }) =>
    featured_image.url && (
      <div className="cart-drawer__item-img mr-5 shrink-0">
        <a
          href={url}
          className="block"
          aria-label={product_title}
        >
          <Image
            src={featured_image.url}
            sizes={['64x82', '90x112', '90x112']}
            ratio={featured_image.aspect_ratio}
            alt={featured_image.alt}
            // @ts-ignore
            fetchpriority="high"
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
          <div
            key={getId()}
            className="body-small"
          >
            <span className="base-secondary-text">{key}:</span>
            {properties[key]}
          </div>
        )
    );
  };

  const renderPrice = ({ original_price, price, final_price }) => {
    if (original_price !== final_price) {
      return (
        <div className="product-price-small base-secondary-text">
          <del>{formatMoney(original_price, theme.moneyFormat)}</del>
          <ins>{formatMoney(final_price, theme.moneyFormat)}</ins>
        </div>
      );
    }

    return (
      <div className="product-price-small base-secondary-text">
        <div>{formatMoney(price, theme.moneyFormat)}</div>
      </div>
    );
  };

  const renderTotalPrice = ({ final_line_price, original_line_price }) => {
    const finalPrice = <ins>{formatMoney(final_line_price, theme.moneyFormat)}</ins>;

    if (original_line_price !== final_line_price) {
      return (
        <Fragment>
          <del>{formatMoney(original_line_price, theme.moneyFormat)}</del>
          {finalPrice}
        </Fragment>
      );
    }

    return <div>{formatMoney(final_line_price, theme.moneyFormat)}</div>;
  };

  const renderUnitPrice = ({ unit_price, unit_price_measurement }: CartItem) => {
    if (unit_price) {
      const unitPrice = formatMoney(unit_price, theme.moneyFormat);

      const referenceUnit =
        unit_price_measurement.reference_value !== 1
          ? `${unit_price_measurement.reference_value} ${unit_price_measurement.reference_unit}`
          : unit_price_measurement.reference_unit;

      return (
        <div className="product-price-small">
          {unitPrice} / {referenceUnit}
        </div>
      );
    }
  };

  const renderItemOptions = ({ options_with_values, product_has_only_default_variant }) => {
    if (!product_has_only_default_variant) {
      return options_with_values.map((option) => (
        <div
          className="body-small"
          key={`${option.name}-${option.value}`}
        >
          <span className="base-secondary-text">{option.name}:</span>
          {option.value}
        </div>
      ));
    }
  };

  return (
    <div className="cart-drawer__item flex py-3">
      {renderImage(item)}

      <div>
        <div className="body-small">{item.vendor}</div>
        <div className="flex justify-between">
          <div>
            <div className="title mb-2">
              <a
                href={item.url}
                className="inline-block align-top no-underline hover:opacity-90"
              >
                {item.product_title}
              </a>
            </div>
            <div className="mb-2">
              {renderPrice(item)}
              {renderUnitPrice(item)}
              {renderItemOptions(item)}
              {renderProperties(item.properties)}
            </div>
          </div>
          <div className="cart-drawer__price-box product-price-large base-secondary-text shrink-0 text-right">
            {renderTotalPrice(item)}
          </div>
        </div>
        <div className="base-secondary-text body-small mb-2 flex items-center">
          {item.line_level_discount_allocations.length > 0 &&
            item.line_level_discount_allocations.map(({ discount_application }) => (
              <DrawerLineItemDiscount
                key={discount_application.key}
                title={discount_application.title}
              />
            ))}
        </div>
        <div className="flex items-center justify-between space-x-8">
          <div>
            <label
              htmlFor="quantity-1"
              className="visually-hidden"
            >
              Qty
            </label>
            <div className="jcf-number jcf-number--full-width flex w-100 items-center">
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
                className="w-100"
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
          <div className="text-right">
            <button
              className="default button-small"
              onClick={removeItem}
            >
              {theme.cart.remove}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItem;
