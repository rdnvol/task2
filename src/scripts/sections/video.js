import { register } from '@shopify/theme-sections';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import { afterScrollEnable, performanceMeasure } from '../helpers/utils';

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

  onLoad: function () {
    const sectionName = `${this.container.getAttribute('data-section-type')}-${this.id}`;

    performanceMeasure(sectionName, () => {
      performance.mark(`${sectionName}-Start`);

      this.initBackgroundVideo();

      performance.mark(`${sectionName}-End`);
    });
  },
});
