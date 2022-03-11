import { CartState } from './features/cart/cartSlice';

interface CartSelectorType {
  cart: CartState;
}

export const cartSelector = (state: CartSelectorType): CartState => state.cart;
