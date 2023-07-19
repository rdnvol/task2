export function resizeImage(value, size, ratio) {
  const width = size.split('x')[0];
  const height = size.split('x')[1] || Math.floor(width / ratio);

  return value
    ? value
        .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => `_${width}x${height}${match}`)
    : '';
}

export function resizeImageSrcset(value, size, ratio) {
  const width = size.split('x')[0];
  const height = size.split('x')[1] || Math.floor(width / ratio);

  const image_1x = value
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => `_${width}x${height}${match}`);

  const image_2x_size = height ? `${width * 2}x${height * 2}` : `${width * 2}x`;

  const image_2x = value
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => `_${image_2x_size}${match}`);

  return `${image_1x}, ${image_2x} 2x`;
}

window.resizeImage = resizeImage;
window.resizeImageSrcset = resizeImageSrcset;

export function setCookie(name, value, days) {
  let expires;

  if (days) {
    const date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toGMTString()}`;
  } else expires = '';

  document.cookie = `${name}=${value}${expires}; path=/`;
}

export function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];

    while (c.charAt(0) === ' ') c = c.substring(1, c.length);

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

export function deleteCookie(name) {
  setCookie(name, '', -1);
}

export function getLocaleAndPathname(locales) {
  const curLocale = location.pathname.split('/')[1];
  const primaryLocale = locales.find((locale) => locale.primary);

  const notPrimaryLocation = locales.find((locale) => locale.iso_code === curLocale);

  if (!notPrimaryLocation) return [primaryLocale, location.pathname];

  return [notPrimaryLocation, location.pathname.replace(notPrimaryLocation.root_url, '')];
}

theme.utils = {};

const bind = function (fn, me, ...args) {
  return function () {
    return fn.apply(me, args);
  };
};

function createObjectFromString(str = '') {
  const string = str.replace(/\s+/g, '');
  const arr = string.split(',');
  const res = {};

  arr.forEach((item, i) => {
    const name = item.split(':')[0];
    const value = item.split(':')[1];

    res[name] = value;
  });

  return res;
}

export function afterScrollEnable(el, callback) {
  const handleIntersection = (entries, observer) => {
    if (!entries[0].isIntersecting) return;

    observer.unobserve(el);
    callback();
  };

  new IntersectionObserver(handleIntersection, { rootMargin: '0px 0px 200px 0px' }).observe(el);
}

export function callbackOnElOutOfView(el, callback) {
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      entry.isIntersecting === false && callback();
    });
  };

  new IntersectionObserver(handleIntersection, { threshold: 0.1 }).observe(el);
}

export function getId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 10).toUpperCase();
}

export async function performanceMeasure(name, callback, async) {
  performance.mark(`${name}-Start`);
  async ? await callback() : callback();
  performance.mark(`${name}-End`);
  performance.measure(name, `${name}-Start`, `${name}-End`);
}
