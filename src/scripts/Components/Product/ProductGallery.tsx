import { h, FunctionComponent, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import Splide from '@splidejs/splide';

import { MediaType } from '../../types';
import { Image } from '../Image';
import ProductThumbnail from './ProductThumbnail';

const ProductGallery: FunctionComponent<{ media: MediaType[] }> = ({
  media,
}) => {
  const initProductGallery = () => {
    const splide = new Splide('.product-gallery-splide', {
      type: 'loop',
      perPage: 1,
      gap: 0,
      pagination: true,
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

    splide.sync(thumbnails);
    splide.mount();
    thumbnails.mount();
  };

  useEffect(() => {
    initProductGallery();
  }, []);

  return (
    <Fragment>
      <div class="product-gallery-splide">
        <div class="splide__track">
          <div class="splide__list">
            {media.map((mediaItem) => (
              <div class="splide__slide">
                <div class="product-gallery__img">
                  <Image
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
            {media.map((mediaItem, idx) => (
              <ProductThumbnail key={idx} media={mediaItem} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductGallery;
