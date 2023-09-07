import { initProductCardAddToBag } from 'helpers/utils';
import ProductCard from './productCard';

export default class QuickView {
  constructor(elem) {
    this.initChooseOptions(elem);
    this.cards = elem.querySelectorAll('[data-js-product-card]');
    initProductCardAddToBag(this.cards);
  }

  removeModalHtml(modal) {
    modal.querySelector('.js-quick-card') && modal.querySelector('.js-quick-card').remove();
  }

  renderHtmlInModal(modal, html) {
    this.removeModalHtml(modal);
    modal.insertAdjacentElement('afterbegin', html);
  }

  initProductCard(wrapper) {
    const productCard = new ProductCard(wrapper);
  }

  initFancybox() {
    import('@fancyapps/ui/dist/fancybox.css');
    import('@fancyapps/ui').then(({ Fancybox }) => {
      Fancybox.bind('[data-fancybox="quick-view"]', {
        mainClass: 'fancybox-quick-view',
        type: 'inline',
        trapFocus: false,
        autoFocus: false,
        click: 'close',
        dragToClose: false,
        Toolbar: false,
        Thumbs: false,
        groupAttr: false,
      });
    });
  }

  initChooseOptions(wrapper) {
    const cards = wrapper.querySelectorAll('[data-js-product-card]');

    if (!cards) return false;

    this.initFancybox();

    cards.forEach((card) => {
      const btn = card.querySelector('[data-quick-choose]');

      if (!btn) return false;

      const modal = document.querySelector('#quick-view-popup');

      btn.addEventListener('click', async () => {
        const productUrl = btn.getAttribute('data-product-url');
        const fetchUrl = productUrl.includes('?') ? `${productUrl}&view=quick-card` : `${productUrl}?view=quick-card`;
        const response = await fetch(fetchUrl);
        const responseText = await response.text();
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');

        const productHtml = responseHTML.querySelector('.js-quick-card');

        this.renderHtmlInModal(modal, productHtml);
        this.initProductCard(modal.querySelector('.js-quick-card'));
      });
    });
  }
}
