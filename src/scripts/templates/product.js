import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import Swiper from "swiper";
import { addItem, getCart } from "Scripts/cartAjaxCall";
import Cart from "Scripts/cart";


class Product {
  constructor(elem) {
    this.wrapper = $(elem);
    this.handle = this.wrapper.data('handle');
    this.formElement = this.wrapper.find('[data-product-form]');
    this.submitButton = this.wrapper.find('[data-submit-button]');
    this.submitButtonText = this.wrapper.find('[data-submit-button]');
    this.priceContainer = this.wrapper.find('[data-price-wrapper]');
    this.shopifyButtons = this.wrapper.find('[data-shopify="payment-button"]');
    
    this.initGallery();
    this.getProduct()
      .then(product => {
        this.product = product;
        console.log(this.product);
        this.form = new ProductForm(this.formElement[0], this.product, {
          onOptionChange: this.onOptionChange.bind(this),
          onFormSubmit: this.initAddToBag.bind(this)
        });
        this.initSelectedVariant();
      })
  }
  
  initGallery() {
    this.productGalleryThumbs = new Swiper('.product-gallery-thumbs', {
      spaceBetween: 20,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      speed: 800,
    });
    this.productGallery = new Swiper('.product-gallery', {
      speed: 800,
      // navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      thumbs: {
        swiper: this.productGalleryThumbs
      }
    });
  }
  
  updateVariantUrl(variant) {
    if (!variant) return;
    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({path: url}, '', url);
  }
  
  onOptionChange(event) {
    console.log('event', event);
    const variant = event.dataset.variant;
    // console.log(variant);
    this.slideToVariantImage(variant);
    this.updateVariantPrice(variant);
    this.updateSubmitButton(variant);
    this.updateVariantUrl(variant);
  }
  
  async getProduct() {
    const response = await fetch(`/products/${ this.handle }.js`);
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
      this.priceContainer.append(`<div>${ formatMoney(variant.price, theme.moneyFormat) }</div>`);
      if (variant.compare_at_price > variant.price) {
        this.priceContainer.append(`<del>${ formatMoney(variant.compare_at_price, theme.moneyFormat) }</del>`);
      }
    }
    
  }
  
  slideToVariantImage(variant) {
    if (variant) {
      const imageLabel = variant.featured_media ? variant.featured_media.preview_image.src : '';
      const imagePosition = variant.featured_media ? variant.featured_media.position - 1 : '';
      this.productGallery.slideTo(imagePosition);
    }
  }
  
  initSelectedVariant() {
    console.log(this.form.variant());
    const currentIndex = this.form.variant().featured_media ? this.form.variant().featured_media.position - 1 : 0;
    this.productGallery.slideTo(currentIndex)
  }
  
  initAddToBag(event) {
    event.preventDefault();
    addItem(this.form.element)
      .then((item) => {
        Cart.showPopup(item);
        getCart().then((cart) => {
          // Cart.updateCartItemCount(cart.item_count);
        })
      });
  }
}


const productInit = {
  init(elem) {
    if ($(elem).length > 0) {
      window.product = new Product(elem);
    }
  }
};

export default productInit;
