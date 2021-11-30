//@ts-ignore
import {h, FunctionComponent, Fragment} from 'preact';
import '../../helpers/jquery.plugins';
import {ProductType} from '../../types';

interface PropsType {
  product: ProductType;
  heading: string,
  text: string,
  index: number
}

const ProductAccordionItem: FunctionComponent<PropsType> = ({product, heading, text, index}) => {
  return (
    <li className={index === 0 ? 'accordion--active' : ''}>
      <a href="#" className="accordion__opener title-1">
        {heading}
      </a>
      <div className="accordion__slide">
        <div
          className="accordion__block"
          dangerouslySetInnerHTML={{__html: text}}
        ></div>
      </div>
    </li>
  )
}

export default ProductAccordionItem;
