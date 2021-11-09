import { h, FunctionComponent, Fragment } from 'preact';
import { useMemo, useEffect, useState, useContext } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';

import { useDispatch } from '../../redux/hook';
import { addItem } from '../../redux/features/cart/cartSlice';
import { ProductType, AddItemType } from '../../types';
import ProductOptionSelection from './ProductOptionSelection';
import ProductColorOptionWrapper from './ProductColorOptionWrapper';
import ProductQuantity from './ProductQuantity';
import theme from '../../helpers/themeSettings';
import Button from '../Button';
import { SwatcherProductsContext } from '../../contexts/swatcherProductsContext';
import { ProductContext } from '../../contexts/productContext';

interface Props {
  product: ProductType;
}

const ProductForm: FunctionComponent<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const { swatcherProducts, swatchTypes } = useContext(SwatcherProductsContext);
  const { settings } = useContext(ProductContext);
  const colorOpt = 'color';
  const titleOpt = 'title';
  const [variantOptions, setVariantOptions] = useState({});
  const [chosenVariant, setChosenVariant] = useState(null);
  const [chosenProduct, setChosenProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const productPrice = useMemo(() => {
    if (product.compare_at_price_max > product.price) {
      return (
        <Fragment>
          <ins data-product-price>
            {formatMoney(product.price, theme.moneyFormat)}
          </ins>
          <del data-compare-text>
            {formatMoney(product.compare_at_price_max, theme.moneyFormat)}
          </del>
        </Fragment>
      );
    } else {
      return (
        <div data-product-price>
          {formatMoney(
            product?.selected_or_first_available_variant?.price,
            theme.moneyFormat
          )}
        </div>
      );
    }
  }, [product]);

  const productRenderCheck = useMemo(() => {
    return product?.options_with_values?.length;
  }, [product.options_with_values]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chosenVariant) return;

    try {
      dispatch(
        addItem({
          id: chosenVariant?.id,
          quantity: {
            quantity: productQuantity,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!product.options_with_values?.length) return;

    const optionNames = product.options_with_values.reduce((acc, curr, idx) => {
      return product?.first_available_variant
        ? {
            ...acc,
            [curr.name.toLowerCase()]:
              product.first_available_variant.options[idx],
          }
        : { ...acc, [curr.name.toLowerCase()]: null };
    }, {});

    setVariantOptions(optionNames);
  }, [product.options_with_values]);

  useEffect(() => {
    const keys = Object.keys(variantOptions);
    const values = Object.values(variantOptions);

    if (!keys.length || !values.length || !product) return;

    if (keys.length === values.length) {
      const variant = product?.variants?.find(
        (variant) => JSON.stringify(variant.options) === JSON.stringify(values)
      );

      const url = new URL(window.location as any);
      url.searchParams.set('variant', `${variant?.id}`);
      window.history.pushState({}, '', url);
      setChosenVariant(variant);
    }
  }, [variantOptions]);

  useEffect(() => {
    const payment_button_wrapper = document.getElementById(
      'payment-button-wrapper'
    );

    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, _) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          document.dispatchEvent(new Event('payment-button-loaded'));
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(payment_button_wrapper, config);

    document.addEventListener('payment-button-loaded', () => {
      const payment_button = document.querySelector('.shopify-payment-button');

      document.getElementById('payment-button').appendChild(payment_button);
    });

    return () => {
      document.removeEventListener('payment-button-loaded', () => null);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const paymentButtonSelect = document.getElementById(
      'payment-button-select'
    ) as HTMLSelectElement;

    if (!chosenVariant || !paymentButtonSelect) return;

    const searchingOption = Array.apply(null, paymentButtonSelect.options).find(
      (option) => parseInt(option.value) === chosenVariant.id
    );

    if (searchingOption) searchingOption.selected = 'true';
  }, [chosenVariant]);

  return (
    <form onSubmit={handleSubmit}>
      <div class="product__price" data-price-wrapper>
        <div class="product__price__box h5 d-flex flex-wrap align-items-center">
          {productPrice}
        </div>
      </div>
      <div class="product__row">
        {settings?.swatcher_type === swatchTypes.products && (
          <ProductColorOptionWrapper
            setQuantity={setProductQuantity}
            setChosenVariant={setChosenVariant}
          />
        )}
        {productRenderCheck &&
          product?.options_with_values?.length &&
          product?.options_with_values.map((option, idx) =>
            option.name.toLowerCase() === colorOpt ? (
              <ProductColorOptionWrapper
                variants={true}
                chosenProduct={chosenProduct}
                key={idx}
                option={option}
                setVariantOptions={setVariantOptions}
                variantOptions={variantOptions}
                chosenVariant={chosenVariant}
              />
            ) : (
              <ProductOptionSelection
                key={idx}
                option={option}
                variantOptions={variantOptions}
                setVariantOptions={setVariantOptions}
              />
            )
          )}
        <ProductQuantity
          setQuantity={setProductQuantity}
          quantity={productQuantity}
        />
      </div>
      <div class="row">
        <div class="col-sm-4 col-lg-8">
          <div class="product__row">
            {product.selected_or_first_available_variant.available ? (
              <Button
                type="submit"
                name="add"
                className="button w-100"
                text={
                  !chosenVariant || !chosenVariant?.available
                    ? theme.strings.unavailable
                    : theme.strings.addToCart
                }
                disabled={!chosenVariant || !chosenVariant?.available}
              />
            ) : (
              <Button
                className="button w-100"
                type="submit"
                disabled={true}
                text={theme.cart.soldOut}
              />
            )}
          </div>
          <div id="payment-button" class="product__row"></div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
