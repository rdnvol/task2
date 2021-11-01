import { h, render, FunctionComponent } from 'preact';
import { Provider } from 'react-redux';
import theme from '../helpers/themeSettings';
import { cartSelector } from '../redux/selectors';
import { useAppSelector } from '../Components/hook';

const CartCount: FunctionComponent = () => {
  const cart = useAppSelector(cartSelector);

  const renderCount = () => {
    return (
      <span className="header__cart-btn__num">{cart.cart.item_count}</span>
    );
  };
  return (
    <a href="/cart" className="header__btn header__cart-btn">
      <div dangerouslySetInnerHTML={{ __html: theme.icons.cart }} />
      {cart.cart.item_count > 0 ? renderCount() : ''}
    </a>
  );
};

const ref = document.querySelector('[data-cart-count]');
if (ref) {
  render(
    <Provider store={window.Store}>
      <CartCount />
    </Provider>,
    ref,
    ref.querySelector('a')
  );
}
