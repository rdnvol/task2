import { getUrlWithVariant } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { register } from '@shopify/theme-sections';
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js';

import { getCart, openPopup, addJustAdded } from 'store/features/cart/cartSlice';
import { addItem } from 'helpers/cartAjaxCall';
import serializeArray from 'helpers/serializeArray';

register('product', {
  _initProduct(handle) {
    // eslint-disable-next-line no-use-before-define
    if (handle) window.Product = new Product(this.container);
  },
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad() {
    this._initProduct(this.container.dataset.handle);
    // Do something when a section instance is loaded
  },

  onBlockSelect() {
    this._initProduct(this.container.dataset.handle);
    // Do something when a section block is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
    // Do something when a section instance is unloaded
  },
});

export class Product {
  constructor(elem) {
    this.wrapper = elem;
    this.handle = this.wrapper.getAttribute('data-handle');
    this.formElement = this.wrapper.querySelector('[data-product-form]');
    this.submitButton = this.wrapper.querySelector('[data-submit-button]');
    this.submitButtonText = this.wrapper.querySelector('[data-submit-button]');
    this.priceContainer = this.wrapper.querySelector('[data-price-wrapper]');
    this.shopifyButtons = this.wrapper.querySelector('[data-shopify="payment-button"]');
    this.sizeChart = this.wrapper.querySelector('.size-chart-link');

    this.sizeChartInit();
    this.product = this.getProduct();
    this.initVariantSelects();
    this.getVariantData(this.variantSelects ?? this.variantRadios);
    this.updateOptions(this.variantSelects ?? this.variantRadios);
    this.initModelViewer();
    this.initSubmit();
    this.waitForElement('.shopify-payment-button__button--unbranded').then((node) => {
      const dynamicButtonPlaceholder = window.theme.dynamic_button_placeholder;

      setTimeout(() => {
        node.innerHTML = dynamicButtonPlaceholder;
        node.style.display = 'block';
      }, 0);
    });
  }

  initModelViewer() {
    const modelViewerEvent = new CustomEvent('activeModelSlide');

    const galleryWrapper = this.wrapper.querySelector('.product__gallery-slider');
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
    this.variantSelects = document.getElementById('variant-selects');
    this.variantRadios = document.getElementById('variant-radios');

    if (this.variantSelects) {
      this.productForm = document.querySelector(`#product-form-${this.variantSelects.dataset.section}`);
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantSelects.addEventListener('change', this.onVariantChange.bind(this, this.variantSelects, 'select'));
    }

    if (this.variantRadios) {
      this.productForm = document.querySelector(`#product-form-${this.variantRadios.dataset.section}`);
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantRadios.addEventListener('change', this.onVariantChange.bind(this, this.variantRadios, 'input'));
    }

    if (!this.variantRadios && !this.variantSelects) {
      this.inputName = document.getElementById('product-id');
      this.inputName.disabled = false;
    }
  }

  onVariantChange(el, selector) {
    this.updateOptions(el, selector);
    this.updateMasterId();
    this.onOptionChange(this.currentVariant);
    this.updateVariantInput(this.currentVariant);
  }

  updateOptions(el, selector) {
    if (!el) return;

    if (selector === 'input') {
      this.options = Array.from(el.querySelectorAll(selector)).reduce((acc, curr) => {
        if (curr.checked) {
          // eslint-disable-next-line no-param-reassign
          acc = [...acc, curr.value];
        }

        return acc;
      }, []);

      const titles = this.wrapper.querySelectorAll('.product__variant-label-box').reduce((acc, curr) => {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, curr.querySelector('span:last-child')];

        return acc;
      }, []);

      titles.forEach((title, index) => {
        title.innerText = this.options[index];
      });
    }

    if (selector === 'select') {
      this.options = Array.from(el.querySelectorAll(selector), (item) => item.value);
    }
  }

  updateMasterId() {
    this.currentVariant = this.variantData.find(
      (variant) => !variant.options.map((option, index) => this.options[index] === option).includes(false)
    );
  }

  updateVariantInput(variant) {
    this.inputName.value = variant.id;
    this.inputName.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // eslint-disable-next-line class-methods-use-this
  updateVariantUrl(variant) {
    if (!variant) return;

    const url = getUrlWithVariant(window.location.href, variant.id);

    window.history.replaceState({ path: url }, '', url);
  }

  onOptionChange(variant) {
    this.updateVariantPrice(variant);
    this.updateSubmitButton(variant);
    this.updateVariantUrl(variant);
    this.updateGallery(variant);
  }

  // eslint-disable-next-line class-methods-use-this
  getProduct() {
    let product;

    try {
      product = JSON.parse(document.getElementById('product-json').innerHTML);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }

    return product;
  }

  updateSubmitButton(variant) {
    if (!variant) {
      this.submitButton.classList.add('disabled');
      this.submitButton.setAttribute('disabled', 'disabled');
      this.submitButtonText.innerText = theme.strings.unavailable;
      this.shopifyButtons.classList.add('hidden');
    } else if (variant.available) {
      this.submitButton.classList.remove('disabled');
      this.submitButton.removeAttribute('disabled');
      this.submitButtonText.innerText = theme.strings.addToCart;
      this.shopifyButtons.classList.remove('hidden');
    } else {
      this.submitButtonText.innerText = theme.strings.soldOut;
      this.submitButton.classList.add('disabled');
      this.submitButton.setAttribute('disabled', 'disabled');
      this.shopifyButtons.classList.add('hidden');
    }
  }

  updateVariantPrice(variant) {
    while (this.priceContainer.firstChild) this.priceContainer.removeChild(this.priceContainer.firstChild);

    if (variant) {
      if (variant.compare_at_price > variant.price) {
        this.priceContainer.innerHTML = `<ins>${formatMoney(variant.price, theme.moneyFormat)}</ins>`;

        this.priceContainer.innerHTML = `<del>${formatMoney(variant.compare_at_price, theme.moneyFormat)}</del>`;
      } else {
        this.priceContainer.innerHTML = `<div>${formatMoney(variant.price, theme.moneyFormat)}</div>`;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  updateGallery(variant) {
    const sliderWrapper = this.wrapper.querySelector('.product__gallery-slider');

    const currentVariantSliderItem = sliderWrapper.querySelector(
      `.product__gallery-slider__img[data-position="${variant.featured_image?.position}"]`
    );

    if (!currentVariantSliderItem) return false;

    if (
      sliderWrapper.firstElementChild.querySelector('.product__gallery-slider__img').getAttribute('data-position') ===
      currentVariantSliderItem.getAttribute('data-position')
    )
      return false;

    sliderWrapper.prepend(currentVariantSliderItem.parentElement);
  }

  initSubmit() {
    let form;

    if (this.variantSelects) {
      form = document.getElementById(`product-form-${this.variantSelects.dataset.section}`);
    }

    if (this.variantRadios) {
      form = document.getElementById(`product-form-${this.variantRadios.dataset.section}`);
    }

    if (!this.variantSelects && !this.variantRadios) {
      form = document.getElementById('product-id').form;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.initAddToBag(e);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  initAddToBag(event) {
    event.preventDefault();

    const serializedForm = serializeArray(event.target);

    const variantId = serializedForm.find((item) => item.name === 'id')?.value;

    const quantity = document.getElementById('Quantity')?.value || 1;

    const properties = serializedForm.reduce((acc, curr) => {
      if (curr.name.includes('properties')) {
        const prop = curr.name.split('[')[1].split(']')[0];

        // eslint-disable-next-line no-param-reassign
        acc = { ...acc, [prop]: curr.value };
      }

      return acc;
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

      window.Store.dispatch(addJustAdded(items[0]));
      window.Store.dispatch(getCart());
      window.Store.dispatch(openPopup());
    });
  }

  waitForElement = (selector) =>
    new Promise((resolve, reject) => {
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

      observer.observe(this.wrapper.find('.shopify-payment-button')[0], {
        subtree: true,
        attributes: true,
        childList: true,
      });
    });

  getVariantData(el) {
    if (!el) return;

    this.variantData = this.variantData || JSON.parse(el.querySelector('[type="application/json"]').textContent);
  }

  // eslint-disable-next-line class-methods-use-this
  sizeChartInit() {
    Fancybox.bind('.size-chart-link', {
      closeButton: 'outside',
      showClass: 'size-chart',
      dragToClose: false,
      on: {
        reveal: () => {
          const tableContainer = document.querySelector('.fancybox__content main#main .container');
          const sizeChartBtn = document.querySelector('.size-chart-link');
          const fancyboxParent = document.querySelector('.fancybox__content');

          // eslint-disable-next-line no-use-before-define
          draftSizeChartElem(fancyboxParent, tableContainer, sizeChartBtn);
        },
      },
    });

    function draftSizeChartElem(fancyboxParent, tableContainer, sizeChartBtn) {
      const tableWrapper = document.createElement('div');
      const parentElement = sizeChartBtn.parentNode;

      wrap(tableContainer.querySelector('.rte table'), tableWrapper);
      parentElement.insertBefore(tableWrapper, sizeChartBtn);
      tableWrapper.classList.add('table-holder');
      tableContainer.removeAttribute('class');
      tableContainer.querySelector('.rte').appendChild(tableWrapper);
      fancyboxParent.innerHTML = '';
      fancyboxParent.appendChild(tableContainer);
    }

    function wrap(el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }
}
