import { h, Component, render } from "preact";
import { Connect, Provider } from "redux-zero/preact";
import store from "./store";
import actions from "./actions";

class CartCount extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    if (this.props.cart !== {}) {
      this.props.getCart();
    }
  }
  
  renderCount() {
    return (
      <span className="header__cart-btn__num">
        { this.props.item_count }
      </span>
    )
  }
  
  render({item_count}) {
    return (
      <a href="/cart" className="header__btn header__cart-btn">
        <svg className="icon icon--cart" role="img" aria-label="Icon Cart" width="17" height="17" viewBox="0 0 17 17"
             fill="none" xmlns="http://www.w3.org/2000/svg">
          <desc>Icon Cart</desc>
          <path
            d="M14.4492 15.2992C13.9817 15.2992 13.5993 14.9167 13.5993 14.4492C13.5993 13.9817 13.9817 13.5993 14.4492 13.5993C14.9167 13.5993 15.2992 13.9817 15.2992 14.4492C15.2992 14.9167 14.9167 15.2992 14.4492 15.2992ZM3.39981 14.4492C3.39981 14.9167 3.01733 15.2992 2.54986 15.2992C2.08239 15.2992 1.69991 14.9167 1.69991 14.4492C1.69991 13.9817 2.08239 13.5993 2.54986 13.5993C3.01733 13.5993 3.39981 13.9817 3.39981 14.4492ZM15.0153 4.96373L13.8372 8.49953H3.39981V3.51286L15.0153 4.96373ZM14.4492 11.8993H3.39981V10.1994H14.4492C14.8147 10.1994 15.1394 9.9657 15.2567 9.61807L16.9566 4.51835C16.9963 4.39899 17.009 4.27231 16.9938 4.14745C16.9786 4.02258 16.9359 3.90265 16.8687 3.79629C16.8015 3.68994 16.7116 3.59982 16.6054 3.53243C16.4992 3.46504 16.3793 3.42207 16.2545 3.40661L3.39981 1.8002V0.849953C3.39981 0.624532 3.31026 0.408343 3.15087 0.248946C2.99147 0.0895484 2.77528 0 2.54986 0L0.849953 0C0.624532 0 0.408343 0.0895484 0.248946 0.248946C0.0895484 0.408343 0 0.624532 0 0.849953C0 1.07537 0.0895484 1.29156 0.248946 1.45096C0.408343 1.61036 0.624532 1.69991 0.849953 1.69991H1.69991V12.0557C1.20426 12.2306 0.774821 12.5545 0.470484 12.983C0.166147 13.4115 0.00180829 13.9236 0 14.4492C0 15.855 1.14404 16.9991 2.54986 16.9991C3.95568 16.9991 5.09972 15.855 5.09972 14.4492C5.09972 14.1492 5.03852 13.8661 4.94333 13.5993H12.0557C11.955 13.8714 11.9021 14.159 11.8993 14.4492C11.8993 15.855 13.0434 16.9991 14.4492 16.9991C15.855 16.9991 16.9991 15.855 16.9991 14.4492C16.9991 13.0434 15.855 11.8993 14.4492 11.8993Z"
            fill="currentColor"/>
        </svg>
        { item_count > 0 ? this.renderCount() : '' }
      </a>
    )
  }
}
const ref = document.querySelector('[data-cart-count]');
if (ref) {
  render(
    <Provider store={ store }>
      <Connect actions={ actions }>
        { ({item_count, cart, getCart}) => (
          <CartCount item_count={ item_count } cart={cart} getCart={getCart}/>
        ) }
      </Connect>
    </Provider>, ref
  )
}
