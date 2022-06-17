import { h, FunctionComponent } from 'preact';

interface PropsType {
  heading: string;
  text: string;
  active: boolean;
}

const ProductAccordionItem: FunctionComponent<PropsType> = ({ heading, text, active }) => (
  <li className={active ? 'accordion--active' : ''}>
    <a href="#" className="accordion__opener title-1">
      {heading}
    </a>
    <div className="accordion__slide">
      <div className="accordion__block" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </li>
);

export default ProductAccordionItem;
