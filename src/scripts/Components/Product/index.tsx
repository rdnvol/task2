import { h, FunctionComponent } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { ProductType } from '../../types';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';
import { ProductContext } from '../../contexts/productContext';
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

const Product: FunctionComponent<Props> = ({
  product,
  settings: { settings },
}) => {
  const { setSwatchProducts, swatchTypes } = useContext(
    SwatcherProductsContext
  );
  const { setSettings, setChosenProduct, chosenProduct } =
    useContext(ProductContext);
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

    let swatchName = product.tags.find((tag) => tag.includes('color_name'));

    if (swatchName) swatchName = swatchName.split(':')[1];

    let swatchColor = product.tags.find((tag) => tag.includes('color'));

    if (swatchColor) swatchColor = swatchColor.split(':').slice(1).join(':');

    setChosenProduct({
      ...product,
      swatchName,
      swatchColor,
    });
  }, [product]);

  return (
    <div class="container">
      <div class="product-main-block position-relative">
        <div class="row">
          <div class="col-md-6 mb-4 mb-md-0">
            <ProductGallery media={product.media} />
          </div>
          <div class="col-md-6">
            <ProductMainBlock product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
