import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { v1 as uuid } from 'uuid';

import { ProductType } from 'types';

import { Accordion } from 'accordion-js';
import ProductAccordionItem from './ProductAccordionItem';

interface PropsType {
  product: ProductType;
}

const ProductAccordion: FunctionComponent<PropsType> = ({ product }) => {
  const initAccordion = () => {
    document.querySelectorAll('.js-accordion').forEach((item) => {
      const accordion = new Accordion(item, {
        duration: 400,
        collapse: true,
        showMultiple: false,
      });
    });
  };

  useEffect(() => {
    initAccordion();
  }, []);

  return (
    <ul className="accordion rte js-accordion mb-6">
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
