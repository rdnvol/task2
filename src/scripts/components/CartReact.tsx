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
        <div className="text-center">
          <div className="page-title-block">
            <h1 className="h2">{theme.cart.title}</h1>
          </div>

          <div className="supports-cookies">
            <p>{theme.cart.empty}</p>
            <p
              dangerouslySetInnerHTML={{
                __html: theme.cart.continue_browsing_html,
              }}
            />
          </div>

          <div className="supports-no-cookies">
            <p>{theme.cart.cookies}</p>
          </div>
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
    <div className="md:w-5/12 mb-4 md:mb-0">
      <label htmlFor="CartSpecialInstructions" className="visually-hidden">
        <strong>{theme.cart.note}</strong>
      </label>
      <textarea name="note" placeholder={theme.cart.special_instructions_placeholder} id="CartSpecialInstructions">
        {note}
      </textarea>
    </div>
  );

  const renderCart = () => (
    <div>
      <div className="page-title-block text-center">
        <h1 className="h2">{theme.cart.title}</h1>
      </div>

      <div className="md:flex">
        <div className="md:w-10/12 md:mx-auto">
          <form action="/cart" method="post" className="cart-form" noValidate>
            <table className="cart-table body-2 mb-8 md:mb-6">
              <thead className="small--hide">
                <tr>
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

            <div className="md:flex md:justify-between md:space-x-8">
              {ref.dataset.noteEnable === 'true' && renderNote()}
              <div className="md:w-5/12 md:ml-auto">
                <div className="cart-form__total mb-4">
                  <div className="title flex justify-between md:justify-end">
                    <div className="mr-2">{theme.cart.total}</div>
                    {formatMoney(total_price, theme.moneyFormat)}
                  </div>
                  <div className="cart-form__total__text-box body-3">
                    {renderDiscount()}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: theme.cart.shipping_at_checkout,
                      }}
                    />
                  </div>
                </div>
                <div className="md:text-right">
                  <input type="submit" className="mb-3 button" name="checkout" value={theme.cart.checkout} />
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
