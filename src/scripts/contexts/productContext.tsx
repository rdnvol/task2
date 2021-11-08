import { h, FunctionComponent, createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { ProductType } from '../types/index';

interface PropTypes {
  children: ComponentChildren;
}

interface EnchancedProductType extends ProductType {
  swatchName: string;
  swatchColor: string;
}

export const ProductContext = createContext(null);

const { Provider } = ProductContext;

const ProductProvider: FunctionComponent<PropTypes> = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [chosenProduct, setChosenProduct] = useState<
    ProductType | EnchancedProductType | null
  >(null);

  const getSwatchData = (product: ProductType) => {
    let swatchName = product.tags.find((tag) => tag.includes('color_name'));

    if (swatchName) swatchName = swatchName.split(':')[1];

    let swatchColor = product.tags.find((tag) => tag.includes('color'));

    if (swatchColor) swatchColor = swatchColor.split(':').slice(1).join(':');

    return { swatchName, swatchColor };
  };

  const enhanceProduct = (product: EnchancedProductType) => {
    const { swatchName, swatchColor } = getSwatchData(product);

    setChosenProduct({
      ...product,
      swatchName,
      swatchColor,
    });
  };

  return (
    <Provider
      value={{
        settings,
        chosenProduct,
        setSettings,
        setChosenProduct,
        enhanceProduct,
        getSwatchData,
      }}
    >
      {children}
    </Provider>
  );
};

export default ProductProvider;
