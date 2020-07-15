import * as cart from "@shopify/theme-cart";

const actions = ({ setState }) => ({
  getCart() {
    return cart.getState()
      .then(cart => ({ cart, items: cart.items, loading: false, item_count: cart.item_count }))
      .catch(error => ({ error, loading: false }));
  },
  removeItem(state, key) {
    cart.removeItem(key)
      .then(cart => setState({cart, items: cart.items, item_count: cart.item_count, loading: false}))
      .catch(error => ({ error, loading: false }));
  },
  updateItem(state, key, options) {
    cart.updateItem(key, options)
      .then(cart => setState({cart, items: cart.items, item_count: cart.item_count, loading: false}))
      .catch(error => ({ error, loading: false }));
  },
  closePopup() {
    setState({popupActive: false})
  }
});

export default actions;

