import StickyPlugin from 'sticky-states';
import debounce from 'debounce';

class Sticky {
  constructor() {
    this.pluginInstance = StickyPlugin;
    this.initResizer();
  }

  resetOnResize = () => {
    if (!this.pluginInstance) console.warn('cannot find sticky-states plugin');

    this.pluginInstance.managers.forEach(({ stickyElement }) => {
      if (!stickyElement) return;

      stickyElement.style.height = '';
    });
  };

  initResizer() {
    this.resizeObserver = new ResizeObserver(debounce(this.resetOnResize, 400));
    this.resizeObserver.observe(document.body);
  }

  init(settings) {
    this.pluginInstance?.init(settings);
  }
}

export const StickyStates = new Sticky();
