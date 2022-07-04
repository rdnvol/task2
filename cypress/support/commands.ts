/// <reference path="../cypress.d.ts" />

Cypress.Commands.add('visitProductPage', (productHandle: string) => {
  const url = `${Cypress.env('STORE')}${Cypress.env('productsUrl')}/${productHandle}?preview_theme_id=${Cypress.env(
    'THEME_ID'
  )}`;
  cy.visit(url);
});

Cypress.Commands.add('getByTestId', (id: string) => {
  cy.get(`[data-test-id="${id}"]`);
})
