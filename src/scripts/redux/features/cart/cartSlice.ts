import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cart from '@shopify/theme-cart';

import { CartItem, CartType } from '../../../types/index';
import theme from '../../../helpers/themeSettings';

export interface CartState {
  cart: CartType;
  items: CartItem[];
  justAdded: { [key: string]: string };
  item_count: number;
  loading?: boolean;
  popupActive: boolean;
  error: string | null;
}

export interface AddItemToCartType {
  id: any;
  quantity?: { [key: string]: number };
}

export interface UpdateItemType {
  id: any;
  options?: { [key: string]: any };
}

const { items, item_count } = theme.cartState;

const initialState: CartState = {
  cart: theme.cartState,
  items,
  item_count,
  justAdded: {},
  loading: false,
  popupActive: false,
  error: null,
};

export interface ReturnAsyncType {
  error?: { [key: string]: string };
  item: CartItem | null;
  item_count: number;
  items: CartItem[] | [];
}

export const addItem = createAsyncThunk(
  'cart/addItem',
  async ({ id, quantity }: AddItemToCartType) => {
    try {
      const item = await cart.addItem(id, quantity);

      const cartData = await cart.getState();

      return { item, cartData };
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, options }: UpdateItemType) => {
    try {
      const cartData = await cart.updateItem(id, options);
      return cartData;
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ key }: { [key: string]: string }) => {
    try {
      const cartData = await cart.removeItem(key);

      return cartData;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCart = createAsyncThunk('cart/getCart', async () => {
  try {
    const cartData = await cart.getState();
    return cartData;
  } catch (error) {
    console.log(error);
  }
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    closePopup: (state) => {
      return {
        ...state,
        popupActive: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItem.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(addItem.fulfilled, (state, { payload }) => {
        return {
          ...state,
          cart: payload.cartData,
          justAdded: payload.item,
          item_count: payload.cartData.item_count,
          items: payload.cartData.items,
          popupActive: true,
        };
      }),
      builder.addCase(addItem.rejected, (state, { payload }) => {
        state.loading = false;
      }),
      builder.addCase(removeItem.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(removeItem.fulfilled, (state, { payload }) => {
        return {
          ...state,
          cart: payload,
          items: payload.items,
          item_count: payload.item_count,
          loading: false,
        };
      }),
      builder.addCase(removeItem.rejected, (state) => {
        state.loading = false;
      }),
      builder.addCase(updateItem.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(updateItem.fulfilled, (state, { payload }) => {
        return {
          ...state,
          cart: payload,
          items: payload.items,
          item_count: payload.item_count,
          loading: false,
        };
      }),
      builder.addCase(updateItem.rejected, (state) => {
        state.loading = false;
      }),
      builder.addCase(getCart.pending, (state) => {
        state.loading = false;
      }),
      builder.addCase(getCart.fulfilled, (state, { payload }) => {
        return {
          ...state,
          cart: payload.cart,
          items: payload.items,
          loading: false,
          item_count: payload.item_count,
        };
      }),
      builder.addCase(getCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { closePopup } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
