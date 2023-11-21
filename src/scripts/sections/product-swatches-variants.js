import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';
import { Product } from '../models/product';

class ProductSwatchesVariant extends Product {
  constructor(elem) {
    super(elem);

    this.getVariantData();
    this.updateOptions(this.variants);
  }

  initVariantSelects() {
    this.options = [...document.querySelectorAll('div[id^="variant-selects"], div[id^="variant-radios"]')];
    this.productForm = document.querySelector('[data-product-form]');

    if (this.options.length > 0) {
      this.options.forEach((variant) => {
        this.inputName = this.productForm.querySelector('input[name="id"]');
        this.inputName.disabled = false;
        variant.addEventListener('change', this.onVariantChange.bind(this, variant));
      });
    }

    if (this.options.length === 0) {
      this.inputName = document.getElementById('product-id');
      this.inputName.disabled = false;
    }
  }

  updateVariantSwatchesColor() {
    this.options.forEach((option) => {
      if (option.getAttribute('data-swatches-color-type')) {
        const swatchesColorType = option.getAttribute('data-swatches-color-type');

        const variantsWithColor = this.variantData.filter((v) => {
          const array = v.options.map((variantOption, index) => {
            if (this.colorVarinats[index] !== '{color}') {
              return this.colorVarinats[index] === variantOption;
            }

            return true;
          });

          return array.every((value) => value === true);
        });

        const colorInputs = option.querySelectorAll('input');

        colorInputs.forEach((input) => {
          const currentInputVariant = variantsWithColor.find((variantColor) =>
            variantColor.options.map((variantColorOption) => variantColorOption === input.value).includes(true)
          );

          switch (swatchesColorType) {
            case 'image':
              const image = input.parentElement.querySelector('img');
              const defaultImage = option.getAttribute('data-default-image');

              if (currentInputVariant && currentInputVariant.featured_image?.src) {
                image.src = currentInputVariant.featured_image.src;
              } else {
                image.src = defaultImage;
              }

              break;
            case 'metafields':
              let colorValue;
              const colorSpan = input.parentElement.querySelector('.js-metafield');

              if (currentInputVariant) {
                colorValue = this.product.variants.find((productVariant) =>
                  productVariant.options
                    .map((productVariantOption, index) => productVariantOption === currentInputVariant.options[index])
                    .every((value) => value === true)
                ).variant_metafields.metafield_color;
              }

              if (!colorValue) {
                colorValue = input.value;
              }

              colorSpan.style.backgroundColor = colorValue;
              break;
            default:
              break;
          }
        });
      }
    });
  }

  onVariantChange() {
    this.updateOptions(this.options);
    this.updateMasterId();
    this.onOptionChange(this.currentVariant);
    this.updateVariantInput(this.currentVariant);
  }

  updateOptions(el) {
    if (!el) return;

    this.optionsValues = [];
    this.colorVarinats = [];

    el.forEach((option) => {
      switch (option.getAttribute('data-option-type')) {
        case 'radio':
          let newAcc = [];
          let newColorAcc = [];

          Array.from(option.querySelectorAll('input')).reduce((acc, curr) => {
            if (curr.checked) {
              newAcc = [...acc, curr.value];
            }

            return newAcc;
          }, []);

          Array.from(option.querySelectorAll('input')).reduce((acc, curr) => {
            if (curr.checked) {
              if (option.getAttribute('data-swatches-color-type')) {
                newColorAcc = [...acc, '{color}'];
              } else {
                newColorAcc = [...acc, curr.value];
              }
            }

            return newColorAcc;
          }, []);

          this.colorVarinats = [...this.colorVarinats, ...newColorAcc];

          this.optionsValues = [...this.optionsValues, ...newAcc];

          const title = option.querySelector('.product__variant-label-box span:last-child');

          if (!title) break;

          title.innerText = newAcc[0];

          break;

        case 'select':
          const selectValue = option.querySelector('select').value;

          this.optionsValues = [...this.optionsValues, selectValue];

          this.colorVarinats = [...this.colorVarinats, selectValue];

          break;
        default:
          break;
      }
    });
  }

  onOptionChange(variant) {
    this.updateVariantPrice(variant);
    this.updateSubmitButton(variant);
    this.updateVariantUrl(variant);
    this.updateVariantSwatchesColor();
    this.updateGallery(variant);
  }

  initSubmit() {
    let form = this.productForm;

    if (!this.options) {
      form = document.getElementById('product-id').form;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.initAddToBag(e);
    });
  }

  getVariantData() {
    this.variantData =
      this.variantData || JSON.parse(this.wrapper.querySelector('[type="application/json"]').textContent);
  }

  updateGallery(variant) {
    if (!variant) return false;

    const sliderWrapper = this.wrapper.querySelector('.product__gallery-slider');

    const currentVariantSliderItem = sliderWrapper.querySelector(
      `.product__gallery-slider__img[data-position="${variant.featured_image?.position}"]`
    );

    if (!currentVariantSliderItem) return false;

    window.ResponsiveHelper.addRange({
      '..767': {
        on() {
          const imageWidth = currentVariantSliderItem.getBoundingClientRect().width;
          const variantImagePosition = variant.featured_image.position;

          const scrollToIndex = Array.from(sliderWrapper.children).findIndex(
            (elem) => +elem.querySelector('.product__gallery-slider__img').dataset.position === variantImagePosition
          );

          variantImagePosition && sliderWrapper.scrollTo(imageWidth * scrollToIndex, 0);
        },
      },
      '768..': {
        on() {
          if (
            sliderWrapper.firstElementChild
              .querySelector('.product__gallery-slider__img')
              .getAttribute('data-position') === currentVariantSliderItem.getAttribute('data-position')
          )
            return false;

          sliderWrapper.prepend(currentVariantSliderItem.parentElement);
        },
      },
    });
  }
}

register('product-swatches-variants', {
  _initProductSwatchesVariants(handle) {
    if (handle) window.ProductSwatchesVariant = new ProductSwatchesVariant(this.container);
  },

  onLoad() {
    performanceMeasure(this.id, this._initProductSwatchesVariants.bind(this, this.container.dataset.handle));
  },

  onBlockSelect() {
    this._initProductSwatchesVariants(this.container.dataset.handle);
  },
});
