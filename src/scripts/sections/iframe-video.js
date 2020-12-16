import { register } from '@shopify/theme-sections';
import { FrameworkFeaturedVideo } from "Scripts/utils";

register('iframe-video', {
  
  
  initIframeVideo: function() {
    new FrameworkFeaturedVideo($(this.container).find('.media-block__video'));
  },
  
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initIframeVideo()
  },
  onUnload: function (e) {
    // $(this.container).find('.fluid-frame').empty();
  }
});

