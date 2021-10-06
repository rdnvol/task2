import { getCookie, deleteCookie, setCookie } from "../helpers/utils";
import { register } from '@shopify/theme-sections';
import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox.js";


  // modal: true,
  // autoFocus: false,
  // afterClose: function(instance, slide) {
  //   setCookie(cooke_name, 'no', days);
  // }
register('popup', {
  _openFancybox: function(cooke_name, days) {
    const fancybox = Fancybox.show ([{
      src: "#popup",
      type: "inline",
      closeButton: "inside",
      dragToClose: false
    }],
    {
      on: {
        destroy: () => {
          setCookie(cooke_name, 'no', days);
        }
      }
    })
    this.modalCloseButton();
  },

  modalCloseButton: function() {
    this.container.querySelector('[data-fancybox-close]').addEventListener('click', function(e) {e.preventDefault(), Fancybox.close()});
  },
  
  initPopup: function(days = 1) {
    
    $(document).ready(() => {
      const cookie_popup1_name = 'show_cookie_message_popup1';
      if (getCookie(cookie_popup1_name) !== 'no') {
        this._openFancybox(cookie_popup1_name, days)
      }
    });
    window.fancybox = Fancybox;
  },
  
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function(e) {
    this.initPopup(this.container.dataset.days)
  },
  
  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function() {
    Fancybox.close();
    this._openFancybox();
    // Do something when a section instance is selected
  },
  
  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function() {
    // Do something when a section instance is unloaded
    Fancybox.close();
  },
  
  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function() {
    window.fancybox.close();
    // Do something when a section instance is deselected
  },
});

