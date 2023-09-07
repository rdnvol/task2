import { FunctionComponent, h } from 'preact';
import { Discount } from 'components/icons/Discount';

interface Props {
  title: string;
}

export const CartDiscountBlock: FunctionComponent<Props> = ({ title }) => (
  <div className="item-center flex">
    <div className="cart-drawer__discount base-body-text mr-1 shrink-0">
      <Discount />
    </div>
    <div>{title}</div>
  </div>
);
