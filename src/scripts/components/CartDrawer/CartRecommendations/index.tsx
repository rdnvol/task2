import { FunctionComponent, h } from 'preact';
import { Loader } from 'components/Loader';

import theme from 'helpers/themeSettings';
import { useCartRecommendations } from 'hooks/useCartRecommendations';
import ProductCard from './ProductCard';

export const CartRecommendations: FunctionComponent = () => {
  const { recomendationsJson } = useCartRecommendations();

  return (
    <div className="cart-drawer__recommendations base-footer-background -mx-4 -mt-4 mb-4 lg:mt-0 lg:flex lg:flex-col">
      <div className="title shrink-0 px-4 pt-3 lg:pb-3">{theme.cart.you_may_like}</div>
      <div className="recommendations-list-holder lg:h-100">
        <ul className="recommendations-list">
          {recomendationsJson !== null ? (
            <ul className="recommendations-list">
              {recomendationsJson?.slice(0, theme.cart.cartRecommendationsLimit).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          ) : (
            <Loader />
          )}
        </ul>
      </div>
    </div>
  );
};
