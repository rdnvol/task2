import { h, FunctionComponent, createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { ProductType } from '../types/index';

interface PropTypes {
  children: ComponentChildren;
}

export const ProductContext = createContext(null);

const { Provider } = ProductContext;

const ProductProvider: FunctionComponent<PropTypes> = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [chosenProduct, setChosenProduct] = useState<ProductType | null>(null);

  return (
    <Provider
      value={{ settings, chosenProduct, setSettings, setChosenProduct }}
    >
      {children}
    </Provider>
  );
};

export default ProductProvider;
