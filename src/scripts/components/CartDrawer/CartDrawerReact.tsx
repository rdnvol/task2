import { h, FunctionComponent, render, Fragment } from 'preact';
import { Provider } from 'react-redux';
import { formatMoney } from '@shopify/theme-currency/currency';

import { useSelector } from 'store/hook';
import { cartSelector } from 'store/selectors';
import theme from 'helpers/themeSettings';
import { Discount } from 'components/icons/Discount';
import DrawerLineItem from './DrawerLineItem';
import DrawerRecommendationsItem from './DrawerRecommendationsItem';
import { DrawerFreeShippingBar } from './DrawerFreeShippingBar';
import { CartDiscountBlock } from './DrawerDiscountBlock';
import { CartRecommendations } from './CartRecommendations';

const CartDrawer: FunctionComponent = () => {
  const {
    cart: { total_discount, note, items, total_price, cart_level_discount_applications, item_count },
  } = useSelector(cartSelector);

  const freeShippingThreshold = Math.max(theme.cart.cartTargetPrice - total_price, 0);

  const renderEmptyState = () => (
    <div className="flex-1 overflow-auto px-4">
      <div className="md:flex">
        <div className="md:mx-auto md:w-8/12">
          <div className="py-24 text-center">
            <div className="mb-4">
              <h1 className="h5">{theme.cart.title}</h1>
            </div>

            <div className="supports-cookies rte mb-5">
              <p>{theme.cart.empty}</p>
            </div>

            <div
              className="mb-5"
              dangerouslySetInnerHTML={{
                __html: theme.cart.continue_shopping_html.replace('<a', '<a class="button"'),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCart = () => (
    <Fragment>
      <div className="flex-1 overflow-auto px-4">
        <form
          action="#"
          className="cart-drawer__content pb-4"
        >
          {items.map((item) => (
            <DrawerLineItem
              key={item.id}
              item={item}
            />
          ))}
        </form>
        {theme.cart.cartEnableRecommendations && <CartRecommendations />}
      </div>

      <div className="cart-drawer__footer px-4 py-5">
        <div className="mb-3 flex items-center justify-between">
          <div>{theme.cart.subtotal}:</div>
          <div className="product-price-large">{formatMoney(total_price, theme.moneyFormat)}</div>
        </div>
        {cart_level_discount_applications.length > 0 &&
          cart_level_discount_applications.map((discount) => (
            <CartDiscountBlock
              key={discount.key}
              title={discount.title}
            />
          ))}
        {total_discount > 0 && (
          <div className="body-small base-secondary-text mb-2 flex justify-between">
            <div className="item-center flex">
              <div className="cart-drawer__discount base-body-text mr-1 shrink-0">
                <Discount />
              </div>
              <div>{theme.cart.savings}</div>
            </div>
            <div>{formatMoney(total_discount, theme.moneyFormat)}</div>
          </div>
        )}
        {theme.cart.CartTaxesInclude && (
          <div className="base-secondary-text body-small mb-3">{theme.cart.tax_include_text}</div>
        )}
        <a
          href="/checkout"
          className="button w-100"
        >
          {theme.cart.checkout}
        </a>
        <a
          href="/collections"
          className="link block py-2 text-center"
        >
          {theme.cart.cart_drawer_continue_shopping_btn}
        </a>
      </div>
    </Fragment>
  );

  return (
    <div className="cart-drawer__wrapper">
      <div className="cart-drawer__header">
        <div className="cart-drawer__header-holder relative px-4 py-3">
          <div className="pr-10">
            {theme.cart.cart_drawer_lable} ({item_count})
          </div>
          <button
            type="button"
            className="btn-closer cart-drawer-closer"
            aria-label="Close cart drawer"
          />
        </div>
        <DrawerFreeShippingBar threshold={freeShippingThreshold} />
      </div>

      {items?.length ? renderCart() : renderEmptyState()}
    </div>
  );
};

export default CartDrawer;

const cartDrawerElement = document.getElementById('cart-drawer');

if (cartDrawerElement) {
  /* eslint-disable */
  render(
    <Provider store={window.Store}>
      <CartDrawer ref={(element) => (window.cart = element)} />
    </Provider>,
    cartDrawerElement
  );
  /* eslint-enable */
}
