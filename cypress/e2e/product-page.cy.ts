describe('product page', () => {
  beforeEach(() => {
    cy.visitProductPage('small-naomi');
  });

  it('should add product to cart', () => {
    cy.get('[data-shopify="payment-button"]').scrollIntoView().should('be.visible');
    cy.getByTestId('add-to-cart').should('be.visible').submit();
    cy.get('.cart-popup').within(() => {
      cy.contains('Small Naomi').should('be.visible');
      cy.getByTestId('added-quantity').should('contain.text', '1');
    });
  });
});
