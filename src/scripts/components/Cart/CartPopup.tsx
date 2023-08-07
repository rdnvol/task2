import { trapFocus as trapFocusShopify, removeTrapFocus } from '@shopify/theme-a11y';
import { h, render, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { Provider } from 'react-redux';

import { useSelector, useDispatch } from 'store/hook';
import { cartSelector } from 'store/selectors';
import { closePopup } from 'store/features/cart/cartSlice';
import theme from 'helpers/themeSettings';
import CartJustAdded from './CartJustAdded';

const CartPopup: FunctionComponent = () => {
  const dispatch = useDispatch();
  const cart = useSelector(cartSelector);
  const cartRef = useRef<HTMLDivElement>();

  const trapFocus = () => {
    trapFocusShopify(cartRef.current);
  };

  const initCloseEvent = (e) => {
    if (!e.target.closest(`.${cartRef.current.className}`)) {
      dispatch(closePopup());
    }
  };

  useEffect(() => {
    document.querySelector('body').addEventListener('click', (e) => initCloseEvent(e));
  }, []);

  useEffect(() => {
    if (cart.popupActive && cartRef.current) {
      trapFocus();
    }

    return () => {
      removeTrapFocus();
    };
  }, [cart.popupActive, cartRef]);

  return (
    <div
      ref={cartRef}
      className={`cart-popup text-black ${cart.popupActive ? 'active' : ''}`}
    >
      <div className="cart-popup__header flex items-center justify-between">
        <div className="cart-popup__heading flex-grow">{theme.cart.just_added_to_your_cart}</div>
        <div>
          <button
            className="cart-popup__close default"
            onClick={() => dispatch(closePopup())}
          >
            <span className="visually-hidden">Close cart popup</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="icon"
              viewBox="0 0 20 20"
            >
              <path d="M15.89 14.696l-4.734-4.734 4.717-4.717c.4-.4.37-1.085-.03-1.485s-1.085-.43-1.485-.03L9.641 8.447 4.97 3.776c-.4-.4-1.085-.37-1.485.03s-.43 1.085-.03 1.485l4.671 4.671-4.688 4.688c-.4.4-.37 1.085.03 1.485s1.085.43 1.485.03l4.688-4.687 4.734 4.734c.4.4 1.085.37 1.485-.03s.43-1.085.03-1.485z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="cart-popup__holder">
        <div className="cart-popup__item py-3">{cart.justAdded.id && <CartJustAdded justAdded={cart.justAdded} />}</div>
        <div className="text-center">
          <a
            href="/cart"
            className="button w-100"
          >
            {theme.cart.view_cart} <span>({cart.item_count})</span>
          </a>
          <div
            className="pt-2"
            dangerouslySetInnerHTML={{
              __html: theme.cart.continue_shopping_html.replace('<a', '<a class="link"'),
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ref = document.querySelector('#cart-popup');

if (ref) {
  render(
    <Provider store={window.Store}>
      <CartPopup />
    </Provider>,
    ref
  );
}
