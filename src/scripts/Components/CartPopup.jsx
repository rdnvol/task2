import { trapFocus } from '@shopify/theme-a11y';
import { h, Component, render } from 'preact';
import CartJustAdded from './CartJustAdded';
import { Connect, Provider } from 'redux-zero/preact';
import store from './store';
import actions from './actions';

class CartPopup extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document
      .querySelector('body')
      .addEventListener('click', (e) => this.initCloseEvent(e));
  }

  componentWillReceiveProps({ active }, nextContext) {
    if (active) {
      this.trapFocus(active);
    }
  }

  trapFocus(active) {
    trapFocus(this.base);
  }

  initCloseEvent(e) {
    if (!e.target.closest(`.${this.base.className}`)) {
      this.props.closePopup();
    }
  }

  render({ justAdded, item_count, closePopup, active }) {
    return (
      <div className={`cart-popup text-black ${active ? 'active' : ''}`}>
        <div className="cart-popup__header">
          <div className="cart-popup__heading">
            {theme.cart.just_added_to_your_cart}
          </div>
          <div>
            <button className="cart-popup__close default" onClick={closePopup}>
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
          <div className="cart-popup__item">
            {justAdded.id && <CartJustAdded justAdded={justAdded} />}
          </div>
          <div className="text-center">
            <a href="/cart" className="button w-100">
              {theme.cart.view_cart} <span>({item_count})</span>
            </a>
            <div
              className="pt-2"
              dangerouslySetInnerHTML={{
                __html: theme.cart.continue_shipping_html,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

let ref = document.querySelector('#cart-popup');
if (ref) {
  render(
    <Provider store={store}>
      <Connect actions={actions}>
        {({ justAdded, item_count, popupActive, closePopup }) => (
          <CartPopup
            item_count={item_count}
            justAdded={justAdded}
            active={popupActive}
            closePopup={closePopup}
          />
        )}
      </Connect>
    </Provider>,
    ref
  );
}
