import { register } from '@shopify/theme-sections';
// import bgVideo from 'jquery-background-video';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import { afterScrollEnable } from '../helpers/utils';

register('video', {
  initBackgroundVideo: function () {
    afterScrollEnable(this.container, () => {
      const players = Array.from(document.querySelectorAll('.js-player')).map((p) => new Plyr(p ,{
        autoplay: true,
        loop: {
          active: true
        },
        autopause: true,
        muted: true,
        controls: [
          'play-large'
        ]
      }));
    });
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initBackgroundVideo();
  },
});
