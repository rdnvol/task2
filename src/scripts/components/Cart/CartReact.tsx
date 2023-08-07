import { h, FunctionComponent, render } from 'preact';
import { Provider } from 'react-redux';
import { formatMoney } from '@shopify/theme-currency/currency';

import { useSelector } from 'store/hook';
import { cartSelector } from 'store/selectors';
import theme from 'helpers/themeSettings';

import { CartDiscountBlock } from 'components/Cart/CartDiscountBlock';
import LineItem from './LineItem';

const Cart: FunctionComponent = () => {
  const {
    cart: { total_discount, note, items, total_price, cart_level_discount_applications },
  } = useSelector(cartSelector);

  const ref = document.getElementById('cart');

  const renderEmptyState = () => (
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
  );

  const renderDiscount = () => {
    if (total_discount > 0) {
      return (
        <div>
          {theme.cart.savings} {formatMoney(total_discount)}
        </div>
      );
    }
  };

  const renderNote = () => (
    <div className="mb-10 md:mb-0 md:w-5/12 md:px-5">
      <label
        className="mb-1 inline-block"
        htmlFor="CartSpecialInstructions"
      >
        {theme.cart.note}
      </label>
      <textarea
        name="note"
        placeholder={theme.cart.special_instructions_placeholder}
        id="CartSpecialInstructions"
      >
        {note}
      </textarea>
    </div>
  );

  const renderCart = () => (
    <div>
      <div className="mb-10 text-center">
        <h1 className="h5 mb-4 md:mb-2">{theme.cart.title}</h1>
      </div>

      <div className="lg:flex">
        <div className="lg:mx-auto lg:w-10/12">
          <form
            action="/cart"
            method="post"
            className="cart-form"
            noValidate
          >
            <table className="cart-table mb-5 md:mb-10">
              <thead className="small--hide">
                <tr className="base-secondary-text">
                  <th>{theme.cart.product}</th>
                  <th>{theme.cart.price}</th>
                  <th>{theme.cart.quantity}</th>
                  <th>{theme.cart.total}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <LineItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </tbody>
            </table>

            <div className="md:flex md:justify-between md:space-x-8 md:py-5">
              {ref.dataset.noteEnable === 'true' && renderNote()}
              <div className="md:ml-auto md:w-5/12">
                <div className="mb-3 md:text-right">
                  <div className="mb-3 flex items-center justify-between md:mb-2 md:justify-end">
                    <div className="mr-8">{theme.cart.total}:</div>
                    <div className="product-price-large">{formatMoney(total_price, theme.moneyFormat)}</div>
                  </div>
                  <div className="body-small base-secondary-text text-center md:text-right">
                    {cart_level_discount_applications.length > 0 && (
                      <div className="base-secondary-text mb-2">
                        <ul className="inline-block">
                          {cart_level_discount_applications.map((discount) => (
                            <CartDiscountBlock
                              key={discount.key}
                              title={discount.title}
                            />
                          ))}
                        </ul>
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{
                        __html: theme.cart.shipping_at_checkout,
                      }}
                    />
                  </div>
                </div>
                <div className="md:text-right">
                  <input
                    type="submit"
                    className="button w-100 md:w-auto"
                    name="checkout"
                    value={theme.cart.checkout}
                  />
                </div>
                {theme.cart.additional_checkout_buttons && (
                  <div
                    className="cart__dynamic-checkout-buttons additional-checkout-buttons"
                    dangerouslySetInnerHTML={{
                      __html: theme.cart.content_for_additional_checkout_buttons,
                    }}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return <div className="container">{items?.length ? renderCart() : renderEmptyState()}</div>;
};

export default Cart;

const cartElement = document.getElementById('cart');

if (cartElement) {
  /* eslint-disable */
  render(
    <Provider store={window.Store}>
      <Cart ref={(element) => (window.cart = element)} />
    </Provider>,
    cartElement
  );
  /* eslint-enable */
}
