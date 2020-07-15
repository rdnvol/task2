import createStore from "redux-zero";

const {items, item_count} = theme.cartState;
const initialState = {cart: theme.cartState, items, item_count, justAdded: {} };
const store = createStore(initialState);

export default store;
window.Store = store;
