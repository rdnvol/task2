import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { formatMoney } from '@shopify/theme-currency/currency';
import { addItem } from 'store/features/cart/cartSlice';

import { CartItem } from 'types';
import theme from 'helpers/themeSettings';

import { useDispatch } from 'react-redux';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';

interface PropsType {
  item?: CartItem;
}

const ProductCard = ({ product }) => {
  const { url, first_available_variant, vendor, title } = product;
  const dispatch = useDispatch();
  const [productAdding, setProductAdding] = useState(false);

  const handleATC = () => {
    setProductAdding(true);

    try {
      dispatch(
        addItem({
          id: first_available_variant.id,
          quantity: {
            quantity: 1,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderImage = ({ media, productUrl, productTitle }) =>
    media[0].src && (
      <div className="cart-drawer__item-img mr-5 shrink-0">
        <a
          href={productUrl}
          className="block"
          aria-label={productTitle}
        >
          <Image
            src={media[0].src}
            sizes={['64x82', '90x112', '90x112']}
            ratio={media.aspect_ratio}
            alt={media.alt}
          />
        </a>
      </div>
    );

  const renderUnitPrice = ({ unit_price, reference_value, reference_unit }) => {
    if (unit_price) {
      const unitPrice = formatMoney(unit_price, theme.moneyFormat);

      const referenceUnit = reference_value !== 1 ? `${reference_value} ${reference_unit}` : reference_unit;

      return (
        <div className="product-price-small">
          {unitPrice} / {referenceUnit}
        </div>
      );
    }
  };

  const renderPrice = ({ compare_at_price, price }) => {
    if (compare_at_price !== price && compare_at_price !== null) {
      return (
        <Fragment>
          <del>{formatMoney(price)}</del>
          <ins>{formatMoney(compare_at_price)}</ins>
        </Fragment>
      );
    }

    return <div>{formatMoney(price)}</div>;
  };

  return (
    <li className="recommendations-list__item flex px-4 lg:flex-col">
      <div className="cart-drawer__item flex w-100 py-3">
        {renderImage(product)}

        <div className="flex w-100 flex-col justify-between lg:block">
          <div>
            <div className="body-small">{vendor}</div>
            <div className="flex justify-between">
              <div>
                <div className="title mb-2">
                  <a
                    href={url}
                    className="inline-block align-top no-underline hover:opacity-90"
                  >
                    {title}
                  </a>
                </div>
                {product.unit_price_measurement && (
                  <div className="mb-2">{renderUnitPrice(product.unit_price_measurement)}</div>
                )}
              </div>
              <div className="cart-drawer__price-box product-price-large base-secondary-text ml-1 shrink-0 text-right">
                {renderPrice(product)}
              </div>
            </div>
          </div>
          <div>
            {!productAdding ? (
              <button
                type="button"
                className="button default"
                onClick={handleATC}
              >
                <span className="body-small">{`+ ${theme.cart.addToCart}`}</span>
              </button>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductCard;
