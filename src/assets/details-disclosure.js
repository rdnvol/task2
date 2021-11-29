class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');

    this.addEventListener('keyup', this.onKeyUpEscape);
    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open')
  }

  onKeyUpEscape(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    const summaryElement = openDetailsElement.querySelector('summary');
    openDetailsElement.removeAttribute('open');
    summaryElement.focus();
  }
}

customElements.define('details-disclosure', DetailsDisclosure);
