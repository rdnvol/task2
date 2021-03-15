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
              <h1 className="h2">{ theme.cart.title }</h1>
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
      <div className="col-md-5 mb-4 mb-md-0">
        <label htmlFor="CartSpecialInstructions" className="visually-hidden">
          <strong>
            { theme.cart.note }
          </strong>
        </label>
        <textarea name="note" placeholder="Special instructions for seller" id="CartSpecialInstructions">{ this.state.cart?.note }</textarea>
      </div>
    )
  }
  
  renderCart() {
    console.log(this.props.cart)
    return (
        <div>
          <div className="page-title-block text-center">
            <h1 className="h2">{ theme.cart.title }</h1>
          </div>

          <div className="row">
            <div className="col-md-10 mx-md-auto">

              <form action="/cart" method="post" className="cart-form" noValidate>

                <table className="cart-table body-2 mb-8 mb-md-6">
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

                <div className="row justify-content-md-between">
                  { this.ref.dataset.noteEnable === 'true' ? this.renderNote() : '' }
                  <div className="col-md-5 ml-auto">
                    <div className="cart-form__total mb-4">
                      <div className="title-1 d-flex justify-content-between justify-content-md-end">
                          <div className="mr-2">
                            { theme.cart.total }
                          </div>
                          { formatMoney(this.props.cart.total_price, theme.moneyFormat) }
                      </div>
                      <div className="cart-form__total__text-box body-3">
                        { this.renderDiscount() }
                        <p dangerouslySetInnerHTML={ {__html: theme.cart.shipping_at_checkout} }></p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-lg-6 d-md-flex align-items-start justify-content-md-end mb-3 mb-lg-0">
                        <button type="button" className="button button--secondary w-100">
                          Update
                        </button>
                      </div>
                      <div className="col-12 col-lg-6 d-md-flex align-items-start justify-content-md-end">
                        <input type="submit" className="mb-3 w-100 button" name="checkout" value={ theme.cart.checkout }/>
                      </div>
                    </div>
                  </div>
                </div>

              </form>

            </div>
          </div>
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
