import { formatMoney } from '@shopify/theme-currency';
import serializeArray from 'helpers/serializeArray';
import { addItem } from 'helpers/cartAjaxCall';
import { addJustAdded, getCart, openPopup } from 'store/features/cart/cartSlice';
import Accordion from 'accordion-js';
import { initUpdateVariantUnitPrice } from 'helpers/utils';

export class Product {
  constructor(elem) {
    this.wrapper = elem;
    this.sectionId = this.wrapper.getAttribute('data-section-id');
    this.handle = this.wrapper.getAttribute('data-handle');
    this.submitButton = this.wrapper.querySelector('[data-submit-button]');
    this.submitButtonText = this.wrapper.querySelector('[data-submit-button]');
    this.priceContainer = this.wrapper.querySelector('[data-price-wrapper]');
    this.shopifyButtons = this.wrapper.querySelector('[data-shopify="payment-button"]');
    this.sizeChart = this.wrapper.querySelector('.size-chart-link');

    this.initPickupAvailability();
    this.sizeChartInit();
    this.product = this.getProduct();
    this.initVariantSelects();
    this.initQuantitySelector();
    this.getVariantData(this.variantSelects ?? this.variantRadios);
    this.updateOptions(this.variantSelects ?? this.variantRadios);
    this.initModelViewer();
    this.initSubmit();
    this.initProductRecommendations();
    this.waitForElement('.shopify-payment-button__button--unbranded').then((node) => {
      const dynamicButtonPlaceholder = window.theme.dynamic_button_placeholder;

      setTimeout(() => {
        node.innerHTML = dynamicButtonPlaceholder;
        node.style.display = 'block';
      }, 0);
    });
  }

  updatePickupAvailability(variant) {
    if (!variant) return false;

    const pickupAvailabilityInfoWrapper = this.wrapper.querySelector('[data-store-availability-container]');

    if (!pickupAvailabilityInfoWrapper) return false;

    fetch(`${window.Shopify.routes.root}variants/${variant.id}`)
      .then((response) => response.text())
      .then((text) => {
        const pickupAvailabilityDrawerWrapper = this.wrapper.querySelector('.pickup-availability-drawer');

        const html = new DOMParser().parseFromString(text, 'text/html');
        const pickupAvailabilityInfoHTML = html.querySelector('[data-store-availability-container]');
        const pickupAvailabilityDrawerHTML = html.querySelector('.pickup-availability-drawer');

        pickupAvailabilityInfoWrapper.innerHTML = '';
        pickupAvailabilityInfoHTML &&
          pickupAvailabilityInfoWrapper.insertAdjacentHTML('afterbegin', pickupAvailabilityInfoHTML?.innerHTML);

        pickupAvailabilityDrawerWrapper.innerHTML = '';
        pickupAvailabilityDrawerHTML &&
          pickupAvailabilityDrawerWrapper.insertAdjacentHTML('afterbegin', pickupAvailabilityDrawerHTML?.innerHTML);
        this.initPickupAvailability();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  initPickupAvailability() {
    this.buttonPickupAvailability = this.wrapper.querySelector('.pickup-availability-button');

    if (!this.buttonPickupAvailability) return false;

    this._openButton();
    this._closeButton();
  }

  _openButton() {
    this.buttonPickupAvailability.addEventListener('click', () => {
      document.querySelector('html').classList.add('pickup-availability-active');
    });
  }

  _closeButton() {
    this.wrapper.querySelector('.btn-closer').addEventListener('click', () => {
      document.querySelector('html').classList.remove('pickup-availability-active');
    });
  }

  initModelViewer() {
    const modelViewerEvent = new CustomEvent('activeModelSlide');

    const galleryWrapper = this.wrapper.querySelector('.product__gallery-slider');

    if (!galleryWrapper) return false;

    const gallerySlides = galleryWrapper.querySelectorAll('.product__gallery-slider__item');

    gallerySlides.forEach((slide) => {
      if (slide.querySelector('product-model') || slide.querySelector('deferred-media')) {
        const viewBtn = slide.querySelector('.deferred-media__poster');

        viewBtn.addEventListener('click', () => {
          window.dispatchEvent(modelViewerEvent);
        });
      }
    });
  }

  initVariantSelects() {
    this.variantSelects = this.wrapper.querySelector('#variant-selects');
    this.variantRadios = this.wrapper.querySelector('#variant-radios');

    if (this.variantSelects) {
      this.productForm = this.wrapper.querySelector(`#product-form-${this.variantSelects.dataset.section}`);
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantSelects.addEventListener('change', this.onVariantChange.bind(this, this.variantSelects, 'select'));
    }

    if (this.variantRadios) {
      this.productForm = this.wrapper.querySelector(`#product-form-${this.variantRadios.dataset.section}`);
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantRadios.addEventListener('change', this.onVariantChange.bind(this, this.variantRadios, 'input'));
    }

    if (!this.variantRadios && !this.variantSelects) {
      this.inputName = this.wrapper.querySelector('#product-id');
      this.inputName.disabled = false;
    }
  }

  initQuantitySelector() {
    const quantityInput = this.wrapper.querySelector('#Quantity');

    quantityInput.addEventListener('change', (e) => {
      const value = Math.max(1, e.target.value);

      quantityInput.value = value;
    });
    const quantityDecrease = this.wrapper.querySelector('.jcf-btn-dec');
    const quantityIncrease = this.wrapper.querySelector('.jcf-btn-inc');

    quantityDecrease.addEventListener('click', (e) => {
      if (quantityInput.value > 1) {
        quantityInput.value = +quantityInput.value - 1;
      }
    });

    quantityIncrease.addEventListener('click', (e) => {
      quantityInput.value = +quantityInput.value + 1;
    });
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessage = this.errorMessage || this.wrapper.querySelector('.product-form__error-message');

    this.errorMessage.classList.toggle('invisible', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }

  removeErrorMessage() {
    const removeErrMessage = this.wrapper.querySelector('.product-form__error-message');

    if (removeErrMessage) this.handleErrorMessage();
  }

  onVariantChange(el, selector) {
    this.updateOptions(el, selector);
    this.updateMasterId();
    this.onOptionChange(this.currentVariant);
    this.removeErrorMessage();
    this.updateVariantInput(this.currentVariant);
  }

  updateOptions(el, selector) {
    if (!el) return;

    if (selector === 'input') {
      let newAcc = [];

      this.optionsValues = Array.from(el.querySelectorAll(selector)).reduce((acc, curr) => {
        if (curr.checked) {
          newAcc = [...acc, curr.value];
        }

        return newAcc;
      }, []);

      const titles = Array.from(this.wrapper.querySelectorAll('.product__variant-label-box')).reduce(
        (acc, curr) => [...acc, curr.querySelector('span:last-child')],
        []
      );

      titles.forEach((title, index) => {
        title.innerText = this.optionsValues[index];
      });
    }

    if (selector === 'select') {
      this.optionsValues = Array.from(el.querySelectorAll(selector), (item) => item.value);
    }
  }

  updateMasterId() {
    this.currentVariant = this.variantData.find(
      (variant) => !variant.options.map((option, index) => this.optionsValues[index] === option).includes(false)
    );
  }

  updateVariantInput(variant) {
    if (!variant) return false;

    this.inputName.value = variant.id;
    this.inputName.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateVariantUrl(variant) {
    if (!variant) return;

    import('@shopify/theme-product-form').then(({ getUrlWithVariant }) => {
      const url = getUrlWithVariant(window.location.href, variant.id);

      window.history.replaceState({ path: url }, '', url);
    });
  }

  onOptionChange(variant) {
    this.updatePickupAvailability(variant);
    this.updateVariantPrice(variant);
    this.updateVariantUnitPrice(variant);
    this.updateSubmitButton(variant);
    this.updateVariantUrl(variant);
    this.updateGallery(variant);
  }

  getProduct() {
    let product;

    try {
      product = JSON.parse(this.wrapper.querySelector('#product-json').innerHTML);
    } catch (error) {
      console.warn(error);
    }

    return product;
  }

  updateSubmitButton(variant) {
    if (!variant) {
      this.submitButton.classList.add('disabled');
      this.submitButton.setAttribute('disabled', 'disabled');
      this.submitButtonText.innerText = theme.strings.unavailable;
      this.shopifyButtons?.classList.add('hidden');
    } else if (variant.available) {
      this.submitButton.classList.remove('disabled');
      this.submitButton.removeAttribute('disabled');
      this.submitButtonText.innerText = theme.strings.addToCart;
      this.shopifyButtons?.classList.remove('hidden');
    } else {
      this.submitButtonText.innerText = theme.strings.soldOut;
      this.submitButton.classList.add('disabled');
      this.submitButton.setAttribute('disabled', 'disabled');
      this.shopifyButtons?.classList.add('hidden');
    }
  }

  updateVariantPrice(variant) {
    while (this.priceContainer.firstChild) this.priceContainer.removeChild(this.priceContainer.firstChild);

    if (variant) {
      if (variant.compare_at_price > variant.price) {
        this.priceContainer.innerHTML = `<ins>${formatMoney(variant.price, theme.moneyFormat)}</ins>
          <del>${formatMoney(variant.compare_at_price, theme.moneyFormat)}</del>`;
      } else {
        this.priceContainer.innerHTML = `<div>${formatMoney(variant.price, theme.moneyFormat)}</div>`;
      }
    }
  }

  updateVariantUnitPrice(variant) {
    initUpdateVariantUnitPrice(variant, this.wrapper);
  }

  updateGallery(variant) {
    if (!variant) return false;

    const sliderWrapper = this.wrapper.querySelector('.product__gallery-slider');

    if (!sliderWrapper) return false;

    const currentVariantSliderItem = sliderWrapper.querySelector(
      `.product__gallery-slider__img[data-position="${variant.featured_image?.position}"]`
    );

    currentVariantSliderItem &&
      window.ResponsiveHelper.addRange({
        '..767': {
          on() {
            const imageWidth = currentVariantSliderItem.getBoundingClientRect().width;

            const sliderItemMargin = getComputedStyle(currentVariantSliderItem.parentElement).marginRight.split(
              'px'
            )[0];

            const variantImagePosition = variant.featured_image.position;

            const scrollToIndex = Array.from(sliderWrapper.children).findIndex(
              (elem) => +elem.querySelector('.product__gallery-slider__img').dataset.position === variantImagePosition
            );

            variantImagePosition && sliderWrapper.scrollTo((+sliderItemMargin + imageWidth) * scrollToIndex, 0);
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

  initSubmit() {
    if (!this.variantSelects && !this.variantRadios) {
      this.productForm = this.wrapper.querySelector('#product-id').form;
    }

    this.productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.initAddToBag(e);
    });
  }

  initAddToBag(event) {
    event.preventDefault();

    const serializedForm = serializeArray(event.target);

    const variantId = serializedForm.find((item) => item.name === 'id')?.value;

    const quantity = this.wrapper.querySelector('#Quantity')?.value || 1;

    const properties = serializedForm.reduce((acc, curr) => {
      let newAcc;

      if (curr.name.includes('properties')) {
        const prop = curr.name.split('[')[1].split(']')[0];

        newAcc = { ...acc, [prop]: curr.value };
      }

      return newAcc;
    }, {});

    const data = {
      items: [
        {
          quantity,
          id: variantId,
          properties,
        },
      ],
    };

    addItem(data).then((response) => {
      const { items } = response;

      this.handleErrorMessage(response.description);

      if (!items) return;

      window.Store.dispatch(addJustAdded(items[0]));
      window.Store.dispatch(getCart());
      theme.cart.cartDrawer === 'popup'
        ? window.Store.dispatch(openPopup())
        : window.dispatchEvent(new CustomEvent('openCartDrawer'));
    });
  }

  waitForElement = (selector) =>
    new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const nodes = Array.from(mutation.addedNodes);

          for (const node of nodes) {
            const button = node.querySelector(selector);

            if (button && !button.disabled) {
              observer.disconnect();
              resolve(button);

              return;
            }
          }
        });
      });

      if (this.wrapper.querySelectorAll('.shopify-payment-button')[0]) {
        observer.observe(this.wrapper.querySelectorAll('.shopify-payment-button')[0], {
          subtree: true,
          attributes: true,
          childList: true,
        });
      }
    });

  getVariantData(el) {
    if (!el) return;

    this.variantData = this.variantData || JSON.parse(el.querySelector('[type="application/json"]').textContent);
  }

  sizeChartInit() {
    if (!this.sizeChart) return false;

    import('@fancyapps/ui/dist/fancybox.css');
    import('@fancyapps/ui/src/Fancybox/Fancybox.js').then(({ Fancybox }) => {
      Fancybox.bind('.size-chart-link', {
        closeButton: 'outside',
        showClass: 'size-chart',
        dragToClose: false,
        on: {
          reveal: () => {
            const tableWrapper = this.wrapper.querySelector('table');

            tableWrapper.parentElement.classList.add('table-holder');
          },
        },
      });
    });
  }

  initProductRecommendations() {
    const productRecommendationsContainer = this.wrapper.querySelector('#complementary-products-container');

    if (!productRecommendationsContainer) return false;

    fetch(productRecommendationsContainer.dataset.url)
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement('div');

        html.innerHTML = text;
        const recommendations = html.querySelector('#complementary-products-container');

        if (recommendations && recommendations.innerHTML.trim().length) {
          productRecommendationsContainer.innerHTML = recommendations.innerHTML;
          const accordionContainer = productRecommendationsContainer.querySelector('.js-complementary-accordion');

          this.accordion = new Accordion(accordionContainer, {
            duration: 400,
            collapse: true,
            showMultiple: false,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
