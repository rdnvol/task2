import { load, register } from '@shopify/theme-sections';
import Plyr from 'plyr';
import { afterScrollEnable, callbackOnElOutOfView } from '../helpers/utils.js';

register('iframe-video', {
  initIframeVideo() {
    afterScrollEnable(this.container, () => {
      const videoRatio = this.container
        .querySelector(`.media-block__video #player-${this.id}`)
        .getAttribute('data-ratio');

      const options = {
        autoplay: true,
        muted: true,
        loop: {
          active: true,
        },
        fullscreen: {
          enabled: false,
          fallback: false,
          iosNative: false,
        },
        controls: false,
        hideControls: true,
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
          muted: 1,
          autoplay: 1,
        },
        vimeo: {
          autoplay: true,
          muted: true,
          playsinline: true,
          controls: false,
          loop: true,
          byline: true,
        },
      };

      this.iframeVideo = new Plyr(this.container.querySelector(`.media-block__video #player-${this.id}`), options);
      window.plyrPlayer = this.iframeVideo;
      document.addEventListener('ready', () => {
        this.iframeVideo.play();
      });

      callbackOnElOutOfView(this.container.querySelector(`.media-block__video`), () => this.iframeVideo.pause());
    });
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad(e) {
    this.initIframeVideo();
  },
});
