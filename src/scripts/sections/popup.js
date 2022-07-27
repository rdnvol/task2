import { register } from '@shopify/theme-sections';
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js';
import { getCookie, setCookie, performanceMeasure } from '../helpers/utils.js';

register('popup', {
  _openFancybox(cooke_name, days) {
    const fancybox = Fancybox.show(
      [
        {
          src: '#popup',
          type: 'inline',
          closeButton: 'inside',
          dragToClose: false,
        },
      ],
      {
        on: {
          destroy: () => {
            setCookie(cooke_name, 'no', days);
          },
        },
      }
    );
  },

  initPopup(days = 1) {
    document.addEventListener('DOMContentLoaded', () => {
      const cookie_popup1_name = 'show_cookie_message_popup1';
      if (getCookie(cookie_popup1_name) !== 'no') {
        this._openFancybox(cookie_popup1_name, days);
      }
    });
    window.fancybox = Fancybox;
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad() {
    const sectionName = `${this.container.getAttribute('data-section-type')}-${this.id}`;

    performanceMeasure(sectionName, () => {
      performance.mark(`${sectionName}-Start`);

      this.initPopup(this.container.dataset.days);

      performance.mark(`${sectionName}-End`);
    });
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect() {
    Fancybox.close();
    this._openFancybox();
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
    // Do something when a section instance is unloaded
    Fancybox.close();
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect() {
    window.fancybox.close();
    // Do something when a section instance is deselected
  },
});
