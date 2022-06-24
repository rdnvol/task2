/// <reference path="../cypress.d.ts" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('visitProductPage', (productHandle: string) => {
  console.log('productHandle', productHandle);
  const url = `${Cypress.env('STORE')}${Cypress.env('productsUrl')}/${productHandle}?preview_theme_id=${Cypress.env(
    'THEME_ID'
  )}`;
  cy.visit(url);
});

Cypress.Commands.add('getByTestId', (id: string) => {
  cy.get(`[data-test-id="${id}"]`);
})

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
