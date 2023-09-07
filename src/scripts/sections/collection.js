import { formatMoney } from '@shopify/theme-currency';
import { register } from '@shopify/theme-sections';
import { performanceMeasure, renderImage, initUpdateVariantUnitPrice } from 'helpers/utils';
import QuickView from '../models/quickView';

register('collection', {
  observeCollectionWrapper() {
    const options = {
      threshold: 1,
    };

    this.observer = new IntersectionObserver(this._handleIntersection.bind(this), options);

    this.observer.observe(this.spinnerHolder);
  },

  _showSpinner() {
    this.spinner.classList.remove('hidden');
  },

  _hideSpinner() {
    this.spinner.classList.add('hidden');
  },

  _handleIntersection(entries) {
    entries.map(async (entry) => {
      const totalQuantityProducts = +this.container.dataset.totalProductsQuantity;

      if (entry.isIntersecting) {
        if (this.fetchInProgress) return;

        await this.renderProducts();
        new QuickView(this.container);
      }
    });
  },

  initInfiniteScroll() {
    const isInfinite = this.container.dataset.infinite === 'true';

    if (!isInfinite) return;

    this.page = 2;
    this.fetchInProgress = false;
    this.loadedProductsQuantity = this.container.querySelector('.js-products-wrapper').children.length;
    this.spinnerHolder = this.container.querySelector('.spinner-holder');
    this.spinner = this.spinnerHolder.querySelector('.spinner');
    this.productsWrapper = this.container.querySelector('.js-products-wrapper');
    this.observeCollectionWrapper();
  },

  async renderProducts() {
    this.fetchInProgress = true;
    const totalQuantityProducts = +this.container.dataset.totalProductsQuantity;

    if (this.loadedProductsQuantity < totalQuantityProducts) {
      this._showSpinner();

      try {
        const nextProducts = await this.fetchNextPage();

        this.loadedProductsQuantity += nextProducts.length;
        nextProducts.forEach((nextProduct) => {
          this.productsWrapper.appendChild(nextProduct);
        });
        this.page += 1;
        this._hideSpinner();
        this.fetchInProgress = false;
        this.initCollectionCardVariantSelectors(nextProducts);
      } catch (e) {
        console.error('Error', e);
      }
    } else {
      this._hideSpinner();
      this.observer.disconnect();
    }
  },

  async fetchNextPage() {
    const nextPage = await fetch(`/collections/${this.container.dataset.collectionHandle}?page=${this.page}`);
    const response = await nextPage.text();

    const nextProducts = new DOMParser()
      .parseFromString(response, 'text/html')
      .querySelectorAll('[data-product-container-js]');

    return Array.from(nextProducts).map((el) => el.parentNode);
  },

  initUpdateQuickViewEvent(wrapper) {
    new QuickView(wrapper);
    document.addEventListener('updateQuickView', () => {
      new QuickView(wrapper);
    });
  },

  addEventListenersToColorSelectors(card) {
    const colorRadios = card.querySelectorAll('[name="filter-color"]');

    if (!colorRadios) return;

    colorRadios.forEach((radio) => radio.addEventListener('change', (e) => this.onVariantChange(e)));
  },

  onVariantChange(event) {
    const productCard = event.target.closest('[data-js-product-card]');
    const productVariants = JSON.parse(productCard.querySelector('script').innerText);
    const { variantId } = event.target.dataset;
    const currentVariant = productVariants.find((variant) => variant.id === parseInt(variantId, 10));
    const productCardQuickAdd = productCard?.querySelector('[data-quick-choose]');

    currentVariant.featured_image && this.changeCardImage(productCard, currentVariant);
    productCardQuickAdd && this.changeCardQuickViewLink(productCardQuickAdd, variantId);
    this.changeCardPrice(productCard, currentVariant);
    this.changeCardUnitPrice(currentVariant, productCard);
  },

  changeCardPrice(productCard, variant) {
    const priceContainer = productCard.querySelector('.product-item__price');

    if (variant) {
      if (variant.compare_at_price > variant.price) {
        priceContainer.innerHTML = `<ins>${formatMoney(variant.price, theme.moneyFormat)}</ins>
            <del>${formatMoney(variant.compare_at_price, theme.moneyFormat)}</del>`;
      } else {
        priceContainer.innerHTML = `<div>${formatMoney(variant.price, theme.moneyFormat)}</div>`;
      }
    }
  },

  changeCardUnitPrice(variant, productCard) {
    initUpdateVariantUnitPrice(variant, productCard);
  },

  changeCardQuickViewLink(productCardQuickAdd, variantId) {
    const productUrl = productCardQuickAdd.getAttribute('data-product-url');

    const newProductUrl = productUrl.includes('?variant=')
      ? productUrl.replace(/(\?variant=)\d+/g, `?variant=${variantId}`)
      : `${productUrl}?variant=${variantId}`;

    productCardQuickAdd.setAttribute('data-product-url', newProductUrl);
  },

  changeCardImage(productCard, currentVariant) {
    const parser = new DOMParser();

    const newImageElem = parser.parseFromString(
      renderImage(currentVariant.featured_image.src, ['156x156', '323x323'], currentVariant.featured_image.alt, true),
      'text/html'
    );

    productCard.querySelector('picture').replaceWith(newImageElem.querySelector('picture'));
  },

  initCollectionCardVariantSelectors(collectionCards) {
    collectionCards.forEach((card) => this.addEventListenersToColorSelectors(card));
  },

  initCollection() {
    this.initInfiniteScroll();
    this.initUpdateQuickViewEvent(this.container);

    const isColorSwatches = this.container.dataset.colorSwatches === 'true';

    if (isColorSwatches) {
      this.initCollectionCardVariantSelectors(
        this.container.querySelectorAll('.js-products-wrapper [data-js-product-card]')
      );

      document.addEventListener('collectionPageRerender', () =>
        this.initCollectionCardVariantSelectors(
          this.container.querySelectorAll('.js-products-wrapper [data-js-product-card]')
        )
      );
    }
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad(e) {
    performanceMeasure(this.id, this.initCollection.bind(this));
  },
});
