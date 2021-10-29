import { h, Component, render } from 'preact';
import { Connect, Provider } from 'redux-zero/preact';
import theme from '../helpers/themeSettings';
import actions from './actions';

interface Props {
  cart: {};
  getCart: () => {};
  item_count: number;
}

class CartCount extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.cart !== {}) {
      this.props.getCart();
    }
  }

  renderCount() {
    return (
      <span className="header__cart-btn__num">{this.props.item_count}</span>
    );
  }

  render({ item_count }: Props) {
    return (
      <a href="/cart" className="header__btn header__cart-btn">
        <div dangerouslySetInnerHTML={{__html: theme.icons.cart}}/>
        {item_count > 0 ? this.renderCount() : ''}
      </a>
    );
  }
}
const ref = document.querySelector('[data-cart-count]');
if (ref) {
  render(
    //@ts-ignore
    <Provider store={window.Store}>
      <Connect actions={actions}>
        {({ item_count, cart, getCart }: any) => (
          <CartCount item_count={item_count} cart={cart} getCart={getCart} />
        )}
      </Connect>
    </Provider>,
    ref,
    ref.querySelector('a')
  );
}
