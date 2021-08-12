function resizeImage(value, size) {
  return value ? value
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
      return '_' + size + match;
    }) : ''
};

function resizeImageSrcset(value, size) {
  let width = + size.split('x')[0];
  let height = + size.split('x')[1] ? + size.split('x')[1] : '';
  let image_1x = value
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
      return '_' + width + 'x' + height + match;
    });
  let image_2x_size = height ?  width * 2 + 'x' + height * 2 : width * 2 + 'x'
  let image_2x = value
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
      return '_' + image_2x_size + match;
    });
  return image_1x + ", " + image_2x + " 2x";
}

window.resizeImage = resizeImage;
window.resizeImageSrcset = resizeImageSrcset;

export function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  setCookie(name, "", -1);
}

export function getLocaleAndPathname(locales) {
  let curLocale = location.pathname.split('/')[1];
  let primaryLocale = locales.find(locale => locale.primary);
  let notPrimaryLocation = locales.find(locale => locale.iso_code === curLocale);
  if (!notPrimaryLocation) return [primaryLocale, location.pathname];
  return [notPrimaryLocation, location.pathname.replace(notPrimaryLocation.root_url, '')];
}

theme.utils = {}
var bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

function createObjectFromString(str = '') {
  var string = str.replace(/\s+/g, '')
  var arr = string.split(',');
  var res = {}
  arr.forEach((item, i) => {
    var name = item.split(':')[0];
    var value = item.split(':')[1];
    res[name] = value
  });
  return res;
}
export const FrameworkFeaturedVideo = (function() {
  window.onYouTubeIframeAPIReady = function() {
    $(function() {
      $(window).trigger('theme.utils.youtubeAPIReady');
    });
  }
  function FrameworkFeaturedVideo(root) {
    var _this;
    this.root = root;
    this.hideThumbnail = this.hideThumbnail.bind(this);
    this.playButtonListener = this.playButtonListener.bind(this);
    this.vimeoEvents = this.vimeoEvents.bind(this);
    this.insertVimeoPlayer = this.insertVimeoPlayer.bind(this);
    this.youtubeEvents = this.youtubeEvents.bind(this);
    this.youtubeReady = this.youtubeReady.bind(this);
    this.insertYoutubePlayer = this.insertYoutubePlayer.bind(this);
    this.insertAPIScript = this.insertAPIScript.bind(this);
    this.playerInit = this.playerInit.bind(this);
    this.checkAPIScriptExists = this.checkAPIScriptExists.bind(this);
    _this = this;
    _this.video_type = _this.root.data("videoType");
    _this.video_id = _this.root.data("videoId");
    _this.thumbnail = _this.root.data("thumbnail");
    _this.section_id = _this.root.data("sectionId");
    _this.youtubeVars = {
      playsinline: 1,
      fs: 0,
      loop: 1,
      iv_load_policy: 3,
      controls: 0,
      rel: 0,
      origin: `http://${Shopify.shop}`,
      autohide: 1,
      showinfo: 0,
      enablejsapi: 1
    }
    Object.assign(_this.youtubeVars, createObjectFromString(_this.root.data("options")))
    _this.vimeoVars = {
      muted: 1,
      loop: 1,
      background: 1,
      autoplay: 1,
      id: _this.video_id,
      autopause: 0,
      playsinline: 0,
      title: 0
    };
    if (_this.thumbnail) {
      _this.playButtonListener();
    } else {
      _this.checkAPIScriptExists();
    }
  }

  FrameworkFeaturedVideo.prototype.checkAPIScriptExists = function() {
    var _this;
    _this = this;
    if (_this.video_type === "vimeo") {
      if (theme.utils.vimeoScriptAdded) {
        return _this.playerInit();
      } else {
        return _this.insertAPIScript("https://player.vimeo.com/api/player.js");
      }
    } else {
      if (theme.utils.youtubeScriptAdded) {
        return _this.playerInit();
      } else {
        return _this.insertAPIScript("https://www.youtube.com/iframe_api");
      }
    }
  };

  FrameworkFeaturedVideo.prototype.playerInit = function() {
    var _this;
    _this = this;
    if (_this.video_type === "vimeo") {
      if (_this.thumbnail) {
        return _this.insertVimeoPlayer();
      } else {
        $(window).on("load", function() {
          return _this.insertVimeoPlayer();
        });
        return _this.root.on("theme:section:load", function() {
          return _this.insertVimeoPlayer();
        });
      }
    } else {
      if (_this.thumbnail) {
        return _this.insertYoutubePlayer();
      } else {
        $(window).on("load", function() {
          return _this.insertYoutubePlayer();
        });
        return _this.root.on("theme:section:load", function() {
          return _this.insertYoutubePlayer();
        });
      }
    }
  };

  FrameworkFeaturedVideo.prototype.insertAPIScript = function(api_url) {
    var _this, first_script_tag, script_tag;
    _this = this;
    script_tag = document.createElement("script");
    script_tag.src = api_url;
    if (_this.video_type === "vimeo") {
      theme.utils.vimeoScriptAdded = true;
      script_tag.onload = function() {
        return _this.insertVimeoPlayer();
      };
    } else {
      theme.utils.youtubeScriptAdded = true;

      $(window).on("theme.utils.youtubeAPIReady", function() {
        console.log('ready')
        return _this.insertYoutubePlayer();
      });
    }
    first_script_tag = document.getElementsByTagName("script")[0];
    return first_script_tag.parentNode.insertBefore(
      script_tag,
      first_script_tag
    );
  };

  FrameworkFeaturedVideo.prototype.insertYoutubePlayer = function() {
    console.log('here')
    var _this;
    _this = this;
    return (_this.player = new YT.Player("player-" + _this.section_id, {
      videoId: _this.video_id,
      playerVars: _this.youtubeVars,
      events: {
        onReady: _this.youtubeReady,
        onStateChange: _this.youtubeEvents
      }
    }));
  };

  FrameworkFeaturedVideo.prototype.youtubeReady = function() {
    var _this;
    _this = this;
    if (!_this.thumbnail) {
      _this.player.mute();
    }
    return _this.player.playVideo();
  };

  FrameworkFeaturedVideo.prototype.youtubeEvents = function(event) {
    var YTP, _this, remains;
    _this = this;
    YTP = event.target;
    if (_this.thumbnail) {
      if (event.data === 0) {
        YTP.seekTo(0);
        return YTP.pauseVideo();
      }
    } else {
      if (event.data === 1) {
        remains = YTP.getDuration() - YTP.getCurrentTime();
        if (_this.rewindTO) {
          clearTimeout(_this.rewindTO);
        }
        return (_this.rewindTO = setTimeout(function() {
          YTP.seekTo(0);
        }, (remains - 0.1) * 1000));
      }
    }
  };

  FrameworkFeaturedVideo.prototype.insertVimeoPlayer = function() {
    var _this;
    _this = this;
    if (!_this.thumbnail) {
      _this.vimeoVars.playsinline = 1;
      _this.vimeoVars.muted = 1;
      _this.vimeoVars.background = 1;
      _this.vimeoVars.loop = 1;
    }
    _this.player = new Vimeo.Player(
      "player-" + _this.section_id,
      _this.vimeoVars
    );
    if (_this.thumbnail) {
      _this.vimeoEvents();
    }
    return _this.player.play();
  };

  FrameworkFeaturedVideo.prototype.vimeoEvents = function() {
    var _this;
    _this = this;
    _this.player.getDuration().then(function(duration) {
      return _this.player.addCuePoint(duration - 0.3, {});
    });
    return _this.player.on("cuepoint", function() {
      _this.player.setCurrentTime(0);
      return _this.player.pause();
    });
  };

  FrameworkFeaturedVideo.prototype.playButtonListener = function() {
    var _this;
    _this = this;
    return _this.root
      .find(".feature-video--play svg, .feature-video--play-mobile svg")
      .on("click", function() {
        _this.checkAPIScriptExists();
        return _this.hideThumbnail();
      });
  };

  FrameworkFeaturedVideo.prototype.hideThumbnail = function() {
    var _this;
    _this = this;
    return setTimeout(function() {
      return _this.root
        .find(
          ".feature-video--header, .feature-video--thumbnail, .feature-video--play-mobile"
        )
        .hide();
    }, 350);
  };
  FrameworkFeaturedVideo.prototype.update = function() {
    var _this;
    _this = this;
    if (_this.video_type === "youtube") {
      _this.insertYoutubePlayer();
    }
  }
  return FrameworkFeaturedVideo;
})();
