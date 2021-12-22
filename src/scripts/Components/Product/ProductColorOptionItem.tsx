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
  enhanceProduct?: StateUpdater<any>;
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
  enhanceProduct,
}) => {
  const renderSwatchColor = () => {
    const imageReg = /(https?:\/\/.*\.(?:png|jpg))/i;
    let isImage = imageReg.test(color);

    return isImage ? (
      <Image src={color} sizes={['26x26', '26x26']} />
    ) : (
      <span
        style={{
          backgroundColor: color.replace(' ', ''),
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

  const isDisabled = useMemo(() => {
    let currentVariantObj = chosenProduct.variants.find((variant) => {
      return variant.title === color
    })
    if (!currentVariantObj) return
    return !currentVariantObj?.available
  }, [chosenProduct])

  const handleChange = useCallback(() => {
    if (settings.swatcher_type === swatchTypes.products && !variants) {
      return () => {
        window.history.replaceState({}, '', product?.handle);

        enhanceProduct(product);

        setChosenVariant(product?.first_available_variant);
        setQuantity(1);
      };
    }

    return () => {
      setVariantOptions({ ...variantOptions, [name]: color });
    };
  }, [swatchTypes, product?.handle, variantOptions, chosenVariant]);

  return (
    <div class="input-holder custom-input custom-input--colors inline-flex">
      <input
        id={`filter-field-colors-01-${idx}-${name}`}
        type="radio"
        name={`filter-field-colors-${name}`}
        onChange={handleChange()}
        checked={isChecked}
        disabled={isDisabled}
      />
      <label for={`filter-field-colors-01-${idx}-${name}`} class="custom-label">
        {settings?.swatcher_type === swatchTypes.variants ? (
          <span
            style={{
              backgroundColor: color.replace(' ', ''),
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
