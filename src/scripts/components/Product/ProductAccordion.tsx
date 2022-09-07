import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { v1 as uuid } from 'uuid';

import { ProductType } from 'types';

import { Accordion } from 'accordion';
import ProductAccordionItem from './ProductAccordionItem';

interface PropsType {
  product: ProductType;
}

const ProductAccordion: FunctionComponent<PropsType> = ({ product }) => {
  const initAccordion = () => {
    window.ResponsiveHelper.addRange({
      '..1199': {
        on() {
          document.querySelectorAll('.js-menu-accordion').forEach((item) => {
            const accordionMenu = new Accordion(item, {
              modal: true, // Limit the accordion to having only one fold open at a time.
              noAria: true,
              closeClass: 'close',
              enabledClass: 'enabled',
              openClass: 'open',
              heightOffset: 0,
              useBorders: false,
            });
          });
        },
      },
    });

    document.querySelectorAll('.js-accordion').forEach((item) => {
      const accordion = new Accordion(item, {
        modal: true, // Limit the accordion to having only one fold open at a time.
        closeClass: 'close',
        enabledClass: 'enabled',
        openClass: 'open',
        heightOffset: 10,
        useBorders: true,
      });
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
