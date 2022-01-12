class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    window.addEventListener('activeModelSlide', () => this.loadContent());
  }

  loadContent() {
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
      this.setAttribute('loaded', true);
      this.appendChild(content.querySelector('video, model-viewer, iframe')).focus();
      this.querySelector('button').style.opacity = '0';
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

if (!customElements.get('product-model')) {
  customElements.define('product-model', class ProductModel extends DeferredMedia {
    constructor() {
      super();
    }

    loadContent() {
      super.loadContent();
    }
  });
}

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }
    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  if (Shopify.designMode) {
    document.querySelectorAll("[data-shopify-xr-hidden]").forEach(element => element.classList.add('hidden'));
  }
  if (window.ProductModel) window.ProductModel.loadShopifyXR();
});
