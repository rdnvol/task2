import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { v1 as uuid } from 'uuid';

import { ProductType } from 'types';

import ProductAccordionItem from './ProductAccordionItem';

interface PropsType {
  product: ProductType;
}

const ProductAccordion: FunctionComponent<PropsType> = ({ product }) => {
  const initAccordion = () => {
    window.ResponsiveHelper.addRange({
      '..1199': {
        on() {
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
        off() {
          $('.menu-accordion').slideAccordion('destroy');
        },
      },
    });

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
    <ul className="accordion mb-6 rte">
      {Array.from(Array(4)).map(
        (item, index) =>
          product.metafields.accordion.heading[index] && (
            <ProductAccordionItem
              heading={product.metafields.accordion.heading[index]}
              text={product.metafields.accordion.text[index]}
              active={index === 0}
              key={uuid()}
            />
          )
      )}
    </ul>
  );
};

export default ProductAccordion;
