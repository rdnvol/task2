class DetailsDisclosure extends HTMLElement {
  constructor() {
    super(),
      (this.mainDetailsToggle = this.querySelector('details')),
      this.addEventListener('keyup', this.onKeyUpEscape),
      this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.onClickOutOfMenuBound = this.onClickOutOfMenu.bind(this);
  }

  onFocusOut() {
    document.addEventListener('click', this.onClickOutOfMenuBound);
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    document.removeEventListener('click', this.onClickOutOfMenuBound);
  }

  onClickOutOfMenu(e) {
    setTimeout(() => {
      this.contains(e.target) || this.close();
    });
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
