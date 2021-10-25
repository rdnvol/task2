import {CartState} from "../redux/features/cart/cartSlice"

interface CartSelectorType {
    cart: CartState
}

export const cartSelector = (state: CartSelectorType): CartState => state.cart