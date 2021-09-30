import * as cart from '@shopify/theme-cart';
import { removeTrapFocus } from '@shopify/theme-a11y';

const actions = ({ setState }) => ({
  addItem(state, id, options) {
    return cart.addItem(id, options).then((item) => {
      console.log('Added item from actions', item);
      cart.getState().then(({ item_count, items }) => {
        Store.setState({
          ...Store.getState(),
          justAdded: item,
          item_count,
          items,
        });
      });
    });
  },
  getCart() {
    return cart
      .getState()
      .then((cart) => ({
        cart,
        items: cart.items,
        loading: false,
        item_count: cart.item_count,
      }))
      .catch((error) => ({ error, loading: false }));
  },
  removeItem(state, key) {
    cart
      .removeItem(key)
      .then((cart) =>
        setState({
          cart,
          items: cart.items,
          item_count: cart.item_count,
          loading: false,
        })
      )
      .catch((error) => ({ error, loading: false }));
  },
  updateItem(state, key, options) {
    cart
      .updateItem(key, options)
      .then((cart) =>
        setState({
          cart,
          items: cart.items,
          item_count: cart.item_count,
          loading: false,
        })
      )
      .catch((error) => ({ error, loading: false }));
  },
  closePopup() {
    removeTrapFocus();
    setState({ popupActive: false });
  },
});

export default actions;
