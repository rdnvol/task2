import { getCart, updateItemQuantity } from "Scripts/cartAjaxCall";
import { trapFocus, removeTrapFocus } from "@shopify/theme-a11y";
import { formatMoney } from '@shopify/theme-currency';

class Cart {
  constructor(item) {
    this.cartWrapper = $(item);
    this.cartCount = $('[data-cart-count]');
    this.cartTotalAmount = this.cartWrapper.find('[data-cart-total]')
    this.cartCountPopup = $('[data-cart-count-popup]');
    this.cartCountWrapper = $('[data-cart-count-wrapper]');
    this.cartItemsElement = this.cartWrapper.find('[data-cart-items]')
    this.cartAddedPopup = $('.cart-popup');
    this.cartAddedItemWrapper = $('[data-added-item]');
    this.noItemsElement = $('[data-no-items]');
    this.hasItemsElement = $('[data-has-items]');
    
    this.initClosePopup();
    getCart()
      .then((cart) => {
        this.cart = cart;
      })
    this.initChangeQuantity();
    this.initRemoveItem();
  }
  
  showPopup(item) {
    this.justAddedItem = item;
    getCart()
      .then((data) => {
        this.updatePopupContent(data, item);
        this.cartAddedPopup.addClass('active');
        
        trapFocus(this.cartAddedPopup[0]);
      })
  }
  
  justAddedHtml(item) {
    const {image, price, product_title, variant_title, quantity, options_with_values, product_has_only_default_variant} = item;
    return (
      `<div class="cart-popup__item">
        <div class="row align-items-center">
          <div class="col-3">
            <div class="cart-popup__item__img">
              <picture>
                <source data-srcset="${ resizeImageSrcset(image, '63x79') }" media="(max-width: 767px)" srcset="${ theme.placeholder_data }">
                <source data-srcset="${ resizeImageSrcset(image, '63x79') }" srcset="${ theme.placeholder_data }">
                <img data-src="${ resizeImage(image, '63x79') }" class="lazyload" data-sizes="auto" alt="image description" src="${ theme.placeholder_data }">
              </picture>
            </div>
          </div>
          <div class="col-6">
            <div class="cart-popup__item__title">${ product_title }</div>
            ${ this.renderVariantOptionsList(options_with_values, product_has_only_default_variant) }
          </div>
          <div class="col-3 text-right">Qty: ${ quantity }</div>
        </div>
      </div>`
    )
  }
  
  renderVariantOptionsList(options, only_default_option) {
    let html = '';
    if (!only_default_option) {
      options.forEach((option) => {
        html += `<div>${ option.name }: ${ option.value }</div>`;
      })
    }
    return html;
  }
  
  updatePopupContent(data, item) {
    this.cartAddedItemWrapper.empty();
    this.cartAddedItemWrapper.append(this.justAddedHtml(item));
    this.updateCartItemCount(data.item_count);
  }
  
  initClosePopup() {
    $('body').click((e) => {
      const target = $(e.target);
      if (!target.closest(this.cartAddedPopup).length) {
        this.cartAddedPopup.removeClass('active');
      }
    })
    $('.cart-popup__close').click(() => this.cartAddedPopup.removeClass('active'));
  }
  
  initChangeQuantity() {
    this.cartWrapper.find('[name="updates[]"]').change((e) => {
      const quantity = +e.target.value;
      const itemElement = $(e.target).closest('[data-line-item]')
      updateItemQuantity(itemElement, quantity)
    })
  }
  
  initRemoveItem() {
    this.cartWrapper.find('[data-remove-item]').click((e) => {
      e.preventDefault();
      const itemElement = $(e.target).closest('[data-line-item]')
      updateItemQuantity(itemElement, 0);
    })
  }
  
  updateItemContent(itemElement, cart) {
    const totalPrice = itemElement.find('[data-line-total-price]');
    const quantity = itemElement.find('[name="updates[]"]');
    const key = itemElement.attr('data-key');
    const item = this.getItem(key, cart)
    console.log(item);
    
    totalPrice.text(formatMoney(item.line_price, theme.moneyFormat));
    quantity.val(item.quantity);
  }
  
  getItem(key, state) {
    return state.items.find(item => item.key === key)
  }
  
  getItemsHtml() {
    $.get('/cart?view=ajax')
      .then((data) => {
        this.cartItemsElement.html(data);
        this.initChangeQuantity();
        this.initRemoveItem();
      });
  }
  
  updateTotalQuantity(totalPrice) {
    this.cartTotalAmount.text(formatMoney(totalPrice, theme.moneyFormat));
  }
  updateCartItemCount(itemsCount) {
    if (itemsCount === 0) {
      this.cartCount.detach();
    } else {
      const cartCount = this.cartCount.length
        ? this.cartCount
        : $(`<span class="header__cart-btn__num" data-cart-count></span>`).appendTo(this.cartCountWrapper);
      cartCount.text(itemsCount);
      this.cartCountPopup.text(`(${ itemsCount })`);
    }
  }
  
  showEmptyCart() {
    this.noItemsElement.removeClass('d-none');
    this.hasItemsElement.addClass('d-none');
  }
}

export default Cart = new Cart('#cart')
window.Cart = Cart;

