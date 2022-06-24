export async function addItem(data) {
  const params = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const result = await fetch('/cart/add.js', params)
    .then((res) => res.json())
    .catch((error) => console.log(error));

  return result;
}
