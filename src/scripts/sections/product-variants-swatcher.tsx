import { h, render } from 'preact';
import { register } from '@shopify/theme-sections';
import { Provider } from 'react-redux';

import Product from 'components/Product';
import { ProductProvider } from 'contexts/productContext';
import SwatcherProductsProvider from 'contexts/swatcherProductsContext';

register('product-variants-swatcher', {
  onLoad() {
    let product;
    let settings;

    try {
      product = JSON.parse(document.getElementById('product-json').innerHTML);
      settings = JSON.parse(document.getElementById('product-settings').innerHTML);
    } catch (error) {
      console.warn(error);
    }

    render(
      <Provider store={window.Store}>
        <ProductProvider>
          <SwatcherProductsProvider>
            <Product product={product} settings={settings} />
          </SwatcherProductsProvider>
        </ProductProvider>
      </Provider>,
      // @ts-ignore
      this.container
    );
  },
});
