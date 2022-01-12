import { getUrlWithVariant } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { register } from '@shopify/theme-sections';
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js';
import { addItem } from '../helpers/cartAjaxCall.js';

import {
  getCart,
  openPopup,
  addJustAdded,
} from '../redux/features/cart/cartSlice.ts';

register('product', {
  _initProduct(handle) {
    console.log(this);
    if (handle) {
      window.Product = new Product(this.container);
    } else {
    }
  },
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this._initProduct(this.container.dataset.handle);
    // Do something when a section instance is loaded
  },

  onBlockSelect: function (e) {
    this._initProduct(this.container.dataset.handle);
    // Do something when a section block is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function () {
    // Do something when a section instance is unloaded
  },
});

export class Product {
  constructor(elem) {
    this.wrapper = $(elem);
    this.handle = this.wrapper.data('handle');
    this.formElement = this.wrapper.find('[data-product-form]');
    this.submitButton = this.wrapper.find('[data-submit-button]');
    this.submitButtonText = this.wrapper.find('[data-submit-button]');
    this.priceContainer = this.wrapper.find('[data-price-wrapper]');
    this.shopifyButtons = this.wrapper.find('[data-shopify="payment-button"]');
    this.sizeChart = this.wrapper.find('.size-chart-link');

    this.sizeChartInit();
    this.product = this.getProduct();
    this.initVariantSelects();
    this.getVariantData(this.variantSelects ?? this.variantRadios);
    this.updateOptions(this.variantSelects ?? this.variantRadios);
    this.initModelViewer();
    // this.updateMasterId();
    this.initSubmit();
    this.waitForElement('.shopify-payment-button__button--unbranded').then(
      (node) => {
        const dynamicButtonPlaceholder =
          window.theme.dynamic_button_placeholder;
        setTimeout(() => {
          node.innerHTML = dynamicButtonPlaceholder;
          node.style.display = 'block';
        }, 0);
      }
    );
  }

  initModelViewer() {
    const modelViewerEvent = new CustomEvent('activeModelSlide');
    const galleryWrapper = this.wrapper.find(
      '.product__gallery-slider .product__gallery-slider__item'
    );

    galleryWrapper.each((index, slide) => {
      if ($(slide).find('product-model').length > 0 || $(slide).find('deferred-media').length > 0) {
        const viewBtn = $(slide).find('.deferred-media__poster');
        viewBtn.on('click', () => {
          window.dispatchEvent(modelViewerEvent);
        });
      }
    });
  }

  initVariantSelects() {
    this.variantSelects = document.getElementById('variant-selects');
    this.variantRadios = document.getElementById('variant-radios');

    if (this.variantSelects) {
      this.productForm = document.querySelector(
        `#product-form-${this.variantSelects.dataset.section}`
      );
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantSelects.addEventListener(
        'change',
        this.onVariantChange.bind(this, this.variantSelects, 'select')
      );
    }

    if (this.variantRadios) {
      this.productForm = document.querySelector(
        `#product-form-${this.variantRadios.dataset.section}`
      );
      this.inputName = this.productForm.querySelector('input[name="id"]');
      this.inputName.disabled = false;
      this.variantRadios.addEventListener(
        'change',
        this.onVariantChange.bind(this, this.variantRadios, 'input')
      );
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
      this.options = Array.from(el.querySelectorAll(selector)).reduce(
        (acc, curr) => {
          if (curr.checked) {
            acc = [...acc, curr.value];
          }
          return acc;
        },
        []
      );

      const titles = Array.from(
        $('.product__variant-label-box').find('span:last-child')
      );

      titles.forEach((title, idx) => {
        $(title).text(this.options[idx]);
      });
    }
    if (selector === 'select') {
      this.options = Array.from(el.querySelectorAll(selector), (item) => {
        return item.value;
      });
    }
  }

  updateMasterId() {
    this.currentVariant = this.variantData.find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateVariantInput(variant) {
    this.inputName.value = variant.id;
    this.inputName.dispatchEvent(new Event('change', { bubbles: true }));
  }

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

  getProduct() {
    let product;
    try {
      product = JSON.parse(document.getElementById('product-json').innerHTML);
    } catch (error) {
      console.warn(error);
    }
    return product;
  }

  updateSubmitButton(variant) {
    if (!variant) {
      this.submitButton.addClass('disabled').attr('disabled', 'disabled');
      this.submitButtonText.text(theme.strings.unavailable);
      this.shopifyButtons.addClass('hidden');
    } else if (variant.available) {
      this.submitButton.removeClass('disabled').removeAttr('disabled');
      this.submitButtonText.text(theme.strings.addToCart);
      this.shopifyButtons.removeClass('hidden');
    } else {
      this.submitButtonText.text(theme.strings.soldOut);
      this.submitButton.addClass('disabled').attr('disabled', 'disabled');
      this.shopifyButtons.addClass('hidden');
    }
  }

  updateVariantPrice(variant) {
    this.priceContainer.empty();
    if (variant) {
      if (variant.compare_at_price > variant.price) {
        this.priceContainer.append(
          `<ins>${formatMoney(variant.price, theme.moneyFormat)}</ins>`
        );
        this.priceContainer.append(
          `<del>${formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )}</del>`
        );
      } else {
        this.priceContainer.append(
          `<div>${formatMoney(variant.price, theme.moneyFormat)}</div>`
        );
      }
    }
  }

  updateGallery(variant) {
    const newMedia = $('.product__gallery-slider')
      .find(
        `.product__gallery-slider__img[data-position="${variant.featured_image.position}"]`
      )
      .parent();
    const mediaContainer = $('.product__gallery-slider');

    if ($(newMedia).is($(mediaContainer.first()))) return;
    $(mediaContainer).prepend(newMedia);
  }

  initSubmit() {
    let form;

    if (this.variantSelects) {
      form = document.getElementById(
        `product-form-${this.variantSelects.dataset.section}`
      );
    }

    if (this.variantRadios) {
      form = document.getElementById(
        `product-form-${this.variantRadios.dataset.section}`
      );
    }

    if (!this.variantSelects && !this.variantRadios) {
      form = document.getElementById('product-id').form;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.initAddToBag(e);
    });
  }

  initAddToBag(event) {
    event.preventDefault();

    const serializedForm = $(event.target).serializeArray();

    const variantId = serializedForm.find((item) => item.name === 'id')?.value;

    const quantity = document.getElementById('Quantity')?.value || 1;

    const properties = serializedForm.reduce((acc, curr) => {
      if (curr.name.includes('properties')) {
        const prop = curr.name.split('[')[1].split(']')[0];
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

  waitForElement = (selector) => {
    return new Promise((resolve, reject) => {
      let observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
          let nodes = Array.from(mutation.addedNodes);
          for (let node of nodes) {
            let button = node.querySelector(selector);
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
  };

  getVariantData(el) {
    if (!el) return;
    this.variantData =
      this.variantData ||
      JSON.parse(el.querySelector('[type="application/json"]').textContent);
  }

  sizeChartInit() {
    Fancybox.bind('.size-chart-link', {
      closeButton: 'outside',
      showClass: 'size-chart',
      dragToClose: false,
      on: {
        reveal: () => {
          let tableContainer = document.querySelector(
              '.fancybox__content main#main .container'
            ),
            sizeChartBtn = document.querySelector('.size-chart-link'),
            fancyboxParent = document.querySelector('.fancybox__content');
          draftSizeChartElem(fancyboxParent, tableContainer, sizeChartBtn);
        },
      },
    });
    function draftSizeChartElem(fancyboxParent, tableContainer, sizeChartBtn) {
      let tableWrapper = document.createElement('div');
      let parentElement = sizeChartBtn.parentNode;
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
