import { h, FunctionComponent, render } from 'preact';
import { Provider } from 'react-redux';
import { formatMoney } from '@shopify/theme-currency/currency';

import { useSelector } from 'store/hook';
import { cartSelector } from 'store/selectors';
import theme from 'helpers/themeSettings';

import LineItem from './LineItem';

const Cart: FunctionComponent = () => {
  const {
    cart: { total_discount, note, items, total_price },
  } = useSelector(cartSelector);

  const ref = document.getElementById('cart');

  const renderEmptyState = () => (
    <div className="md:flex">
      <div className="md:w-8/12 md:mx-auto">
        <div className="text-center py-24">
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
        <p>
          {theme.cart.savings} {formatMoney(total_discount)}
        </p>
      );
    }
  };

  const renderNote = () => (
    <div className="md:w-5/12 mb-10 md:mb-0 md:px-5">
      <label className="inline-block mb-1" htmlFor="CartSpecialInstructions">
        {theme.cart.note}
      </label>
      <textarea name="note" placeholder={theme.cart.special_instructions_placeholder} id="CartSpecialInstructions">
        {note}
      </textarea>
    </div>
  );

  const renderCart = () => (
    <div>
      <div className="text-center mb-10">
        <h1 className="h5 mb-4 md:mb-2">{theme.cart.title}</h1>
      </div>

      <div className="lg:flex">
        <div className="lg:w-10/12 lg:mx-auto">
          <form action="/cart" method="post" className="cart-form" noValidate>
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
                  <LineItem key={item.id} item={item} />
                ))}
              </tbody>
            </table>

            <div className="md:flex md:justify-between md:space-x-8 md:py-5">
              {ref.dataset.noteEnable === 'true' && renderNote()}
              <div className="md:w-5/12 md:ml-auto">
                <div className="md:text-right mb-3">
                  <div className="flex justify-between md:justify-end mb-3">
                    <div className="mr-8">{theme.cart.total}:</div>
                    {formatMoney(total_price, theme.moneyFormat)}
                  </div>
                  <div className="base-secondary-text body-small text-center md:text-right">
                    {renderDiscount()}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: theme.cart.shipping_at_checkout,
                      }}
                    />
                  </div>
                </div>
                <div className="md:text-right">
                  <input type="submit" className="button w-100 md:w-auto" name="checkout" value={theme.cart.checkout} />
                </div>
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
