import { register } from "@shopify/theme-sections";
import { FrameworkFeaturedVideo } from "../helpers/utils.js";

register("iframe-video", {
  initIframeVideo: function () {
    this.iframeVideo = new FrameworkFeaturedVideo(
      $(this.container).find(".media-block__video")
    );
    if (Shopify.designMode) {
      setTimeout(() => {
        this.iframeVideo.update();
      }, 700);
    }
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function (e) {
    this.initIframeVideo();
  },
  onUnload: function (e) {
    // $(this.container).find('.fluid-frame').empty();
  },
});
