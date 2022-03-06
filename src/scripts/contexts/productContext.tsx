import { h, FunctionComponent, createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { StateUpdater, useContext, useState } from 'preact/hooks';
import { ProductType } from 'types';

interface EnhancedProductType extends ProductType {
  swatchName: string;
  swatchColor: string;
}

interface ProductContextProps {
  settings: any;
  chosenProduct: ProductType | EnhancedProductType;
  swatchName: string;
  swatchColor: string;
  setSettings: StateUpdater<Record<string, any>>;
  setChosenProduct: StateUpdater<ProductType>;
  enhanceProduct: (product: ProductType) => void;
  getSwatchData: (product: ProductType) => { swatchName: string; swatchColor: string };
}

export const ProductContext = createContext(null);

const { Provider } = ProductContext;

export const ProductProvider: FunctionComponent<ComponentChildren> = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [chosenProduct, setChosenProduct] = useState<ProductType | EnhancedProductType | null>(null);

  const getSwatchData = (product: ProductType) => {
    let swatchName = product.tags.find((tag) => tag.includes('color_name'));

    if (swatchName) [, swatchName] = swatchName.split(':');

    let swatchColor = product.tags.find((tag) => tag.includes('color'));

    if (swatchColor) swatchColor = swatchColor.split(':').slice(1).join(':');

    return { swatchName, swatchColor };
  };

  const enhanceProduct = (product: EnhancedProductType) => {
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

export const useProductContext = (): ProductContextProps => {
  const context = useContext<ProductContextProps>(ProductContext);

  if (context == null) {
    throw new Error('useProductContext should be using inside ProductProvider');
  }

  return context;
};
