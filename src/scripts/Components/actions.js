import * as cart from "@shopify/theme-cart";

const actions = ({ setState }) => ({
  getCart() {
    // setState({ loading: true });
    return cart.getState()
      .then(cart => ({ cart, items: cart.items, loading: false, item_count: cart.item_count }))
      .catch(error => ({ error, loading: false }));
  },
  removeItem(state, key) {
    console.log(key)
    console.log('key', key)
    // setState({ loading: true });
    cart.removeItem(key)
      .then(cart => setState({cart, items: cart.items, item_count: cart.item_count, loading: false}))
      .catch(error => ({ error, loading: false }));
  },
  updateItem(state, key, options) {
    console.log("key", key)
    console.log('options', options)
    // setState({ loading: true });
    cart.updateItem(key, options)
      .then(cart => setState({cart, items: cart.items, item_count: cart.item_count, loading: false}))
      .catch(error => ({ error, loading: false }));
  },
  closePopup() {
    setState({popupActive: false})
  }
});

export default actions;

