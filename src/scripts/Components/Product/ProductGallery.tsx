import { h, FunctionComponent, Fragment } from 'preact';
import { useEffect, useContext, useRef } from 'preact/hooks';
import Splide from '@splidejs/splide';

import { MediaType, ProductType } from '../../types';
import { Image } from '../Image';
import { ProductContext } from '../../contexts/productContext';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';
import ProductThumbnail from './ProductThumbnail';

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

  useEffect(() => {
    const splide = new Splide('.product-gallery-splide', {
      type: 'loop',
      perPage: 1,
      gap: 0,
      pagination: false,
      arrows: true,
      speed: 800,
      breakpoints: {
        767: {
          gap: 20,
          padding: {
            left: 0,
            right: '70px',
          },
        },
      },
    });

    const thumbnails = new Splide('.product-gallery-thumbs', {
      perPage: 3,
      gap: 10,
      rewind: false,
      pagination: false,
      arrows: false,
      isNavigation: true,
    });

    splide.on('lazyload:loaded', () => {});

    splide.sync(thumbnails);
    splide.mount();
    thumbnails.mount();

    const splideTrack = document.querySelector(
      '.splide__track'
    ) as HTMLDivElement;

    if (splideTrack) splideTrack.style.height = `${splideTrack.offsetHeight}px`;

    return () => {
      splide.destroy();
    };
  }, [chosenProduct]);

  return (
    <Fragment>
      <div class="product-gallery-splide">
        <div class="splide__track" style={{ height: 600 }}>
          <div class="splide__list">
            {settings?.swatcher_type === swatchTypes.variants
              ? media.map((mediaItem, idx) => (
                  <div class="splide__slide">
                    <div class="product-gallery__img">
                      <Image
                        key={mediaItem.aspect_ratio + idx}
                        src={mediaItem.src}
                        sizes={['635x791', '290x364']}
                        ratio={mediaItem.aspect_ratio}
                      />
                    </div>
                  </div>
                ))
              : chosenProduct?.media.map((mediaItem, idx) => (
                  <div class="splide__slide">
                    <div class="product-gallery__img">
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
        </div>
      </div>
      <div class="splide product-gallery-thumbs">
        <div className="splide__track">
          <div className="splide__list align-items-center">
            {settings?.swatcher_type === swatchTypes.variants
              ? media.map((mediaItem, idx) => (
                  <ProductThumbnail
                    key={mediaItem.aspect_ratio + idx}
                    media={mediaItem}
                  />
                ))
              : chosenProduct?.media.map((mediaItem, idx) => (
                  <ProductThumbnail
                    key={mediaItem.aspect_ratio + idx}
                    media={mediaItem}
                  />
                ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductGallery;
