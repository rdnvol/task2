import { FunctionComponent, h, render } from 'preact';
import { Provider } from 'react-redux';

import { cartSelector } from 'store/selectors';
import { useSelector } from 'store/hook';
import theme from 'helpers/themeSettings';

const CartCount: FunctionComponent = () => {
  const { item_count } = useSelector(cartSelector);

  const renderCount = () => <span className="header__cart-btn__num">{item_count}</span>;

  return (
    <a href="/cart" className="header__btn header__cart-btn">
      <div dangerouslySetInnerHTML={{ __html: theme.icons.cart }} />
      {item_count > 0 && renderCount()}
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
