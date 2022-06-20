import { CartType } from 'types';

export {};

declare global {
  interface Window {
    Store: any;
    cart: CartType;
    ResponsiveHelper: any;
  }
}
