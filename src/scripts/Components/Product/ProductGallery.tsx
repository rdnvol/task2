import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import Splide from '@splidejs/splide';

import { MediaType } from '../../types';
import { Image } from '../Image';

const ProductGallery: FunctionComponent<{ media: MediaType[] }> = ({
  media,
}) => {
  const initProductGallery = () => {
    new Splide('.product-gallery-splide', {
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
    }).mount();
  };

  useEffect(() => {
    initProductGallery();
  }, []);

  return (
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
  );
};

export default ProductGallery;
