import { h, FunctionComponent } from 'preact';

import { Image } from '../Image';
import { MediaType } from '../../types';

interface PropTypes {
  media: MediaType;
  key?: string | number;
}

const ProductThumbnail: FunctionComponent<PropTypes> = ({ media, key }) => {
  return (
    <div class="splide__slide">
      <div class="product-gallery-thumbs__img">
        <Image
          key={key}
          src={media.src}
          sizes={['191x237', '103x130']}
          ratio={media.aspect_ratio}
        />
      </div>
    </div>
  );
};

export default ProductThumbnail;
