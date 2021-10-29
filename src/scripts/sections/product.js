import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import Swiper from 'swiper';
import { register } from '@shopify/theme-sections';
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js';
import { addItem, getCart } from '../helpers/cartAjaxCall.js';

register('product', {
  _initProduct(handle) {
    console.log(this);
    if (handle) {
      window.Product = new Product(this.container);
      console.log('Product section loaded');
    } else {
      console.log('onboarding product');
    }
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this._initProduct(this.container.dataset.handle);
    // Do something when a section instance is loaded
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

    this.sizeChartInit()
    this.initGallery();
    this.sizeChartInit();
    this.getProduct().then((product) => {
      this.product = product;
      console.log(this.product);
      this.form = new ProductForm(this.formElement[0], this.product, {
        onOptionChange: this.onOptionChange.bind(this),
        onFormSubmit: this.initAddToBag.bind(this),
      });
      this.initSelectedVariant();
    });
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

  initGallery() {
    this.productGalleryThumbs = new Swiper(
      this.wrapper.find('.product-gallery-thumbs')[0],
      {
        spaceBetween: 18,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        speed: 800,
        breakpoints: {
          768: {
            spaceBetween: 30,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            speed: 800,
          },
        },
      }
    );
    this.productGallery = new Swiper(this.wrapper.find('.product-gallery')[0], {
      speed: 800,
      // navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      thumbs: {
        swiper: this.productGalleryThumbs,
      },
    });
  }

  updateVariantUrl(variant) {
    if (!variant) return;
    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({ path: url }, '', url);
  }

  onOptionChange(event) {
    const variant = event.dataset.variant;

    this.slideToVariantImage(variant);
    this.updateVariantPrice(variant);
    this.updateSubmitButton(variant);
    this.updateVariantUrl(variant);
  }

  async getProduct() {
    const response = await fetch(`/products/${this.handle}.js`);
    return await response.json();
  }

  updateSubmitButton(variant) {
    if (!variant) {
      this.submitButton.addClass('disabled').attr('disabled', 'disabled');
      this.submitButtonText.text(theme.strings.unavailable);
      this.shopifyButtons.addClass('d-none');
    } else if (variant.available) {
      this.submitButton.removeClass('disabled').removeAttr('disabled');
      this.submitButtonText.text(theme.strings.addToCart);
      this.shopifyButtons.removeClass('d-none');
    } else {
      this.submitButtonText.text(theme.strings.soldOut);
      this.submitButton.addClass('disabled').attr('disabled', 'disabled');
      this.shopifyButtons.addClass('d-none');
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

  slideToVariantImage(variant) {
    if (variant) {
      const imageLabel = variant.featured_media
        ? variant.featured_media.preview_image.src
        : '';
      const imagePosition = variant.featured_media
        ? variant.featured_media.position - 1
        : 0;
      this.productGallery.slideTo(imagePosition);
    }
  }

  initSelectedVariant() {
    const currentIndex = this.form.variant().featured_media
      ? this.form.variant().featured_media.position - 1
      : 0;
    if (currentIndex) {
      this.slideToVariantImage(this.form.variant());
    }
  }

  initAddToBag(event) {
    event.preventDefault();
    addItem(this.form.element).then((item) => {
      getCart().then(({ item_count, items }) => {
        Store.setState({
          justAdded: item,
          popupActive: true,
          item_count,
          items,
        });
      });
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

  sizeChartInit() {
    Fancybox.bind('.size-chart-link', {
      closeButton: 'outside',
      showClass: 'size-chart',
      on: {
        reveal: () => {
          let table = document.querySelector('.fancybox__content main#main');
          let tableWrapper = document.createElement('div');
          let parentElement =
            document.querySelector('.size-chart-link').parentNode;
          parentElement.insertBefore(
            tableWrapper,
            document.querySelector('.size-chart-link')
          );
          tableWrapper.classList.add('table-holder');
          tableWrapper.appendChild(table);
          document.querySelector('.fancybox__content').innerHTML = '';
          document
            .querySelector('.fancybox__content')
            .appendChild(tableWrapper);
        },
      },
    });
  }
}
