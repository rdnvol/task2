import { register } from '@shopify/theme-sections';
import { performanceMeasure } from 'helpers/utils';

register('map-section', {
  initMapSection: function () {
    const mapElement = document.getElementById('google-map');
    if (mapElement && google) {
      let map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10,
        disableDefaultUI: true,
      });
      new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map,
      });
    }
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function () {
    const sectionName = `${this.container.getAttribute('data-section-type')}-${this.id}`;

    performanceMeasure(sectionName, () => {
      performance.mark(`${sectionName}-Start`);

      this.initMapSection();

      performance.mark(`${sectionName}-End`);
    });
  }
});
