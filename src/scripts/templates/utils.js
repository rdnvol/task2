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
