import { h, FunctionComponent } from 'preact';

interface PropsType {
  heading: string;
  text: string;
  active: boolean;
}

const ProductAccordionItem: FunctionComponent<PropsType> = ({ heading, text, active }) => (
  <li className="ac {active ? 'accordion--active' : ''}">
    <button
      type="button"
      className="accordion__opener ac-trigger title w-100"
    >
      {heading}
    </button>
    <div className="accordion__slide ac-panel">
      <div
        className="accordion__block"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  </li>
);

export default ProductAccordionItem;
