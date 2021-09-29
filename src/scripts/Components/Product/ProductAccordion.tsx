import { h, FunctionComponent } from "preact";

const ProductAccordion: FunctionComponent = () => {
  return (
    <ul class="accordion mb-6 rte">
      <li class="accordion--active">
        <a href="#" class="accordion__opener title-1">
          Product Details
        </a>
        <div class="accordion__slide">
          <div class="accordion__block">
            <div class="title-1 mb-2">DJI Mavic Air 2 Key Features</div>
            <ul>
              <li>8K Hyperlapse Time-Lapse Video</li>
              <li>8K Hyperlapse Time-Lapse Video</li>
              <li>8K Hyperlapse Time-Lapse Video</li>
              <li>8K Hyperlapse Time-Lapse Video</li>
            </ul>
            <div class="body-2">
              <p>
                A midrange drone with flagship features, the DJI Mavic Air 2
                combines a foldable and portable frame with a high-end camera
                system. The 3-axis gimbal sports a 1/2" CMOS sensor capable of
                capturing 8K Hyperlapse time-lapse shots, 4K60 video, 240 fps
                slow-motion 1080p video, and up to 48MP stills.
              </p>
            </div>
          </div>
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
