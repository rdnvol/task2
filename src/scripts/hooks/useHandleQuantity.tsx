import { useEffect, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem as removeItemAction, updateItem as updateItemAction } from 'store/features/cart/cartSlice';
import { cartSelector } from 'store/selectors';
import useDebounce from './useDebounce';

export function useHandleQuantity(item) {
  const [inputValue, setInputValue] = useState<number | null>(null);
  const dispatch = useDispatch();

  const cart = useSelector(cartSelector);

  const updateItem = (quantity) => {
    const { key } = item;

    dispatch(
      updateItemAction({
        id: key,
        options: { quantity },
      })
    );
  };

  const removeItem = (e) => {
    e.preventDefault();
    dispatch(removeItemAction({ key: item.key }));
  };

  const handleUpdateItem = () => updateItem(inputValue);

  const changeQuantity = useDebounce(handleUpdateItem, 500);

  const handleChange = (e) => {
    const value = Math.max(0, e.target.value);

    setInputValue(value);
  };

  const decreaseQuantity = () => {
    setInputValue((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!item || inputValue) return;

    setInputValue(item?.quantity);
  }, []);

  useEffect(() => {
    cart.error && setInputValue(item.quantity);
  }, [cart.error]);

  return { inputValue, setInputValue, handleChange, handleUpdateItem, removeItem, changeQuantity, decreaseQuantity };
}
