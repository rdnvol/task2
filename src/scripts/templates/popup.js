import { getCookie, deleteCookie, setCookie } from "Scripts/utils";
import { register } from '@shopify/theme-sections';
import fancybox from '@fancyapps/fancybox';

register('popup', {
  _openFancybox: function(cooke_name, days) {
    $.fancybox.open($('#popup'), {
      modal: true,
      autoFocus: false,
      afterClose: function(instance, slide) {
        setCookie(cooke_name, 'no', days);
      }
    });
  },
  
  initPopup: function(days = 1) {
    
    $(document).ready(() => {
      const cookie_popup1_name = 'show_cookie_message_popup1';
      if (getCookie(cookie_popup1_name) !== 'no') {
        this._openFancybox(cookie_popup1_name, days)
      }
    });
    window.fancybox = $.fancybox;
  },
  
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function(e) {
    console.log('------load--------')
    this.initPopup(this.container.dataset.days)
  },
  
  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function() {
    $.fancybox.close();
    this._openFancybox();
    // Do something when a section instance is selected
  },
  
  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function() {
    // Do something when a section instance is unloaded
    $.fancybox.close();
  },
  
  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function() {
    window.fancybox.close();
    // Do something when a section instance is deselected
  },
});

