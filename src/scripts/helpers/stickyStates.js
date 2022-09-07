import StickyPlugin from 'sticky-states';
import debounce from 'debounce';

class Sticky {
  constructor() {
    this.pluginInstance = StickyPlugin;
    this.initResizer();
  }

  resetOnResize = () => {
    if (!this.pluginInstance) console.warn('cannot find sticky-states plugin');

    this.pluginInstance.managers.forEach(({ stickyElement, innerElement }) => {
      if (!stickyElement) return;

      stickyElement.style.height = `${innerElement?.offsetHeight}px`;
    });
  };

  initResizer() {
    this.resizeObserver = new ResizeObserver(debounce(this.resetOnResize, 100));
    this.resizeObserver.observe(document.querySelector('[data-sticky-states-inner]'));
  }

  init(settings) {
    this.pluginInstance?.init(settings);
  }
}

export const StickyStates = new Sticky();
