import { h, render } from "preact";

export const Image = ({src, sizes, alt, ratio = 1 }) => {
  const width = sizes[sizes.length - 1];
  const height = Math.ceil(width / ratio);
  const placeholderSize = `${width}x${height}`;
  return (
    <picture>
      {sizes.length > 0 && sizes.map(size => (
        <source data-srcset={ resizeImageSrcset(src, size) }
                media={`(max-width: ${size}px)`}
                srcSet={ theme.placeholder_data }/>
      ))
      }
      <source data-srcset={ resizeImageSrcset(src, sizes[0]) }
              srcSet={ theme.placeholder_data }/>
      <img data-src={ resizeImage(src, sizes[0]) } className="lazyload" data-sizes="auto"
           alt={ alt }
           src={ theme.placeholder_image.replace('1x1', placeholderSize) }/>
    </picture>
  )
}
