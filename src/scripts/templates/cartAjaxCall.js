import Cart from 'Scripts/cart'

export function addItem(data) {
  const params = {
    url: '/cart/add.js',
    data: $(data).serialize(),
    dataType: 'json'
  };
  const request = $.post(params);
  request.fail((data) => {
    console.log('failed');
    console.log(data);
  })
  return request
}

export function getCart() {
  return $.getJSON('/cart.js');
}

export function updateItemQuantity(
  itemElement,
  quantity
) {
  const itemIndex = itemElement.attr('data-index');
  
  var params = {
    url: '/cart/change.js',
    data: {quantity, line: itemIndex},
    dataType: 'json'
  };
  
  $.post(params)
    .done(
      function (state) {
        Cart.updateCartItemCount(state.item_count);
        if (state.item_count === 0) {
          Cart.showEmptyCart();
        } else {
          if (quantity === 0) {
            Cart.getItemsHtml();
          } else {
            Cart.updateTotalQuantity(state.total_price)
            Cart.updateItemContent(itemElement, state);
          }
        }
      }
    )
    .fail(
      function (error) {
        console.log(error);
        // this._showCartError($itemQtyInputs);
      }
    );
}
