class DetailsDisclosure extends HTMLElement {
  constructor() {
    super(),
      (this.mainDetailsToggle = this.querySelector('details')),
      this.addEventListener('keyup', this.onKeyUpEscape),
      this.mainDetailsToggle.addEventListener(
        'focusout',
        this.onFocusOut.bind(this)
      );
  }
  onFocusOut() {
    setTimeout(() => {
      this.contains(document.activeElement) || this.close();
    });
  }
  close() {
    // this.mainDetailsToggle.removeAttribute('open');
  }
  onKeyUpEscape(e) {
    if ('ESCAPE' !== e.code.toUpperCase()) return;
    const t = e.target.closest('details[open]');
    if (!t) return;
    const s = t.querySelector('summary');
    t.removeAttribute('open'), s.focus();
  }
}
customElements.define('details-disclosure', DetailsDisclosure);
