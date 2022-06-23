import { load, register } from '@shopify/theme-sections';
import Plyr from 'plyr';
import { afterScrollEnable } from '../helpers/utils.js';

register('iframe-video', {

  initIframeVideo: function () {
    // eslint-disable-next-line no-template-curly-in-string
    afterScrollEnable(this.container, () => {
      const videoRatio = this.container.querySelector(`.media-block__video #player-${this.id}`).getAttribute('data-ratio');
      const vimeoOptions = {
        // Auto play (if supported)
        autoplay: true,
        // Default volume
        muted: true,
        // Set loops
        loop: {
          active: true,
        },
        // Fullscreen settings
        fullscreen: {
          enabled: false, // Allow fullscreen?
          fallback: false, // Fallback using full viewport/window
          iosNative: false, // Use the native fullscreen in iOS (disables custom controls)
          // Selector for the fullscreen container so contextual / non-player content can remain visible in fullscreen mode
          // Non-ancestors of the player element will be ignored
          // container: null, // defaults to the player element
        },
        // Default controls
        controls: false,
        hideControls: true,
        clickToPlay: false,
        disableContextMenu: false,
        ratio: videoRatio,
        youtube: {
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3,
          rel: 0,
          autohide: 1,
          showinfo: 0,
          enablejsapi: 1,
        },
      };
      this.iframeVideo = new Plyr(this.container.querySelector(`.media-block__video #player-${this.id}`), vimeoOptions);
    })
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initIframeVideo();
  }
});
