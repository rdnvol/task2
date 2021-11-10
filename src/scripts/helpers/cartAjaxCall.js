export function addItem(data) {
  const params = {
    url: '/cart/add.js',
    data,
    dataType: 'json',
  };
  const request = $.post(params);
  request.fail((data) => {
    console.log(data);
  });
  return request;
}

export function getCart() {
  return $.getJSON('/cart.js');
}
