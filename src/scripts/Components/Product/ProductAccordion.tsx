//@ts-ignore
import { h, FunctionComponent, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';

import { ProductType } from '../../types';
import ProductAccordionItem from './ProductAccordionItem';
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
    <ul className="accordion mb-6 rte">
      {Array.from(Array(4)).map((item, index) => product.metafields.accordion.heading[index] ?
        <ProductAccordionItem
          product={product}
          heading={product.metafields.accordion.heading[index]}
          text={product.metafields.accordion.text[index]}
          active={index === 0}
          key={index}/> : false
      )}
    </ul>
  );
};

export default ProductAccordion;
