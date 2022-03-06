import { CartType } from 'types';

export {};

declare global {
  interface Window {
    Store: any;
    cart: CartType;
    ResponsiveHelper: any;
  }
  interface JQuery {
    slideAccordion(arg: any): JQuery;
  }
}
