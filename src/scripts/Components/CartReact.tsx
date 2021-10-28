import { h, FunctionComponent, render } from 'preact';
import { Provider } from 'react-redux';
import { formatMoney } from '@shopify/theme-currency/currency';

import { useSelector } from '../Components/hook';
import {cartSelector} from "../redux/selectors"
import theme from '../helpers/themeSettings';
import LineItem from './LineItem';

const Cart: FunctionComponent = () => {
  const cart = useSelector(cartSelector);
  const ref = document.getElementById('cart');

  const renderEmptyState = () => {
    return (
      <div className="row">
        <div className="col-md-8 mx-auto">
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
              ></p>
            </div>

            <div className="supports-no-cookies">
              <p>{theme.cart.cookies}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDiscount = () => {
    if (cart.cart.total_discount > 0)
      return (
        <p>
          {theme.cart.savings} {formatMoney(cart.cart.total_discount)}
        </p>
      );
  };

  const renderNote = () => {
    return (
      <div className="col-md-5 mb-4 mb-md-0">
        <label htmlFor="CartSpecialInstructions" className="visually-hidden">
          <strong>{theme.cart.note}</strong>
        </label>
        <textarea
          name="note"
          placeholder={theme.cart.special_instructions_placeholder}
          id="CartSpecialInstructions"
        >
          {cart.cart?.note}
        </textarea>
      </div>
    );
  };

  const renderCart = () => {
    return (
      <div>
        <div className="page-title-block text-center">
          <h1 className="h2">{theme.cart.title}</h1>
        </div>

        <div className="row">
          <div className="col-md-10 mx-md-auto">
            <form action="/cart" method="post" className="cart-form" noValidate>
              <table className="cart-table body-2 mb-8 mb-md-6">
                <thead className="small--hide">
                  <tr>
                    <th>{theme.cart.product}</th>
                    <th>{theme.cart.price}</th>
                    <th>{theme.cart.quantity}</th>
                    <th>{theme.cart.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cart.items.map((item) => (
                    <LineItem item={item} />
                  ))}
                </tbody>
              </table>

              <div className="row justify-content-md-between">
                {ref.dataset.noteEnable === 'true' ? renderNote() : ''}
                <div className="col-md-5 ml-auto">
                  <div className="cart-form__total mb-4">
                    <div className="title-1 d-flex justify-content-between justify-content-md-end">
                      <div className="mr-2">{theme.cart.total}</div>
                      {formatMoney(cart.cart.total_price, theme.moneyFormat)}
                    </div>
                    <div className="cart-form__total__text-box body-3">
                      {renderDiscount()}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: theme.cart.shipping_at_checkout,
                        }}
                      ></p>
                    </div>
                  </div>
                  <div className="text-md-right">
                    <input
                      type="submit"
                      className="mb-3 button"
                      name="checkout"
                      value={theme.cart.checkout}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {cart.cart && cart.items.length ? renderCart() : renderEmptyState()}
    </div>
  );
};

export default Cart;

const cartElement = document.getElementById('cart');

if (cartElement) {
  render(
    <Provider store={window.Store}>
      <Cart
        ref={(element) => {
          window.cart = element;
        }}
      />
    </Provider>,
    cartElement
  );
}
