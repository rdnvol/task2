import { h, FunctionComponent, Fragment } from 'preact';
import { useMemo, useEffect, useState } from 'preact/hooks';

import { addItem } from '../../helpers/cartAjaxCall';
import { ProductType, AddItemType } from '../../types';
import ProductOptionSelection from './ProductOptionSelection';
import ProductColorOptionWrapper from './ProductColorOptionWrapper';
import ProductQuantity from './ProductQuantity';
import theme from '../../helpers/themeSettings';
import Button from '../Button';

interface Props {
  addItem: AddItemType;
  product: ProductType;
}

const ProductForm: FunctionComponent<Props> = ({ product, addItem }) => {
  const colorOpt = 'color';
  const [variantOptions, setVariantOptions] = useState({});
  const [chosenVariant, setChosenVariant] = useState(null);

  const productPrice = useMemo(() => {
    if (product.compare_at_price_max > product.price) {
      return (
        <Fragment>
          <ins data-product-price>{product.compare_at_price_max}</ins>
          <span class="accessibility" data-compare-text>
            {theme.product.regular_price}
          </span>
        </Fragment>
      );
    } else {
      return (
        <div data-product-price>
          {product?.selected_or_first_available_variant?.price}
        </div>
      );
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chosenVariant) return;

    try {
      const item = await addItem(chosenVariant?.id, {
        quantity: chosenVariant.quantity,
      });

      console.log('Item added', item);
    } catch (error) {
      console.log(error);
    }
  };

  const setQuantity = (quantity: string) => {
    if (!chosenVariant) return;

    setChosenVariant({ ...chosenVariant, quantity: parseInt(quantity) });
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
      console.log('Values are', values);
      const variant = product?.variants?.find(
        (variant) => JSON.stringify(variant.options) === JSON.stringify(values)
      );
      console.log('Product is', product);
      console.log('Variant is', variant);

      setChosenVariant(variant);
    }
  }, [variantOptions]);

  console.log('Product price', productPrice);
  console.log('Variant options', variantOptions);
  console.log('Product from productform', product);
  console.log('Chosen variant', chosenVariant);

  return (
    <form onSubmit={handleSubmit}>
      <div class="product__price" data-price-wrapper>
        <div class="product__price__box h5 d-flex flex-wrap align-items-center">
          {productPrice}
        </div>
      </div>
      {/* {!product.has_only_default_variant &&
        product.options_with_values.map((option, index) => (
          <div class="js">
            {index > 0 ? (
              option.values.map((value) => (
                <Fragment>
                  <input
                    type="radio"
                    id={`Option${option.position}-${value}`}
                    name={`options[${option.name}]" value="${value}`}
                    checked={option.selected_value == value}
                  />
                  <label for={`Option${option.position}-${value}`}>
                    {value}
                  </label>
                </Fragment>
              ))
            ) : (
              <label for={`Option${option.position}`}>{option.name}</label>
            )}
          </div>
        ))} */}
      <div class="product__row">
        {product?.options_with_values?.length &&
          product?.options_with_values.map((option, idx) =>
            option.name.toLowerCase() === colorOpt ? (
              <ProductColorOptionWrapper
                key={idx}
                option={option}
                setVariantOptions={setVariantOptions}
                variantOptions={variantOptions}
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
          setQuantity={setQuantity}
          quantity={chosenVariant?.quantity ?? 1}
        />
      </div>
      <div class="row">
        <div class="col-sm-4 col-lg-8">
          <div class="product__row">
            {product.selected_or_first_available_variant.available ? (
              <Button
                type="submit"
                name="add"
                className="w-100"
                text={
                  !chosenVariant || !chosenVariant?.available
                    ? theme.strings.unavailable
                    : theme.strings.addToCart
                }
                disabled={!chosenVariant || !chosenVariant?.available}
              />
            ) : (
              <Button type="submit" disabled={true} text={theme.cart.soldOut} />
            )}
          </div>
          <div class="product__row">
            <button type="button" class="w-100">
              Buy it now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
