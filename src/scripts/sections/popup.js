import { register } from '@shopify/theme-sections';
import { getCookie, setCookie, performanceMeasure } from '../helpers/utils.js';

register('popup', {
  _openFancybox(cooke_name, days) {
    import('@fancyapps/ui/dist/fancybox.css');
    import('@fancyapps/ui/src/Fancybox/Fancybox.js').then(({ Fancybox }) => {
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

      window.fancybox = Fancybox;
    });
  },

  initPopup(days = 1) {
    document.addEventListener('DOMContentLoaded', () => {
      const cookie_popup1_name = 'show_cookie_message_popup1';

      if (getCookie(cookie_popup1_name) !== 'no') {
        this._openFancybox(cookie_popup1_name, days);
      }
    });
  },

  onLoad() {
    performanceMeasure(this.id, this.initPopup.bind(this, this.container.dataset.days));
  },

  onSelect() {
    window.fancybox.close();
    this._openFancybox();
  },

  onUnload() {
    window.fancybox.close();
  },

  onDeselect() {
    window.fancybox.close();
  },
});
