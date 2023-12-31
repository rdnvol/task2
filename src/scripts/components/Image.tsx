import { h, FunctionComponent } from 'preact';
import { getId, resizeImage, resizeImageSrcset } from 'helpers/utils';
import { ImageType } from 'types';

import theme from 'helpers/themeSettings';

export const Image: FunctionComponent<ImageType> = ({ src, sizes, alt, ratio = 1 }) => {
  const width: number = parseInt(sizes[sizes.length - 1], 10);
  const height: number = Math.ceil(width / ratio);
  const placeholderSize = `${width}x${height}`;

  const imageSrc = src ?? theme.placeholder_image;

  return (
    <picture>
      {sizes.length > 0 &&
        sizes.map((size) => (
          <source
            key={`${getId()}-${size}`}
            data-srcset={resizeImageSrcset(imageSrc, size)}
            media={`(max-width: ${size}px)`}
            srcSet={theme.placeholder_data}
          />
        ))}
      <source data-srcset={resizeImageSrcset(imageSrc, sizes[0])} srcSet={theme.placeholder_data} />
      <img
        data-src={resizeImage(imageSrc, sizes[0])}
        className="lazyload"
        data-sizes="auto"
        width={width}
        height={height}
        alt={alt}
        src={theme.placeholder_image.replace('1x1', placeholderSize)}
      />
    </picture>
  );
};
