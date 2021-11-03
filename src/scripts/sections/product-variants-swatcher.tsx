import { h, render } from 'preact';
import { register } from '@shopify/theme-sections';
import { Provider } from 'react-redux';

import Product from '../Components/Product/index';

register('product-variants-swatcher', {
  onLoad: function () {
    let product;

    try {
      product = JSON.parse(document.getElementById('product-json').innerHTML);
    } catch (error) {
      console.warn(error);
    }
    render(
      //@ts-ignore
      <Provider store={window.Store}>
        <Product product={product} />
      </Provider>,
      this.container
    );
  },
});
