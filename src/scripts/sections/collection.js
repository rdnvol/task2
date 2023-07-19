import { register } from '@shopify/theme-sections';

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
      const productsCount = this.container.dataset.productsQuantity;

      if (entry.isIntersecting) {
        if (this.fetchInProgress) return;

        await this.renderProducts();
      }
    });
  },

  initInfiniteScroll() {
    const isInfinite = this.container.dataset.infinite === 'true';

    if (!isInfinite) return;

    this.page = 2;
    this.fetchInProgress = false;
    this.productsQuantity = this.container.querySelector('.js-products-wrapper').children.length;
    this.spinnerHolder = this.container.querySelector('.spinner-holder');
    this.spinner = this.spinnerHolder.querySelector('.spinner');
    this.productsWrapper = this.container.querySelector('.js-products-wrapper');
    this.observeCollectionWrapper();
  },

  async renderProducts() {
    this.fetchInProgress = true;
    const productsCount = this.container.dataset.productsQuantity;

    if (this.productsQuantity < +productsCount) {
      this._showSpinner();

      try {
        const nextProducts = await this.fetchNextPage();

        const loadedProductsLength = nextProducts.filter((index, item) => index % 2 === 0).length;

        this.productsQuantity += loadedProductsLength;
        nextProducts.forEach((nextProduct) => {
          this.productsWrapper.appendChild(nextProduct);
        });
        this.page += 1;
        this._hideSpinner();
        this.fetchInProgress = false;
      } catch (e) {
        console.error('Error', e);
      }
    }
  },

  async fetchNextPage() {
    const nextPage = await fetch(`/collections/all?page=${this.page}`);
    const response = await nextPage.text();

    const nextProducts = new DOMParser()
      .parseFromString(response, 'text/html')
      .querySelectorAll('.product-item.text-center');

    return Array.from(nextProducts).map((el) => el.parentNode);
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad(e) {
    this.initInfiniteScroll();
  },
});
