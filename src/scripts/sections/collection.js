import { register } from '@shopify/theme-sections';

register('collection', {
  observeCollectionWrapper() {
    const options = {
      threshold: 1,
    };
    this.observer = new IntersectionObserver(
      this._handleIntersection.bind(this),
      options
    );

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
      const productsCount = this.container.dataset.productsQuantity;
      if (entry.isIntersecting) {
        this.productsQuantity < +productsCount ? this._showSpinner(): false
        await this.fetchNextPage();
        this._hideSpinner();
      }
    });
  },

  initInfiniteScroll() {
    const isInfinite = this.container.dataset.infinite === 'true';
    if (!isInfinite) return;

    this.page = 2;
    this.productsQuantity = this.container.querySelector('.js-products-wrapper').children.length;
    this.spinnerHolder = this.container.querySelector('.spinner-holder');
    this.spinner = this.spinnerHolder.querySelector('.spinner');
    this.productsWrapper = this.container.querySelector('.js-products-wrapper');
    this.observeCollectionWrapper();
  },

  async fetchNextPage() {
    const url = location.href + `?view=pagination&page=${this.page}`;
    try {
      const nextProducts = await (await fetch(url)).text();
      const loadedProductsLength = $(nextProducts).filter((index, item) => {
        return index % 2 === 0
      }).length;
      this.productsQuantity += loadedProductsLength;
      $(this.productsWrapper).append(nextProducts);
      this.page++;
    } catch (e) {
      console.error('Error', e);
    }
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initInfiniteScroll();
  },
});
