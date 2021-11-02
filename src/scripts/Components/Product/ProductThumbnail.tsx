import { h, FunctionComponent } from 'preact';

import { Image } from '../Image';
import { MediaType } from '../../types';

interface PropTypes {
  media: MediaType;
}

const ProductThumbnail: FunctionComponent<PropTypes> = ({ media }) => {
  return (
    <div class="splide__slide">
      <div class="product-gallery-thumbs__img">
        <Image
          src={media.src}
          sizes={['191x237', '103x130']}
          ratio={media.aspect_ratio}
        />
      </div>
    </div>
  );
};

export default ProductThumbnail;
