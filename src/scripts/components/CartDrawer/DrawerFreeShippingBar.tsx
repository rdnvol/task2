import { Discount } from 'components/icons/Discount';
import { FunctionComponent, h } from 'preact';
import { formatMoney } from '@shopify/theme-currency/currency';
import theme from 'helpers/themeSettings';

interface Props {
  threshold: number;
}

export const DrawerFreeShippingBar: FunctionComponent<Props> = ({ threshold }) => {
  const progressPercents = ((theme.cart.cartTargetPrice - threshold) * 100) / theme.cart.cartTargetPrice;

  return (
    <div className="p-4">
      {threshold > 0 ? (
        <div className="body-small mb-3">
          {theme.cart.free_shipping_left.replace('{{ price }}', formatMoney(threshold, theme.moneyFormat))}
        </div>
      ) : (
        <div className="body-small mb-3">{theme.cart.free_shipping_riched}</div>
      )}
      <progress
        max="100"
        value={progressPercents}
      />
    </div>
  );
};
