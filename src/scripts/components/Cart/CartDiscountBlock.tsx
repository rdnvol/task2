import { FunctionComponent, h } from 'preact';
import { Discount } from 'components/icons/Discount';

interface Props {
  title: string;
}

export const CartDiscountBlock: FunctionComponent<Props> = ({ title }) => (
  <li className="flex items-center">
    <div className="cart__ico-discount base-body-text mr-1 shrink-0">
      <Discount />
    </div>
    {title}
  </li>
);
