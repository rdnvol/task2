import { h, FunctionComponent, Fragment } from "preact";

import { Image } from "../Image";

const ProductOptionSelection = () => {
  return (
    <Fragment>
      <div class="row mb-2">
        <div class="col-sm-6 col-md-9 col-lg-6">
          <div class="product__variant-label-box mb-1">
            <span class="product__variant-label">Color:</span>
            <span>black</span>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-01"
              type="radio"
              name="filter-field-colors"
              checked
            />
            <label for="filter-field-colors-01" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-02"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-02" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-03"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-03" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-04"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-04" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-05"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-05" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-06"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-06" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
          <div class="input-holder custom-input custom-input--colors d-inline-flex">
            <input
              id="filter-field-colors-07"
              type="radio"
              name="filter-field-colors"
            />
            <label for="filter-field-colors-07" class="custom-label">
              {/* <Image sizes={["26x26", "26x26"]} /> */}
            </label>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-6 col-md-9 col-lg-6">
          <div class="product__variant-label-box mb-1">
            <span class="product__variant-label">Select size:</span>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-01"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-01" class="custom-label">
              <span>XXS</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-02"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-02" class="custom-label">
              <span>xs</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-03"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-03" class="custom-label">
              <span>s</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-04"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-04" class="custom-label">
              <span>m</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-05"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-05" class="custom-label">
              <span>l</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-06"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-06" class="custom-label">
              <span>xl</span>
            </label>
          </div>
          <div class="input-holder custom-input custom-input--size d-inline-flex">
            <input
              id="filter-field-size-07"
              type="radio"
              name="filter-field-size"
            />
            <label for="filter-field-size-07" class="custom-label">
              <span>xxl</span>
            </label>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductOptionSelection;
