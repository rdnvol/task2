import { h, FunctionComponent, Fragment } from 'preact';
import { useEffect, useContext, useRef } from 'preact/hooks';

import { MediaType, ProductType } from '../../types';
import { Image } from '../Image';
import { ProductContext } from '../../contexts/productContext';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';

interface PropTypes {
  media: MediaType[];
  swatcherProducts?: ProductType[] | null | undefined;
}

const ProductGallery: FunctionComponent<PropTypes> = ({
  media,
  swatcherProducts,
}) => {
  const { chosenProduct, settings } = useContext(ProductContext);
  const { swatchTypes } = useContext(SwatcherProductsContext);

  const images =
    settings?.swatcher_type === swatchTypes.variants
      ? media
      : chosenProduct?.media;

  return (
    <Fragment>
      <div className="product__gallery-slider lg:flex lg:flex-wrap">
        {images?.map((mediaItem, idx) => (
          <div className="product__gallery-slider__item lg:pr-4 md:pb-4">
            <div className="product__gallery-slider__img" data-position={mediaItem.position}>
              <Image
                key={mediaItem.aspect_ratio + idx}
                src={mediaItem.src}
                sizes={['635x791', '290x364']}
                ratio={mediaItem.aspect_ratio}
              />
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ProductGallery;
