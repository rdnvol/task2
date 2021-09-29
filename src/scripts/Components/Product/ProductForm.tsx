import { h, FunctionComponent, Fragment } from "preact";
import { useMemo } from "preact/hooks";

import { ProductType } from "../../types";
import theme from "../../helpers/themeSettings";
import Button from "../Button";

const ProductForm: FunctionComponent<{ product: ProductType }> = ({
  product,
}) => {
  console.log("Product from Product Form", product);
  //   const productPrice = useMemo(() => {
  //     if (product.compare_at_price_max > product.price) {
  //       return (
  //         <Fragment>
  //           <ins data-product-price>{product.compare_at_price_max}</ins>
  //           <span class="accessibility" data-compare-text>
  //             {theme.product.regular_price}
  //           </span>
  //         </Fragment>
  //       );
  //     } else {
  //       return (
  //         <div data-product-price>
  //           {product.selected_or_first_available_variant.price}
  //         </div>
  //       );
  //     }
  //   }, [product]);

  //   console.log("Product price", productPrice);

  return (
    <form>
      <div class="product__price" data-price-wrapper>
        <div class="product__price__box h5 d-flex flex-wrap align-items-center">
          {/* {productPrice} */}
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
        ))
        } */}
      <div class="product__row">
        {/* {% render 'product-option-selection--markup' %} */}
        {/* <ProductOptionSelection /> */}
        {/* <div class="row mb-2">
          <div class="col-sm-7 col-lg-5">
            <label class="product__label" for="size">
              Variant
            </label>
            <select name="id" id="size" class="product__select w-100">
              {product.variants.map((variant) => (
                <option
                  selected={
                    variant === product.selected_or_first_available_variant
                  }
                  disabled={!variant.available}
                  value={variant.id}
                >
                  {variant.title}
                </option>
              ))}
            </select>
          </div>
        </div> */}
        <div class="row">
          <div class="col-lg-8">
            <div class="row">
              <div class="col-lg-6 mb-4 mb-lg-0 custom-form">
                <label class="product__label accessibility" for="Quantity">
                  {theme.product.quantity}
                </label>
                <input
                  type="number"
                  id="Quantity"
                  name="quantity"
                  value="1"
                  min="1"
                />
              </div>
              {/* <div class="col-lg-6">
                <Button
                  type="button"
                  className="button--secondary w-100"
                  text={theme.cart.addToCart}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4 col-lg-8">
          {/* <div class="product__row">
            {product.selected_or_first_available_variant.available ? (
              <Button
                type="submit"
                other='name="add"'
                name="add"
                className="w-100"
                text={theme.cart.addToCart}
              />
            ) : (
              <Button
                type="submit"
                other='name="add"'
                disabled={true}
                text={theme.cart.soldOut}
              />
            )}
          </div> */}
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
