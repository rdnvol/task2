import { h, Component, render } from "preact";
import { Connect, Provider } from "redux-zero/preact";
import store from "./store";
import actions from "./actions";

import { formatMoney } from "@shopify/theme-currency/currency";
import * as cart from '@shopify/theme-cart';

import LineItem from "./LineItem";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {cart: {}, items: []}
    this.ref = document.getElementById('cart');
  }
  
  
  renderEmptyState() {
    return (
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="text-center">
            <div className="page-title-block">
              <h1>{ theme.cart.title }</h1>
            </div>
            
            <div className="supports-cookies">
              <p>{ theme.cart.empty }</p>
              <p dangerouslySetInnerHTML={ {__html: theme.cart.continue_browsing_html} }></p>
            </div>
            
            <div className="supports-no-cookies">
              <p>{ theme.cart.cookies }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  renderDiscount() {
    if (this.state.cart.total_discounts > 0)
      return (
        <p>{ theme.cart.savings } { formatMoney(this.state.cart.total_discount) }</p>
      )
  }
  
  renderNote() {
    return (
      <div className="col-md-5 col-lg-4 px-0 mb-4 mb-md-0">
        <label htmlFor="CartSpecialInstructions" className="d-inline-block mb-2">
          <strong>
            { theme.cart.note }
          </strong>
        </label>
        <textarea name="note" id="CartSpecialInstructions">{ this.state.cart?.note }</textarea>
      </div>
    )
  }
  
  renderCart() {
    console.log(this.props.cart)
    return (
        <div>
          <div className="page-title-block text-center">
            <h1>{ theme.cart.title }</h1>
          </div>
    
          <form action="/cart" method="post" className="cart-form" noValidate>
            <table className="cart-table mb-4">
              <thead className="small--hide">
              <tr>
                <th>{ theme.cart.product }</th>
                <th>{ theme.cart.price }</th>
                <th>{ theme.cart.quantity }</th>
                <th>{ theme.cart.total }</th>
              </tr>
              </thead>
              <tbody>
              { this.props.items.map(item =>
                <LineItem
                  item={ item }
                  key={ item.key }
                  updateCart={ this.props.getCart }
                  removeItem={ this.props.removeItem }
                  updateItem={ this.props.updateItem }/>
              ) }
              </tbody>
            </table>
      
            <div className="d-md-flex justify-content-between">
              { this.ref.dataset.noteEnable === 'true' ? this.renderNote() : '' }
              <div className="col-md-5 col-lg-4 px-0 ml-auto">
                <div className="cart-form__total mb-4">
                  <div className="row">
                    <div className="col-8">
                      <p>{ theme.cart.total }</p>
                    </div>
                    <div className="col-4">
                      <p>{ formatMoney(this.props.cart.total_price, theme.moneyFormat) }</p>
                    </div>
                  </div>
                  <div class="cart-form__total__text-box">
                    { this.renderDiscount() }
                    <p dangerouslySetInnerHTML={ {__html: theme.cart.shipping_at_checkout} }></p>
                  </div>
                </div>
                <input type="submit" className="mb-3 button" name="checkout" value={ theme.cart.checkout }/>
              </div>
            </div>
          </form>
        </div>
    )
  }
  
  render({items, cart}) {
    return (
      <div className="container">
        { cart && items.length ? this.renderCart() : this.renderEmptyState() }
      </div>
    )
  }
}


export default Cart;
const cartElement = document.getElementById('cart')
if (cartElement) {
  render(
    <Provider store={store}>
      <Connect actions={actions}>
        {(props) => (
          <Cart {...props} ref={ (element) => {window.cart = element} }/>
        )}
      </Connect>
    </Provider>, cartElement);
}
