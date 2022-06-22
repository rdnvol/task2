export function addItem(data) {
  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const request = fetch('/cart/add.js', params);
  request.catch((data) => {
    console.log(data);
  });
  return request;
}
