import { h, createContext, FunctionComponent } from 'preact';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { ProductType } from 'scripts/types';

interface PropTypes {
  children: ComponentChildren;
}

export const SwatcherProductsContext = createContext(null);

const { Provider } = SwatcherProductsContext;

const SwatcherProductsProvider: FunctionComponent<PropTypes> = ({ children }) => {
  const [swatchProducts, setSwatchProducts] = useState<ProductType[]>([]);

  const swatchTypes = {
    variants: 'variants',
    products: 'products',
  };

  return <Provider value={{ swatchProducts, setSwatchProducts, swatchTypes }}>{children}</Provider>;
};

export default SwatcherProductsProvider;
