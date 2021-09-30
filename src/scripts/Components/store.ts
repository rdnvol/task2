import createStore from 'redux-zero';
import theme from '../helpers/themeSettings';

const { items, item_count } = theme.cartState;
const initialState = {
  cart: theme.cartState,
  items,
  item_count,
  justAdded: {},
};
const store = createStore(initialState);

export default store;
//@ts-ignore
window.Store = store;
