import { h, FunctionComponent } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { ProductType } from 'types';
import { SwatcherProductsContext } from 'contexts/swatcherProductsContext';
import { useProductContext } from 'contexts/productContext';

import ProductGallery from './ProductGallery';
import ProductMainBlock from './ProductMainBlock';
import useFetch from '../../hooks/useFetch';

interface SettingsType {
  blocks: { [key: string]: string }[];
  settings: { [key: string]: string | number };
}

interface Props {
  product: ProductType;
  settings: SettingsType;
}

const Product: FunctionComponent<Props> = ({ product, settings: { settings } }) => {
  const { setSwatchProducts, swatchTypes } = useContext(SwatcherProductsContext);
  const { setSettings, enhanceProduct } = useProductContext();
  const [{ response }, doFetch] = useFetch();

  useEffect(() => {
    if (!product) return;

    const groupName = product?.tags.find((tag) => tag.includes('color_group'));

    if (!groupName) return;

    doFetch(`/collections/all/${groupName}?view=ajax-json`, {
      method: 'GET',
    });
  }, [product]);

  useEffect(() => {
    if (!response || !response?.products) return;

    setSwatchProducts(response.products);
  }, [response]);

  useEffect(() => {
    if (!settings) return;

    setSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!product || settings.swatcher_type !== swatchTypes.products) return;

    enhanceProduct(product);
  }, [product]);

  return (
    <div className="container">
      <div className="product-main-block relative">
        <div className="md:flex md:space-x-8">
          <div className="md:w-6/12 mb-4 md:mb-0">
            <ProductGallery media={product.media} />
          </div>
          <div className="md:w-6/12">
            <ProductMainBlock product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
