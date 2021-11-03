//@ts-ignore
import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { ProductType } from '../../types';
import '../../helpers/jquery.plugins';

interface PropsType {
  product: ProductType;
}

const ProductAccordion: FunctionComponent<PropsType> = ({ product }) => {
  const initAccordion = () => {
    //@ts-ignore
    ResponsiveHelper.addRange({
      '..1199': {
        on: function () {
          //@ts-ignore
          $('.menu-accordion').slideAccordion({
            allowClickWhenExpanded: true,
            activeClass: 'active',
            opener: '.menu-accordion__opener',
            slider: '.menu-accordion__slide',
            collapsible: true,
            event: 'click',
            animSpeed: 400,
          });
        },
        off: function () {
          //@ts-ignore
          $('.menu-accordion').slideAccordion('destroy');
        },
      },
    });
    //@ts-ignore
    $('.accordion').slideAccordion({
      allowClickWhenExpanded: false,
      activeClass: 'accordion--active',
      opener: '.accordion__opener',
      slider: '.accordion__slide',
      collapsible: true,
      event: 'click',
      animSpeed: 400,
    });
  };

  useEffect(() => {
    initAccordion();
  }, []);

  return (
    <ul class="accordion mb-6 rte">
      <li class="accordion--active">
        <a href="#" class="accordion__opener title-1">
          Product Details
        </a>
        <div class="accordion__slide">
          <div
            class="accordion__block"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>
      </li>
      <li>
        <a href="#" class="accordion__opener title-1">
          Specifications
        </a>
        <div class="accordion__slide">
          <div class="accordion__block">
            <dl>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Dimensions - Depth</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Dimensions - Depth</dt>
              <dd>CP.MA.0000017603</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
              <dt>Brand</dt>
              <dd>DJI</dd>
            </dl>
          </div>
        </div>
      </li>
      <li>
        <a href="#" class="accordion__opener title-1">
          Warranty & Services
        </a>
        <div class="accordion__slide">
          <div class="accordion__block">
            <div class="body-2">
              <p>Free Technical Support</p>
            </div>
          </div>
        </div>
      </li>
      <li>
        <a href="#" class="accordion__opener title-1">
          Shipping & Returns
        </a>
        <div class="accordion__slide">
          <div class="accordion__block">
            <ul>
              <li>
                Standard shipping via UPS Ground is included in the quoted
                price.
              </li>
              <li>Express shipping is via UPS.</li>
              <li>Please choose your shipping method at checkout.</li>
              <li>
                An additional Shipping and Handling fee will apply to express
                shipments. This fee will be quoted at checkout.
              </li>
              <li>
                Delivery is available to Alaska, Hawaii and Puerto Rico;
                however, an additional Shipping and Handling fee will apply.
                This fee will be quoted at checkout. Additional transit time may
                also be required.
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default ProductAccordion;
