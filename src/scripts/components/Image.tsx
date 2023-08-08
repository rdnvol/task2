import { h, FunctionComponent } from 'preact';
import { getId, resizeImage, resizeImageSrcset } from 'helpers/utils';
import { ImageType } from 'types';

/**
 * Image snippet example of usage
 *
 * `<ImageSnippet
 *  src={image} // required // image path
 *  sizes={['300x300', '1200x1200']} // required // mobile first, array of image sizes
 *  mediaWidth={[767, 900, 1199]} // optional // By default [767, 1199]. Required to use when tablet or another custom sizes
 *  ratio={image.aspect_ratio} // optional // if empty 1 by default 1. Uses for calculation height when size has no height
 *  loading="lazy" // optional // if empty 'lazy' by default.
 *  alt="alt" // optional // if empty 'image alt' will be rendered.
 * />`
 */

export const Image: FunctionComponent<ImageType> = ({
  src,
  sizes,
  mediaWidth = [767, 1199],
  ratio = 1,
  alt,
  lazyload = true,
  fetchpriority = 'auto',
}) => {
  const width = sizes[0]?.split('x')[0];
  const height = sizes[0]?.split('x')[1] || Math.floor(+width / ratio);
  const sourceMediaWidth = mediaWidth.map((w) => `(max-width: ${w}px)`);
  const lazyloadValue = lazyload ? 'lazy' : 'eager';

  return (
    <picture>
      {sizes.length > 0 &&
        sizes.map((size, index) => (
          <source
            key={`${getId()}-${size}`}
            media={sizes.length - 1 !== index ? `${sourceMediaWidth[index]}` : '(min-width: 1200px)'}
            srcSet={`${resizeImageSrcset(src, size, ratio)}`}
          />
        ))}
      <img
        loading={lazyloadValue}
        width={width}
        height={height}
        alt={alt ?? 'image alt'}
        src={resizeImage(src, sizes[0], ratio)}
        // @ts-ignore
        fetchpriority={fetchpriority}
      />
    </picture>
  );
};
