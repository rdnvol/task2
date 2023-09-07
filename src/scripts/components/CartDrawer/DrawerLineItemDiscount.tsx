import { Discount } from 'components/icons/Discount';
import { Fragment, FunctionComponent, h } from 'preact';

interface Props {
  title: string;
}

export const DrawerLineItemDiscount: FunctionComponent<Props> = ({ title }) => (
  <Fragment>
    <div className="cart-drawer__discount base-body-text mr-1 shrink-0">
      <Discount />
    </div>
    <div>{title}</div>
  </Fragment>
);
