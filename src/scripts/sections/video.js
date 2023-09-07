import { register } from '@shopify/theme-sections';

import { afterScrollEnable, performanceMeasure } from '../helpers/utils';

register('video', {
  initBackgroundVideo() {
    afterScrollEnable(this.container, () => {
      import('plyr/dist/plyr.css');
      import('plyr').then((mod) => {
        const Plyr = mod.default;

        const players = Array.from(document.querySelectorAll('.js-player')).map(
          (p) =>
            new Plyr(p, {
              autoplay: true,
              loop: {
                active: true,
              },
              autopause: true,
              muted: true,
              controls: ['play-large'],
            })
        );
      });
    });
  },

  onLoad() {
    performanceMeasure(this.id, this.initBackgroundVideo.bind(this));
  },
});
