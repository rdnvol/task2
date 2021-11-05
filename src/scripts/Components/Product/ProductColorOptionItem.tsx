import { h, FunctionComponent } from 'preact';
import { StateUpdater, useMemo, useCallback } from 'preact/hooks';

import { Image } from '../Image';
import { ProductType, VariantType } from '../../types/index';
import theme from '../../helpers/themeSettings';

interface Props {
  chosenVariant?: VariantType;
  variants?: boolean;
  product?: ProductType;
  settings?: { [key: string]: string };
  swatchTypes?: { variants: string; products?: string };
  color: string;
  idx: number;
  name: string;
  variantOptions?: object;
  chosenProduct?: ProductType;
  setVariantOptions?: StateUpdater<any>;
  setChosenProduct?: StateUpdater<any>;
  setChosenVariant?: StateUpdater<any>;
  setQuantity?: StateUpdater<any>;
}

const ProductColorOptionItem: FunctionComponent<Props> = ({
  chosenVariant,
  variants,
  color,
  idx,
  name,
  variantOptions,
  setVariantOptions,
  setChosenProduct,
  setQuantity,
  swatchTypes,
  settings,
  product,
  chosenProduct,
  setChosenVariant,
}) => {
  const renderSwatchColor = () => {
    const imageReg = /(https?:\/\/.*\.(?:png|jpg))/i;
    let isImage = imageReg.test(color);

    return isImage ? (
      <Image src={color} sizes={['26x26', '26x26']} />
    ) : (
      <span
        style={{
          width: '25px',
          height: '25px',
          backgroundColor: color.replace(' ', ''),
          display: 'inline-block',
        }}
      ></span>
    );
  };

  const isChecked = useMemo(() => {
    if (settings?.swatcher_type === swatchTypes.products && !variants) {
      return product?.id === chosenProduct?.id;
    }

    return variantOptions && variantOptions[name] === color;
  }, [settings, product, chosenProduct, variantOptions]);

  const handleChange = useCallback(() => {
    if (settings.swatcher_type === swatchTypes.products && !variants) {
      let swatchName = product?.tags.find((tag) => tag.includes('color_name'));

      if (swatchName) swatchName = swatchName.split(':')[1];

      let swatchColor = product?.tags.find((tag) => tag.includes('color'));

      if (swatchColor) swatchColor = swatchColor.split(':').slice(1).join(':');

      return () => {
        window.history.replaceState({}, '', product?.handle);

        setChosenProduct({
          ...product,
          swatchName,
          swatchColor,
        });

        setChosenVariant(product?.first_available_variant);
        setQuantity(1);
      };
    }

    return () => {
      setVariantOptions({ ...variantOptions, [name]: color });
    };
  }, [swatchTypes, product?.handle, variantOptions, chosenVariant]);

  return (
    <div class="input-holder custom-input custom-input--colors d-inline-flex">
      <input
        id={`filter-field-colors-01-${idx}-${name}`}
        type="radio"
        name={`filter-field-colors-${idx}-${name}`}
        onChange={handleChange()}
        checked={isChecked}
      />
      <label for={`filter-field-colors-01-${idx}-${name}`} class="custom-label">
        {settings?.swatcher_type === swatchTypes.variants ? (
          <span
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: color.replace(' ', ''),
              display: 'inline-block',
            }}
          ></span>
        ) : (
          renderSwatchColor()
        )}
      </label>
    </div>
  );
};

export default ProductColorOptionItem;
