import { Discount } from 'components/icons/Discount';
import { FunctionComponent, h } from 'preact';

interface Props {
  title: string;
}

export const LineItemDiscountBlock: FunctionComponent<Props> = ({ title }) => (
  <li className="item-center flex">
    <div className="cart__ico-discount base-body-text mr-1 shrink-0">
      <Discount />
    </div>
    {title}
  </li>
);
