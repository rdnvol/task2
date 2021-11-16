import { register } from '@shopify/theme-sections';
import bgVideo from 'jquery-background-video';

register('video', {
  initBackgroundVideo: function () {
    afterScrollEnable(false, this.container, () => {
      bgVideo;
      $(`[data-section-id="${this.id}"] .jquery-background-video`).bgVideo({
        fadeIn: 1000,
        showPausePlay: true,
        pausePlayXPos: 'right',
        pausePlayYPos: 'top',
      });
    })
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initBackgroundVideo();
  },
});
