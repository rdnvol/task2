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
