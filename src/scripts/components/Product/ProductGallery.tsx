import { h, FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';

import { MediaType, ProductType } from 'types';
import { useProductContext } from 'contexts/productContext';
import { SwatcherProductsContext } from 'contexts/swatcherProductsContext';

import { Image } from '../Image';

interface PropTypes {
  media: MediaType[];
  swatcherProducts?: ProductType[] | null;
}

const ProductGallery: FunctionComponent<PropTypes> = ({ media }) => {
  const { chosenProduct, settings } = useProductContext();
  const { swatchTypes } = useContext(SwatcherProductsContext);

  const images: MediaType[] = settings?.swatcher_type === swatchTypes.variants ? media : chosenProduct?.media;

  return (
    <div className="product__gallery-slider lg:flex lg:flex-wrap">
      {images?.map((mediaItem) => (
        <div className="product__gallery-slider__item lg:pr-4 md:pb-4" key={mediaItem.id}>
          <div className="product__gallery-slider__img" data-position={mediaItem.position}>
            <Image
              key={mediaItem.id}
              src={mediaItem.src}
              sizes={['635x791', '290x364']}
              ratio={mediaItem.aspect_ratio}
              alt={mediaItem.alt}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGallery;
